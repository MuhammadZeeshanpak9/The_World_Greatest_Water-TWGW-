import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const revalidate = 60;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category")?.trim() ?? "";
  const status = searchParams.get("status")?.trim() ?? "";
  const search = searchParams.get("search")?.trim() ?? "";

  const admin = createAdminClient();
  let query = admin.from("products").select("*");
  if (category) query = query.eq("category", category);
  if (status) query = query.eq("status", status);
  if (search) query = query.ilike("name", `%${search}%`);

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Unable to load products" }, { status: 500 });
  }

  return NextResponse.json({ products: data ?? [] });
}
