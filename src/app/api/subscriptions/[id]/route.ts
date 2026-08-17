import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/supabase/audit";

type Params = { params: Promise<{ id: string }> };

// Public customers may only cancel their own subscription — no other field or subscription
// is reachable through this route.
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
  if (b.status !== "cancelled") {
    return NextResponse.json({ error: "Only cancellation is allowed here" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("subscriptions")
    .select("id, customer_email")
    .eq("id", id)
    .maybeSingle();

  if (!existing || existing.customer_email !== user.email) {
    return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
  }

  const { data, error } = await admin
    .from("subscriptions")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Unable to cancel subscription" }, { status: 500 });
  }

  await logAudit({ action: "update", table: "subscriptions", recordId: id, newData: data });

  return NextResponse.json({ subscription: data });
}
