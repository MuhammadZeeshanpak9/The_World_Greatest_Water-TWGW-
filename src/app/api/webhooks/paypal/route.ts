import { NextResponse, type NextRequest } from "next/server";
import { after } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyPayPalWebhook } from "@/lib/payments/paypal";
import { sendOrderConfirmation } from "@/lib/email/send";
import { logAudit } from "@/lib/supabase/audit";

type PayPalWebhookPayload = {
  event_type?: string;
  resource?: {
    id?: string;
    supplementary_data?: { related_ids?: { order_id?: string } };
  };
};

export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  const verified = await verifyPayPalWebhook(
    {
      transmissionId: request.headers.get("paypal-transmission-id"),
      transmissionTime: request.headers.get("paypal-transmission-time"),
      certUrl: request.headers.get("paypal-cert-url"),
      authAlgo: request.headers.get("paypal-auth-algo"),
      transmissionSig: request.headers.get("paypal-transmission-sig"),
    },
    rawBody,
  );
  if (!verified) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: PayPalWebhookPayload;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (body.event_type === "PAYMENT.CAPTURE.COMPLETED") {
    const paypalOrderId = body.resource?.supplementary_data?.related_ids?.order_id ?? body.resource?.id;
    if (!paypalOrderId) {
      return NextResponse.json({ received: true });
    }

    const admin = createAdminClient();
    const { data: order } = await admin
      .from("orders")
      .select("*")
      .eq("paypal_order_id", paypalOrderId)
      .maybeSingle();

    if (order && order.payment_status !== "paid") {
      const { data: updated } = await admin
        .from("orders")
        .update({ payment_status: "paid", payment_method: "paypal", updated_at: new Date().toISOString() })
        .eq("id", order.id)
        .select()
        .single();

      await logAudit({ action: "update", table: "orders", recordId: order.id, oldData: order, newData: updated });

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
  }

  return NextResponse.json({ received: true });
}
