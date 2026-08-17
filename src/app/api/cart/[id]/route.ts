import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionId } from "@/lib/cart/session";
import { loadCart } from "@/lib/cart/getCart";

const MAX_QUANTITY = 10;

type Params = { params: Promise<{ id: string }> };

type CartItemOwnershipRow = {
  id: string;
  cart_id: string;
  carts: { user_id: string | null; session_id: string | null } | null;
};

async function verifyOwnership(itemId: string, userId: string | null, sessionId: string | null) {
  const admin = createAdminClient();
  const { data } = await admin
    .from("cart_items")
    .select("id, cart_id, carts!inner(user_id, session_id)")
    .eq("id", itemId)
    .maybeSingle();

  const item = data as unknown as CartItemOwnershipRow | null;
  if (!item || !item.carts) return null;

  const owns = userId
    ? item.carts.user_id === userId
    : sessionId
      ? item.carts.session_id === sessionId
      : false;

  return owns ? item : null;
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const b = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  const quantity = typeof b.quantity === "number" ? b.quantity : NaN;

  if (Number.isNaN(quantity)) {
    return NextResponse.json({ error: "quantity must be a number" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const sessionId = user ? null : (getSessionId(request) ?? null);

  const item = await verifyOwnership(id, user?.id ?? null, sessionId);
  if (!item) {
    return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
  }

  const admin = createAdminClient();
  if (quantity <= 0) {
    await admin.from("cart_items").delete().eq("id", id);
  } else {
    await admin
      .from("cart_items")
      .update({ quantity: Math.min(MAX_QUANTITY, quantity) })
      .eq("id", id);
  }

  const cart = await loadCart(item.cart_id);
  return NextResponse.json(cart);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const sessionId = user ? null : (getSessionId(request) ?? null);

  const item = await verifyOwnership(id, user?.id ?? null, sessionId);
  if (!item) {
    return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
  }

  const admin = createAdminClient();
  await admin.from("cart_items").delete().eq("id", id);

  const cart = await loadCart(item.cart_id);
  return NextResponse.json(cart);
}
