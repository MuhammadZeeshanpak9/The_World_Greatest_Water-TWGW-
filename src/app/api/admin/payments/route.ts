import { NextResponse, type NextRequest } from "next/server";
import { getAdminUser, unauthorized } from "@/lib/supabase/authz";
import { createAdminClient } from "@/lib/supabase/admin";
import { toCsv } from "@/lib/csv";

const PAGE_SIZE = 20;
const CSV_COLUMNS = [
  "id",
  "order_number",
  "customer_email",
  "payment_method",
  "payment_status",
  "total",
  "created_at",
];

/**
 * Payment transactions are sourced from orders (payment_method/payment_status already live
 * there for every order, regardless of provider) — crypto_charges stays the Coinbase-specific
 * lifecycle audit trail (pending → confirmed/failed/expired), reachable via its order_id FK
 * rather than duplicated into this list.
 */
export async function GET(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return unauthorized();

  const { searchParams } = request.nextUrl;
  const method = searchParams.get("method")?.trim() ?? "";
  const paymentStatus = searchParams.get("paymentStatus")?.trim() ?? "";
  const isExport = searchParams.get("export") === "csv";

  const admin = createAdminClient();
  let query = admin.from("orders").select("*", { count: "exact" });
  if (method) query = query.eq("payment_method", method);
  if (paymentStatus) query = query.eq("payment_status", paymentStatus);

  if (isExport) {
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) return NextResponse.json({ error: "Unable to export payments" }, { status: 500 });
    const csv = toCsv(data ?? [], CSV_COLUMNS);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=payments.csv",
      },
    });
  }

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (error) return NextResponse.json({ error: "Unable to load payments" }, { status: 500 });

  const { data: revenueRows } = await admin.from("orders").select("total").eq("payment_status", "paid");
  const totalRevenue = (revenueRows ?? []).reduce((sum, row) => sum + Number(row.total), 0);

  return NextResponse.json({
    orders: data,
    total: count ?? 0,
    page,
    pageSize: PAGE_SIZE,
    totalRevenue,
  });
}
