import { NextResponse, type NextRequest } from "next/server";
import { getAdminUser, unauthorized } from "@/lib/supabase/authz";
import { createAdminClient } from "@/lib/supabase/admin";
import { toCsv } from "@/lib/csv";

const PAGE_SIZE = 20;
const CSV_COLUMNS = [
  "id",
  "order_number",
  "customer_email",
  "customer_name",
  "status",
  "total",
  "created_at",
];

export async function GET(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return unauthorized();

  const { searchParams } = request.nextUrl;
  const search = searchParams.get("search")?.trim() ?? "";
  const status = searchParams.get("status")?.trim() ?? "";
  const isExport = searchParams.get("export") === "csv";

  const admin = createAdminClient();
  let query = admin.from("orders").select("*", { count: "exact" });
  if (search) {
    query = query.or(`order_number.ilike.%${search}%,customer_email.ilike.%${search}%`);
  }
  if (status) query = query.eq("status", status);

  if (isExport) {
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const csv = toCsv(data ?? [], CSV_COLUMNS);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=orders.csv",
      },
    });
  }

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ orders: data, total: count ?? 0, page, pageSize: PAGE_SIZE });
}
