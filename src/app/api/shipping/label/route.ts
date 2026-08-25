import { NextResponse, type NextRequest } from "next/server";
import { getAdminUser, unauthorized } from "@/lib/supabase/authz";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/supabase/audit";
import { isShippoEnabled } from "@/lib/payments/config";
import { createShippingLabel } from "@/lib/shipping/shippo";
import { sendShippingConfirmation } from "@/lib/email/send";

/** Admin-only — only staff generate shipping labels, never customers. */
export async function POST(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return unauthorized();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const b = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  const orderId = typeof b.orderId === "string" ? b.orderId : "";
  const rateId = typeof b.rateId === "string" ? b.rateId : "";
  const carrier = typeof b.carrier === "string" ? b.carrier : "USPS";
  const service = typeof b.service === "string" ? b.service : "Priority Mail";
  const rateAmount = typeof b.rateAmount === "number" ? b.rateAmount : 0;

  if (!orderId || !rateId) {
    return NextResponse.json({ error: "orderId and rateId are required" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: order } = await admin.from("orders").select("*").eq("id", orderId).maybeSingle();
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  let label: { tracking_number: string; label_url: string };

  if (!isShippoEnabled()) {
    label = {
      tracking_number: `MOCK${Date.now().toString(36).toUpperCase()}`,
      label_url: "https://example.com/mock-label.pdf",
    };
  } else {
    const created = await createShippingLabel(rateId);
    if (!created) {
      return NextResponse.json({ error: "Unable to generate shipping label" }, { status: 500 });
    }
    label = created;
  }

  const { error: labelInsertError } = await admin.from("shipping_labels").insert({
    order_id: orderId,
    shippo_label_id: rateId,
    carrier,
    service,
    tracking_number: label.tracking_number,
    label_url: label.label_url,
    rate: rateAmount,
  });
  if (labelInsertError) {
    return NextResponse.json({ error: "Unable to save shipping label" }, { status: 500 });
  }

  const { data: updatedOrder, error: updateError } = await admin
    .from("orders")
    .update({
      tracking_number: label.tracking_number,
      label_url: label.label_url,
      shipping_carrier: carrier,
      shipping_service: service,
      shipping_rate: rateAmount,
      shipped_at: new Date().toISOString(),
      status: "shipped",
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .select()
    .single();
  if (updateError) {
    return NextResponse.json({ error: "Label created but order update failed" }, { status: 500 });
  }

  await logAudit({
    action: "update",
    table: "orders",
    recordId: orderId,
    oldData: order,
    newData: updatedOrder,
  });

  if (order.customer_email) {
    await sendShippingConfirmation(order.customer_email, {
      orderNumber: order.order_number,
      trackingNumber: label.tracking_number,
      carrier,
    });
  }

  return NextResponse.json({
    tracking_number: label.tracking_number,
    label_url: label.label_url,
    carrier,
  });
}
