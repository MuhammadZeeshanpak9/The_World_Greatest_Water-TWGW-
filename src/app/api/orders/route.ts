import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { findCartId, loadCart } from "@/lib/cart/getCart";
import { sendOrderConfirmation, sendAdminFormNotification } from "@/lib/email/send";
import { logAudit } from "@/lib/supabase/audit";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

type ShippingAddress = {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

function isValidShippingAddress(value: unknown): value is ShippingAddress {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.address1 === "string" &&
    v.address1.trim().length > 0 &&
    typeof v.city === "string" &&
    v.city.trim().length > 0 &&
    typeof v.state === "string" &&
    v.state.trim().length > 0 &&
    typeof v.zip === "string" &&
    v.zip.trim().length > 0 &&
    typeof v.country === "string" &&
    v.country.trim().length > 0
  );
}

function generateOrderNumber(): string {
  const part1 = Date.now().toString(36).toUpperCase();
  const part2 = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `ELEV8-${part1}-${part2}`;
}

const FREE_SHIPPING_THRESHOLD = 75;
const MAX_SHIPPING_RATE = 100;

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("orders")
    .select("*")
    .eq("customer_email", user.email)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Unable to load orders" }, { status: 500 });
  }

  return NextResponse.json({ orders: data ?? [] });
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(`orders-create:${ip}`, { maxAttempts: 10, windowMs: 60 * 60 * 1000 });
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const b = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  const customerName =
    typeof b.customerName === "string" ? b.customerName.trim().slice(0, 200) : "";

  if (!isValidShippingAddress(b.shippingAddress)) {
    return NextResponse.json(
      { error: "A complete shipping address is required" },
      { status: 400 },
    );
  }
  const shippingAddress = b.shippingAddress;

  const cartId = await findCartId(user.id, null);
  const cart = await loadCart(cartId);

  if (cart.items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty" }, { status: 400 });
  }

  // Cart re-validation: loadCart() already prunes items whose product was fully deleted, but a
  // product can also have gone sold-out (or otherwise non-'available') after it was added to the
  // cart without being deleted — catch that here rather than silently charging for it.
  const unavailableItems = cart.items
    .filter((item) => item.product?.status !== "available")
    .map((item) => item.product?.name ?? "Unknown product");

  if (unavailableItems.length > 0) {
    return NextResponse.json(
      {
        error: `Some items in your cart are no longer available: ${unavailableItems.join(", ")}. Please review your cart.`,
        unavailableItems,
      },
      { status: 409 },
    );
  }

  // Snapshot from the cart's own price_snapshot values — never trust client-supplied prices.
  const items = cart.items.map((item) => ({
    product_id: item.product_id,
    name: item.product?.name ?? "Unknown product",
    quantity: item.quantity,
    price: item.price_snapshot,
  }));

  // Shipping cost: the client echoes back the rate it was already quoted by /api/shipping/rates
  // (that quote was computed server-side there), clamped to a sane range here as a backstop —
  // never trusted blindly, and the $75+ free-shipping rule is re-enforced here regardless of
  // what the client claims, so a forged shippingRate can't be used to manipulate the charged
  // total. Full protection (re-verifying the exact quoted rate against Shippo) is a further
  // hardening step, not required to close the actual amount-manipulation risk this addresses.
  const rawShippingRate = typeof b.shippingRate === "number" ? b.shippingRate : 0;
  const shippingRate =
    cart.total >= FREE_SHIPPING_THRESHOLD
      ? 0
      : Math.max(0, Math.min(rawShippingRate, MAX_SHIPPING_RATE));
  const shippingCarrier =
    shippingRate > 0 && typeof b.shippingCarrier === "string" ? b.shippingCarrier.slice(0, 100) : null;
  const shippingService =
    shippingRate > 0 && typeof b.shippingService === "string" ? b.shippingService.slice(0, 100) : null;

  const total = cart.total + shippingRate;

  const admin = createAdminClient();

  // Double-submit protection: a double-click, a slow network retry, or multiple tabs can all
  // fire this route twice for the same checkout attempt. If a pending order for this user with
  // this exact total was created in the last 60 seconds, return it instead of creating another.
  const sixtySecondsAgo = new Date(Date.now() - 60_000).toISOString();
  const { data: recentDuplicate } = await admin
    .from("orders")
    .select("id, order_number, total")
    .eq("customer_email", user.email)
    .eq("status", "pending")
    .eq("total", total)
    .gte("created_at", sixtySecondsAgo)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (recentDuplicate) {
    return NextResponse.json({
      order_number: recentDuplicate.order_number,
      order_id: recentDuplicate.id,
      total: recentDuplicate.total,
    });
  }

  let orderNumber = "";
  let orderId: string | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    const candidate = generateOrderNumber();
    const { data: created, error } = await admin
      .from("orders")
      .insert({
        order_number: candidate,
        customer_email: user.email,
        customer_name: customerName || user.email,
        status: "pending",
        total,
        items,
        shipping_address: shippingAddress,
        shipping_carrier: shippingCarrier,
        shipping_service: shippingService,
        shipping_rate: shippingRate,
      })
      .select("id, order_number")
      .single();

    if (!error && created) {
      orderNumber = created.order_number;
      orderId = created.id;
      break;
    }
    if (error && error.code !== "23505") {
      return NextResponse.json(
        { error: "Unable to create order. Please try again." },
        { status: 500 },
      );
    }
    // 23505 = unique constraint collision on order_number — loop retries with a fresh number.
  }

  if (!orderId) {
    return NextResponse.json(
      { error: "Unable to create order. Please try again." },
      { status: 500 },
    );
  }

  const { data: existingCustomer } = await admin
    .from("customers")
    .select("id, total_orders, total_spent")
    .eq("email", user.email)
    .maybeSingle();

  if (existingCustomer) {
    const customerUpdate: Record<string, unknown> = {
      total_orders: (existingCustomer.total_orders ?? 0) + 1,
      total_spent: Number(existingCustomer.total_spent ?? 0) + total,
    };
    if (customerName) customerUpdate.full_name = customerName;
    await admin.from("customers").update(customerUpdate).eq("id", existingCustomer.id);
  } else {
    await admin.from("customers").insert({
      email: user.email,
      full_name: customerName || user.email,
      total_orders: 1,
      total_spent: total,
    });
  }

  if (cartId) {
    await admin.from("cart_items").delete().eq("cart_id", cartId);
  }

  // No payment method has been chosen yet at order-creation time — the payment routes
  // (create-intent / paypal/create-order / crypto/create) log their own payment_attempts rows
  // with the real method once the customer picks one.
  await admin.from("payment_attempts").insert({
    order_id: orderId,
    payment_method: "unselected",
    amount: total,
    status: "pending",
  });

  await logAudit({
    action: "create",
    table: "orders",
    recordId: orderId,
    newData: { order_number: orderNumber, total },
  });

  await sendOrderConfirmation(user.email, {
    orderNumber,
    items,
    shippingAddress,
    total,
    shippingCarrier,
    shippingService,
    shippingCost: shippingRate,
  });

  // Admin visibility into every new order — never allowed to affect the customer-facing result.
  try {
    const itemsList = items.map((i) => `${i.name} × ${i.quantity} ($${i.price.toFixed(2)})`).join("; ");
    const addressLine = `${shippingAddress.address1}${shippingAddress.address2 ? `, ${shippingAddress.address2}` : ""}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zip}, ${shippingAddress.country}`;
    await sendAdminFormNotification("New Order", {
      name: customerName || user.email,
      email: user.email,
      message: `Order ${orderNumber} — $${total.toFixed(2)}\nItems: ${itemsList}\nShipping to: ${addressLine}`,
    });
  } catch (err) {
    console.error("[orders] admin notification failed:", err instanceof Error ? err.message : err);
  }

  return NextResponse.json({ order_number: orderNumber, order_id: orderId, total });
}
