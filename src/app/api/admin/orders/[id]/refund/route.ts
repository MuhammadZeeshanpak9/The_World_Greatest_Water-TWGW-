import { NextResponse, type NextRequest } from "next/server";
import { getAdminUser, unauthorized } from "@/lib/supabase/authz";
import { createAdminClient } from "@/lib/supabase/admin";
import { isStripeEnabled } from "@/lib/payments/config";
import { getStripeClient } from "@/lib/payments/stripe";
import { sendRefundConfirmation } from "@/lib/email/send";
import { logAudit } from "@/lib/supabase/audit";

type Params = { params: Promise<{ id: string }> };

/** Refund shell — disabled entirely while Stripe is on a placeholder key (checked here too, not
 * just in the UI, since the UI disabled state alone isn't a security boundary). Activates with
 * zero code changes once real Stripe keys arrive. */
export async function POST(_request: NextRequest, { params }: Params) {
  const user = await getAdminUser();
  if (!user) return unauthorized();

  const { id } = await params;
  const admin = createAdminClient();

  const { data: order } = await admin.from("orders").select("*").eq("id", id).maybeSingle();
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.payment_status !== "paid") {
    return NextResponse.json({ error: "Only paid orders can be refunded" }, { status: 409 });
  }

  if (!isStripeEnabled()) {
    return NextResponse.json({ error: "Refunds available after payment integration" }, { status: 400 });
  }

  const stripe = getStripeClient();
  if (!stripe || !order.stripe_payment_intent_id) {
    return NextResponse.json({ error: "No Stripe payment found for this order" }, { status: 400 });
  }

  try {
    await stripe.refunds.create({ payment_intent: order.stripe_payment_intent_id });

    const { data: updated } = await admin
      .from("orders")
      .update({ payment_status: "refunded", updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    await admin.from("payment_attempts").insert({
      order_id: id,
      payment_method: order.payment_method ?? "stripe",
      amount: order.total,
      status: "refunded",
      provider_reference: order.stripe_payment_intent_id,
    });

    await logAudit({ action: "update", table: "orders", recordId: id, oldData: order, newData: updated });

    if (order.customer_email) {
      await sendRefundConfirmation(order.customer_email, order.order_number, Number(order.total));
    }

    return NextResponse.json({ order: updated });
  } catch (err) {
    console.error("[admin/orders/refund] failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Unable to process refund" }, { status: 500 });
  }
}
