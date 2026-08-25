import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/supabase/audit";

type Params = { params: Promise<{ id: string }> };

const ALLOWED_STATUSES = new Set(["cancelled", "paused", "active"]);

// Public customers may only change the status of their own subscription (cancel/pause/reactivate)
// — no other field or subscription is reachable through this route.
export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;

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
  const status = typeof b.status === "string" ? b.status : "";
  if (!ALLOWED_STATUSES.has(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("subscriptions")
    .select("id, customer_email, status")
    .eq("id", id)
    .maybeSingle();

  if (!existing || existing.customer_email !== user.email) {
    return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
  }

  // Pause only from active; reactivate only from paused; cancel from either — cancellation is
  // terminal and "reactivate" never resurrects an already-cancelled subscription.
  const validTransition =
    (status === "paused" && existing.status === "active") ||
    (status === "active" && existing.status === "paused") ||
    (status === "cancelled" && existing.status !== "cancelled");

  if (!validTransition) {
    return NextResponse.json(
      { error: `Cannot change subscription from ${existing.status} to ${status}` },
      { status: 409 },
    );
  }

  // subscriptions has no updated_at column (confirmed against the live schema) — status alone.
  const { data, error } = await admin
    .from("subscriptions")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Unable to update subscription" }, { status: 500 });
  }

  await logAudit({ action: "update", table: "subscriptions", recordId: id, oldData: existing, newData: data });

  return NextResponse.json({ subscription: data });
}
