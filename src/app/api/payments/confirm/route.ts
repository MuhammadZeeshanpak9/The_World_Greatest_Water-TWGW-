import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isStripeEnabled } from "@/lib/payments/config";
import { getStripeClient } from "@/lib/payments/stripe";
import { sendOrderConfirmation } from "@/lib/email/send";
import { logAudit } from "@/lib/supabase/audit";

/**
 * Never trusts a client claim of "payment succeeded" — when Stripe is enabled, the PaymentIntent
 * status is re-fetched from Stripe itself (using the ID already stored on the order, not one
 * supplied by the client) before the order is marked paid.
 */
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
  const orderId = typeof b.orderId === "string" ? b.orderId : "";
  if (!orderId) {
    return NextResponse.json({ error: "orderId is required" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: order } = await admin.from("orders").select("*").eq("id", orderId).maybeSingle();
  if (!order || order.customer_email !== user.email) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.payment_status === "paid") {
    return NextResponse.json({ success: true, alreadyPaid: true });
  }

  if (!isStripeEnabled()) {
    // Testing mode — no real processor is configured, so simulate success rather than block the
    // rest of the checkout flow from being exercised end-to-end.
    const { data: updated } = await admin
      .from("orders")
      .update({ payment_status: "paid", payment_method: "stripe", updated_at: new Date().toISOString() })
      .eq("id", orderId)
      .select()
      .single();

    await admin.from("payment_attempts").insert({
      order_id: orderId,
      payment_method: "stripe",
      amount: order.total,
      status: "succeeded",
      error_message: null,
    });

    await logAudit({ action: "update", table: "orders", recordId: orderId, oldData: order, newData: updated });
    await sendOrderConfirmation(user.email, {
      orderNumber: order.order_number,
      items: order.items,
      shippingAddress: order.shipping_address,
      total: order.total,
      shippingCarrier: order.shipping_carrier,
      shippingService: order.shipping_service,
      shippingCost: order.shipping_rate,
      trackingNumber: order.tracking_number,
    });

    return NextResponse.json({ success: true, simulated: true });
  }

  const stripe = getStripeClient();
  if (!stripe || !order.stripe_payment_intent_id) {
    return NextResponse.json({ error: "No payment in progress for this order" }, { status: 400 });
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(order.stripe_payment_intent_id);

  if (paymentIntent.status !== "succeeded") {
    return NextResponse.json({ success: false, status: paymentIntent.status });
  }

  const { data: updated } = await admin
    .from("orders")
    .update({ payment_status: "paid", payment_method: "stripe", updated_at: new Date().toISOString() })
    .eq("id", orderId)
    .select()
    .single();

  await admin.from("payment_attempts").insert({
    order_id: orderId,
    payment_method: "stripe",
    amount: order.total,
    status: "succeeded",
    provider_reference: paymentIntent.id,
  });

  await logAudit({ action: "update", table: "orders", recordId: orderId, oldData: order, newData: updated });
  await sendOrderConfirmation(user.email, {
    orderNumber: order.order_number,
    items: order.items,
    shippingAddress: order.shipping_address,
    total: order.total,
  });

  return NextResponse.json({ success: true });
}
