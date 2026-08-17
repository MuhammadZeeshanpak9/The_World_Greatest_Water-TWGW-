import { createAdminClient } from "@/lib/supabase/admin";

export type CartItemWithProduct = {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  price_snapshot: number;
  product: {
    id: string;
    name: string;
    slug: string;
    image_url: string | null;
    status: string;
  } | null;
};

export type CartResponse = {
  items: CartItemWithProduct[];
  total: number;
  count: number;
};

type CartItemJoinRow = Omit<CartItemWithProduct, "product"> & {
  products: CartItemWithProduct["product"];
};

/** Loads a cart's items joined with product info, pruning any item whose product was deleted. */
export async function loadCart(cartId: string | null): Promise<CartResponse> {
  if (!cartId) return { items: [], total: 0, count: 0 };

  const admin = createAdminClient();
  const { data } = await admin
    .from("cart_items")
    .select("*, products(id, name, slug, image_url, status)")
    .eq("cart_id", cartId);

  const rows = (data ?? []) as CartItemJoinRow[];

  const orphanedIds = rows.filter((r) => !r.products).map((r) => r.id);
  if (orphanedIds.length > 0) {
    await admin.from("cart_items").delete().in("id", orphanedIds);
  }

  const items: CartItemWithProduct[] = rows
    .filter((r) => r.products)
    .map((r) => ({
      id: r.id,
      cart_id: r.cart_id,
      product_id: r.product_id,
      quantity: r.quantity,
      price_snapshot: r.price_snapshot,
      product: r.products,
    }));

  const total = items.reduce((sum, item) => sum + item.price_snapshot * item.quantity, 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return { items, total, count };
}

export async function findCartId(
  userId: string | null,
  sessionId: string | null,
): Promise<string | null> {
  const admin = createAdminClient();
  if (userId) {
    const { data } = await admin.from("carts").select("id").eq("user_id", userId).maybeSingle();
    return data?.id ?? null;
  }
  if (sessionId) {
    const { data } = await admin
      .from("carts")
      .select("id")
      .eq("session_id", sessionId)
      .is("user_id", null)
      .maybeSingle();
    return data?.id ?? null;
  }
  return null;
}

export async function getOrCreateCartId(
  userId: string | null,
  sessionId: string | null,
): Promise<string> {
  const existing = await findCartId(userId, sessionId);
  if (existing) return existing;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("carts")
    .insert(userId ? { user_id: userId } : { session_id: sessionId })
    .select("id")
    .single();

  if (error || !data) throw new Error("Failed to create cart");
  return data.id;
}
