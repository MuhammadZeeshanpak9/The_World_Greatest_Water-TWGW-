import { NextResponse, type NextRequest } from "next/server";
import { getAdminUser, unauthorized } from "@/lib/supabase/authz";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendOrderCancellation } from "@/lib/email/send";
import { logAudit } from "@/lib/supabase/audit";

type Params = { params: Promise<{ id: string }> };

/** Admin override — unlike the customer-facing cancel route, this works at ANY order status
 * (shipped, delivered, etc.), since staff sometimes need to cancel after the fact. */
export async function POST(_request: NextRequest, { params }: Params) {
  const user = await getAdminUser();
  if (!user) return unauthorized();

  const { id } = await params;
  const admin = createAdminClient();

  const { data: order } = await admin.from("orders").select("*").eq("id", id).maybeSingle();
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.status === "cancelled") {
    return NextResponse.json({ error: "This order is already cancelled" }, { status: 409 });
  }

  const { data: updated, error } = await admin
    .from("orders")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Unable to cancel order" }, { status: 500 });
  }

  await logAudit({ action: "update", table: "orders", recordId: id, oldData: order, newData: updated });

  const wasPaid = order.payment_status === "paid";
  // Real refund issuance is wired up in Phase 11 alongside the admin refund UI — see the
  // customer-facing cancel route for the same note.
  if (order.customer_email) {
    await sendOrderCancellation(order.customer_email, order.order_number, wasPaid);
  }

  return NextResponse.json({ order: updated });
}
