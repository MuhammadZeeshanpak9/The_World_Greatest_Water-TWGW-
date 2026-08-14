import { NextResponse, type NextRequest } from "next/server";
import { getAdminUser, unauthorized } from "@/lib/supabase/authz";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/supabase/audit";

const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return unauthorized();

  const { searchParams } = request.nextUrl;
  const formType = searchParams.get("form_type")?.trim() ?? "";
  const unreadOnly = searchParams.get("unread") === "true";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const admin = createAdminClient();
  let query = admin.from("form_submissions").select("*", { count: "exact" });
  if (formType) query = query.eq("form_type", formType);
  if (unreadOnly) query = query.eq("read", false);

  const from = (page - 1) * PAGE_SIZE;
  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    submissions: data,
    total: count ?? 0,
    page,
    pageSize: PAGE_SIZE,
  });
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
    return NextResponse.json({ error: "Missing submission id" }, { status: 400 });
  }
  const read = typeof b.read === "boolean" ? b.read : true;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("form_submissions")
    .update({ read })
    .eq("id", b.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({ action: "update", table: "form_submissions", recordId: b.id, newData: data });

  return NextResponse.json({ submission: data });
}
