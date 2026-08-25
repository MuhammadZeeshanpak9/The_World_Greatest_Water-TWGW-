import { NextResponse, type NextRequest } from "next/server";
import { after } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyCoinbaseWebhook } from "@/lib/payments/coinbase";
import { sendOrderConfirmation } from "@/lib/email/send";
import { logAudit } from "@/lib/supabase/audit";

type CoinbaseWebhookPayload = {
  event?: {
    type?: string;
    data?: { code?: string; id?: string };
  };
};

/**
 * DB write happens synchronously before the response; only the confirmation email is deferred
 * via after() — same discipline as the Cal.com/Shippo webhooks. Coinbase's real webhook event
 * taxonomy (charge:created/confirmed/failed/delayed/pending/resolved) doesn't document a literal
 * "charge:expired" type as far as I could confirm — handling it defensively anyway per your
 * instruction, in case a charge's timeline reaching EXPIRED surfaces through it; harmless no-op
 * if Coinbase never actually sends it.
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("X-CC-Webhook-Signature");

  if (!verifyCoinbaseWebhook(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: CoinbaseWebhookPayload;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const eventType = body.event?.type ?? "";
  const chargeId = body.event?.data?.code ?? body.event?.data?.id;
  if (!chargeId) {
    return NextResponse.json({ received: true });
  }

  const admin = createAdminClient();
  const { data: charge } = await admin
    .from("crypto_charges")
    .select("*")
    .eq("coinbase_charge_id", chargeId)
    .maybeSingle();

  if (!charge) {
    return NextResponse.json({ received: true });
  }

  if (eventType === "charge:confirmed") {
    await admin
      .from("crypto_charges")
      .update({ status: "confirmed", updated_at: new Date().toISOString() })
      .eq("id", charge.id);
    await logAudit({
      action: "update",
      table: "crypto_charges",
      recordId: charge.id,
      oldData: charge,
      newData: { status: "confirmed" },
    });

    const { data: order } = await admin
      .from("orders")
      .select("*")
      .eq("id", charge.order_id)
      .maybeSingle();

    if (order) {
      const { data: updatedOrder } = await admin
        .from("orders")
        .update({ payment_status: "paid", payment_method: "crypto", updated_at: new Date().toISOString() })
        .eq("id", order.id)
        .select()
        .single();

      await logAudit({
        action: "update",
        table: "orders",
        recordId: order.id,
        oldData: order,
        newData: updatedOrder,
      });

      after(async () => {
        await sendOrderConfirmation(order.customer_email, {
          orderNumber: order.order_number,
          items: order.items,
          shippingAddress: order.shipping_address,
          total: order.total,
          shippingCarrier: order.shipping_carrier,
          shippingService: order.shipping_service,
          shippingCost: order.shipping_rate,
          trackingNumber: order.tracking_number,
        });
      });
    }
  } else if (eventType === "charge:failed") {
    await admin
      .from("crypto_charges")
      .update({ status: "failed", updated_at: new Date().toISOString() })
      .eq("id", charge.id);

    await logAudit({ action: "update", table: "crypto_charges", recordId: charge.id, newData: { status: "failed" } });
  } else if (eventType === "charge:expired") {
    await admin
      .from("crypto_charges")
      .update({ status: "expired", updated_at: new Date().toISOString() })
      .eq("id", charge.id);

    await logAudit({ action: "update", table: "crypto_charges", recordId: charge.id, newData: { status: "expired" } });
  }

  return NextResponse.json({ received: true });
}
