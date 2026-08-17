import { createAdminClient } from "@/lib/supabase/admin";

type CartItemRow = {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  price_snapshot: number;
  products: { id: string; status: string } | null;
};

export type MergeResult = {
  merged: boolean;
  skipped: { productId: string; reason: string }[];
};

/** Merges a guest cart (by session_id) into a user's cart, then deletes the guest cart. Idempotent — safe to call when no guest cart exists. */
export async function mergeGuestCart(userId: string, sessionId: string): Promise<MergeResult> {
  const admin = createAdminClient();

  const { data: guestCart } = await admin
    .from("carts")
    .select("id")
    .eq("session_id", sessionId)
    .is("user_id", null)
    .maybeSingle();

  if (!guestCart) {
    return { merged: false, skipped: [] };
  }

  const { data: guestItems } = await admin
    .from("cart_items")
    .select("*, products(id, status)")
    .eq("cart_id", guestCart.id);

  let { data: userCart } = await admin
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (!userCart) {
    const { data: newCart } = await admin
      .from("carts")
      .insert({ user_id: userId })
      .select("id")
      .single();
    userCart = newCart;
  }

  const skipped: { productId: string; reason: string }[] = [];

  for (const item of (guestItems ?? []) as CartItemRow[]) {
    if (!item.products) {
      skipped.push({ productId: item.product_id, reason: "Product no longer exists" });
      continue;
    }
    if (item.products.status === "sold-out") {
      skipped.push({ productId: item.product_id, reason: "Product is sold out" });
      continue;
    }

    const { data: existing } = await admin
      .from("cart_items")
      .select("id, quantity")
      .eq("cart_id", userCart!.id)
      .eq("product_id", item.product_id)
      .maybeSingle();

    if (existing) {
      await admin
        .from("cart_items")
        .update({ quantity: Math.min(10, existing.quantity + item.quantity) })
        .eq("id", existing.id);
    } else {
      await admin.from("cart_items").insert({
        cart_id: userCart!.id,
        product_id: item.product_id,
        quantity: Math.min(10, item.quantity),
        price_snapshot: item.price_snapshot,
      });
    }
  }

  await admin.from("carts").delete().eq("id", guestCart.id);

  return { merged: true, skipped };
}
