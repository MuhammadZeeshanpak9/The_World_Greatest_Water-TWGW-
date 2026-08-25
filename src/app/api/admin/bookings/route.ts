import { NextResponse, type NextRequest } from "next/server";
import { getAdminUser, unauthorized } from "@/lib/supabase/authz";
import { createAdminClient } from "@/lib/supabase/admin";

const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return unauthorized();

  const { searchParams } = request.nextUrl;
  const wellnessType = searchParams.get("wellness_type")?.trim() ?? "";
  const status = searchParams.get("status")?.trim() ?? "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const admin = createAdminClient();
  let query = admin.from("cal_bookings").select("*", { count: "exact" });
  if (wellnessType) query = query.eq("wellness_type", wellnessType);
  if (status) query = query.eq("status", status);

  const from = (page - 1) * PAGE_SIZE;
  const { data, error, count } = await query
    .order("start_time", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (error) return NextResponse.json({ error: "Unable to load bookings" }, { status: 500 });

  return NextResponse.json({ bookings: data, total: count ?? 0, page, pageSize: PAGE_SIZE });
}
