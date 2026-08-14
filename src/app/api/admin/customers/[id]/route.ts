import { NextResponse, type NextRequest } from "next/server";
import { getAdminUser, unauthorized } from "@/lib/supabase/authz";
import { createAdminClient } from "@/lib/supabase/admin";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const user = await getAdminUser();
  if (!user) return unauthorized();

  const { id } = await params;
  const admin = createAdminClient();

  const { data: customer, error: customerError } = await admin
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (customerError) return NextResponse.json({ error: customerError.message }, { status: 404 });

  const { data: orders, error: ordersError } = await admin
    .from("orders")
    .select("*")
    .eq("customer_email", customer.email)
    .order("created_at", { ascending: false });

  if (ordersError) return NextResponse.json({ error: ordersError.message }, { status: 500 });

  return NextResponse.json({ customer, orders: orders ?? [] });
}
