import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { slug } = await params;
  const admin = createAdminClient();

  const { data, error } = await admin.from("products").select("*").eq("slug", slug).maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ product: data });
}
