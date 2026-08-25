import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isPayPalEnabled } from "@/lib/payments/config";
import { getPayPalClient } from "@/lib/payments/paypal";
import { sendOrderConfirmation } from "@/lib/email/send";
import { logAudit } from "@/lib/supabase/audit";

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

  if (!isPayPalEnabled()) {
    return NextResponse.json({ enabled: false });
  }

  const admin = createAdminClient();
  const { data: order } = await admin.from("orders").select("*").eq("id", orderId).maybeSingle();
  if (!order || order.customer_email !== user.email) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (!order.paypal_order_id) {
    return NextResponse.json({ error: "No PayPal order in progress for this order" }, { status: 400 });
  }
  if (order.payment_status === "paid") {
    return NextResponse.json({ success: true, alreadyPaid: true });
  }

  const paypal = getPayPalClient();
  if (!paypal) {
    return NextResponse.json({ enabled: false });
  }

  try {
    await paypal.captureOrder(order.paypal_order_id);

    const { data: updated } = await admin
      .from("orders")
      .update({ payment_status: "paid", payment_method: "paypal", updated_at: new Date().toISOString() })
      .eq("id", orderId)
      .select()
      .single();

    await admin.from("payment_attempts").insert({
      order_id: orderId,
      payment_method: "paypal",
      amount: order.total,
      status: "succeeded",
      provider_reference: order.paypal_order_id,
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

    return NextResponse.json({ success: true, enabled: true });
  } catch (err) {
    await admin.from("payment_attempts").insert({
      order_id: orderId,
      payment_method: "paypal",
      amount: order.total,
      status: "failed",
      error_message: err instanceof Error ? err.message : "Unknown error",
    });
    return NextResponse.json({ error: "Unable to capture PayPal order" }, { status: 500 });
  }
}
