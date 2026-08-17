import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { findCartId, loadCart } from "@/lib/cart/getCart";
import { sendOrderConfirmation, sendAdminFormNotification } from "@/lib/email/send";
import { logAudit } from "@/lib/supabase/audit";

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

  // Snapshot from the cart's own price_snapshot values — never trust client-supplied prices.
  const items = cart.items.map((item) => ({
    product_id: item.product_id,
    name: item.product?.name ?? "Unknown product",
    quantity: item.quantity,
    price: item.price_snapshot,
  }));
  const total = cart.total;

  const admin = createAdminClient();

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

  await logAudit({
    action: "create",
    table: "orders",
    recordId: orderId,
    newData: { order_number: orderNumber, total },
  });

  await sendOrderConfirmation(user.email, { orderNumber, items, shippingAddress, total });
  await sendAdminFormNotification("Order", {
    name: customerName || user.email,
    email: user.email,
    message: `Order ${orderNumber} — $${total.toFixed(2)}`,
  });

  return NextResponse.json({ order_number: orderNumber, order_id: orderId, total });
}
