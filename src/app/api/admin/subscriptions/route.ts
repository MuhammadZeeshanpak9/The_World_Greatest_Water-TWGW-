import { NextResponse, type NextRequest } from "next/server";
import { getAdminUser, unauthorized } from "@/lib/supabase/authz";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/supabase/audit";

const PAGE_SIZE = 20;
const VALID_STATUSES = ["active", "paused", "cancelled"];

export async function GET(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return unauthorized();

  const { searchParams } = request.nextUrl;
  const search = searchParams.get("search")?.trim() ?? "";
  const status = searchParams.get("status")?.trim() ?? "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const admin = createAdminClient();
  let query = admin.from("subscriptions").select("*", { count: "exact" });
  if (search) {
    query = query.or(`customer_email.ilike.%${search}%,customer_name.ilike.%${search}%`);
  }
  if (status) query = query.eq("status", status);

  const from = (page - 1) * PAGE_SIZE;
  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ subscriptions: data, total: count ?? 0, page, pageSize: PAGE_SIZE });
}

export async function PUT(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return unauthorized();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const b = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  if (typeof b.id !== "string" || !b.id) {
    return NextResponse.json({ error: "Missing subscription id" }, { status: 400 });
  }
  if (typeof b.status !== "string" || !VALID_STATUSES.includes(b.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: oldData } = await admin
    .from("subscriptions")
    .select("*")
    .eq("id", b.id)
    .single();

  const { data, error } = await admin
    .from("subscriptions")
    .update({ status: b.status, updated_at: new Date().toISOString() })
    .eq("id", b.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    action: "update",
    table: "subscriptions",
    recordId: b.id,
    oldData,
    newData: data,
  });

  return NextResponse.json({ subscription: data });
}
