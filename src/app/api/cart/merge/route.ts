import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSessionId } from "@/lib/cart/session";
import { mergeGuestCart } from "@/lib/cart/merge";
import { findCartId, loadCart } from "@/lib/cart/getCart";

// The guest session id lives in an httpOnly cookie by design (client JS can't read it, so it
// can't be spoofed via the request body) — read it straight from the request instead.
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sessionId = getSessionId(request);
  const skipped = sessionId ? (await mergeGuestCart(user.id, sessionId)).skipped : [];

  const cartId = await findCartId(user.id, null);
  const cart = await loadCart(cartId);

  return NextResponse.json({ ...cart, skipped });
}
