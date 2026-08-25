import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isStripeEnabled } from "@/lib/payments/config";
import { getStripeClient } from "@/lib/payments/stripe";
import { getOrCreateStripeCustomerId } from "@/lib/payments/stripeCustomer";
import { logAudit } from "@/lib/supabase/audit";

/**
 * Only `orderId` is accepted here — NOT a client-supplied amount. The PaymentIntent amount is
 * always order.total from the database, recomputed server-side, per the "never trust client
 * payment amounts" rule. (The original spec sketch mentions validating an "amount" field; this
 * intentionally never reads one from the request body.)
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
  if (order.payment_status !== "pending") {
    return NextResponse.json({ error: "This order has already been paid" }, { status: 409 });
  }

  if (!isStripeEnabled()) {
    return NextResponse.json({ clientSecret: "placeholder", enabled: false });
  }

  const stripe = getStripeClient();
  if (!stripe) {
    return NextResponse.json({ clientSecret: "placeholder", enabled: false });
  }

  try {
    const stripeCustomerId = await getOrCreateStripeCustomerId(user.id, user.email);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.total) * 100),
      currency: "usd",
      customer: stripeCustomerId,
      metadata: { order_id: orderId, order_number: order.order_number },
    });

    await admin
      .from("orders")
      .update({ stripe_payment_intent_id: paymentIntent.id })
      .eq("id", orderId);

    await admin.from("payment_attempts").insert({
      order_id: orderId,
      payment_method: "stripe",
      amount: order.total,
      status: "initiated",
      provider_reference: paymentIntent.id,
    });

    await logAudit({
      action: "update",
      table: "orders",
      recordId: orderId,
      newData: { stripe_payment_intent_id: paymentIntent.id },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret, enabled: true });
  } catch (err) {
    await admin.from("payment_attempts").insert({
      order_id: orderId,
      payment_method: "stripe",
      amount: order.total,
      status: "failed",
      error_message: err instanceof Error ? err.message : "Unknown error",
    });
    return NextResponse.json({ error: "Unable to create payment intent" }, { status: 500 });
  }
}
