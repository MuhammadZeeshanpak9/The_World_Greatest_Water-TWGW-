import { createAdminClient } from "@/lib/supabase/admin";
import type { DbBlogPost } from "@/types";

export async function getPublishedBlogPosts(): Promise<DbBlogPost[]> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getPublishedBlogPostBySlug(slug: string): Promise<DbBlogPost | null> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
}
