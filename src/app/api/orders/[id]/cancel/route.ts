import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendOrderCancellation } from "@/lib/email/send";
import { logAudit } from "@/lib/supabase/audit";

type Params = { params: Promise<{ id: string }> };

/** Customer self-service cancellation — pending orders only. Once an order has moved past
 * 'pending' (paid, processing, shipped, etc.) the customer can no longer cancel it themselves;
 * an admin override exists at /api/admin/orders/[id]/cancel for any other status. */
export async function POST(_request: NextRequest, { params }: Params) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const admin = createAdminClient();

  const { data: order } = await admin.from("orders").select("*").eq("id", id).maybeSingle();
  if (!order || order.customer_email !== user.email) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.status !== "pending") {
    return NextResponse.json(
      { error: "Only orders that haven't shipped yet can be cancelled" },
      { status: 409 },
    );
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
  // Real refund issuance (stripe.refunds.create against order.stripe_payment_intent_id) is wired
  // up in Phase 11 alongside the admin refund UI — for now the email tells the customer a refund
  // is coming, and an admin can see payment_status="paid" + status="cancelled" to follow up.
  await sendOrderCancellation(user.email, order.order_number, wasPaid);

  return NextResponse.json({ order: updated });
}
