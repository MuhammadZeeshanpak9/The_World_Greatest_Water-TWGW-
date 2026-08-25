import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isPayPalEnabled } from "@/lib/payments/config";
import { getPayPalClient } from "@/lib/payments/paypal";
import { logAudit } from "@/lib/supabase/audit";

/** Amount is always order.total from the database — never a client-supplied number. */
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
  if (order.payment_status !== "pending") {
    return NextResponse.json({ error: "This order has already been paid" }, { status: 409 });
  }

  const paypal = getPayPalClient();
  if (!paypal) {
    return NextResponse.json({ enabled: false });
  }

  try {
    const paypalOrder = await paypal.createOrder(Number(order.total));

    await admin.from("orders").update({ paypal_order_id: paypalOrder.id }).eq("id", orderId);
    await admin.from("payment_attempts").insert({
      order_id: orderId,
      payment_method: "paypal",
      amount: order.total,
      status: "initiated",
      provider_reference: paypalOrder.id,
    });
    await logAudit({
      action: "update",
      table: "orders",
      recordId: orderId,
      newData: { paypal_order_id: paypalOrder.id },
    });

    return NextResponse.json({ orderId: paypalOrder.id, enabled: true });
  } catch (err) {
    await admin.from("payment_attempts").insert({
      order_id: orderId,
      payment_method: "paypal",
      amount: order.total,
      status: "failed",
      error_message: err instanceof Error ? err.message : "Unknown error",
    });
    return NextResponse.json({ error: "Unable to create PayPal order" }, { status: 500 });
  }
}
