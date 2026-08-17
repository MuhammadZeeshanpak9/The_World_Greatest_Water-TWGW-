import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const revalidate = 300;

export async function GET() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Unable to load blog posts" }, { status: 500 });
  }

  return NextResponse.json({ posts: data ?? [] });
}
