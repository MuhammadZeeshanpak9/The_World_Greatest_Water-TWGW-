import { NextResponse, type NextRequest } from "next/server";
import { getAdminUser, unauthorized } from "@/lib/supabase/authz";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/supabase/audit";

type Params = { params: Promise<{ id: string }> };

const VALID_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

export async function GET(_request: NextRequest, { params }: Params) {
  const user = await getAdminUser();
  if (!user) return unauthorized();

  const { id } = await params;
  const admin = createAdminClient();
  const { data, error } = await admin.from("orders").select("*").eq("id", id).single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });

  return NextResponse.json({ order: data });
}

export async function PUT(request: NextRequest, { params }: Params) {
  const user = await getAdminUser();
  if (!user) return unauthorized();

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const b = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  if (typeof b.status !== "string" || !VALID_STATUSES.includes(b.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: oldData } = await admin.from("orders").select("*").eq("id", id).single();

  const updates: Record<string, unknown> = { status: b.status, updated_at: new Date().toISOString() };
  // Manual "Mark Delivered" override — only stamp delivered_at if it isn't already set (e.g. by
  // the Shippo webhook), so a later admin re-save can't clobber the real delivery timestamp.
  if (b.status === "delivered" && oldData && !oldData.delivered_at) {
    updates.delivered_at = new Date().toISOString();
  }

  const { data, error } = await admin
    .from("orders")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({ action: "update", table: "orders", recordId: id, oldData, newData: data });

  return NextResponse.json({ order: data });
}
