import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOrCreateSessionId, getSessionId } from "@/lib/cart/session";
import { findCartId, getOrCreateCartId, loadCart } from "@/lib/cart/getCart";

const MAX_QUANTITY = 10;

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const sessionId = user ? null : (getSessionId(request) ?? null);
  const cartId = await findCartId(user?.id ?? null, sessionId);
  const cart = await loadCart(cartId);

  return NextResponse.json(cart);
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const b = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  const productId = typeof b.productId === "string" ? b.productId : "";

  if (!productId) {
    return NextResponse.json({ error: "productId is required" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const admin = createAdminClient();
  const { data: product } = await admin
    .from("products")
    .select("id, price, status")
    .eq("id", productId)
    .maybeSingle();

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  if (product.status !== "available") {
    return NextResponse.json(
      { error: "This product is not currently available" },
      { status: 400 },
    );
  }

  // Placeholder response purely to capture a new guest-session cookie, if one gets created.
  const cookieCarrier = NextResponse.next();
  const sessionId = user ? null : getOrCreateSessionId(request, cookieCarrier);
  const cartId = await getOrCreateCartId(user?.id ?? null, sessionId);

  const { data: existing } = await admin
    .from("cart_items")
    .select("id, quantity")
    .eq("cart_id", cartId)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    await admin
      .from("cart_items")
      .update({ quantity: Math.min(MAX_QUANTITY, existing.quantity + 1) })
      .eq("id", existing.id);
  } else {
    await admin.from("cart_items").insert({
      cart_id: cartId,
      product_id: productId,
      quantity: 1,
      price_snapshot: product.price,
    });
  }

  const cart = await loadCart(cartId);
  const response = NextResponse.json(cart);
  cookieCarrier.cookies.getAll().forEach((c) => response.cookies.set(c));
  return response;
}
