import { NextResponse, type NextRequest } from "next/server";
import { getAdminUser, unauthorized } from "@/lib/supabase/authz";
import { createAdminClient } from "@/lib/supabase/admin";

const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return unauthorized();

  const { searchParams } = request.nextUrl;
  const table = searchParams.get("table")?.trim() ?? "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const admin = createAdminClient();
  let query = admin.from("audit_log").select("*", { count: "exact" });
  if (table) query = query.eq("table_name", table);

  const from = (page - 1) * PAGE_SIZE;
  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ entries: data, total: count ?? 0, page, pageSize: PAGE_SIZE });
}
