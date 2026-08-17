import { createAdminClient } from "@/lib/supabase/admin";
import type { DbProduct } from "@/types";

export async function getProducts(): Promise<DbProduct[]> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<DbProduct | null> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
}
