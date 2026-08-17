import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const revalidate = 300;

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { slug } = await params;
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
  }

  return NextResponse.json({ post: data });
}
