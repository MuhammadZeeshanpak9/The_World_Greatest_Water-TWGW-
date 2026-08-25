import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { findCartId, loadCart } from "@/lib/cart/getCart";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { isShippoEnabled } from "@/lib/payments/config";
import { getShippingRates, type ShippingRate } from "@/lib/shipping/shippo";
import type { OrderShippingAddress } from "@/types";

const FREE_SHIPPING_THRESHOLD = 75;

const MOCK_RATES: ShippingRate[] = [
  { id: "mock_standard", carrier: "USPS", service: "Priority Mail", rate: 12.5, days: "2-3" },
  { id: "mock_express", carrier: "FedEx", service: "Express", rate: 24.99, days: "1-2" },
];

const UNAVAILABLE_MESSAGE =
  "Shipping to this location is currently unavailable. Please contact us at winwin@theworldsgreatestwater.com";

function isValidAddress(value: unknown): value is OrderShippingAddress {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.address1 === "string" &&
    v.address1.trim().length > 0 &&
    typeof v.city === "string" &&
    v.city.trim().length > 0 &&
    typeof v.state === "string" &&
    v.state.trim().length > 0 &&
    typeof v.zip === "string" &&
    v.zip.trim().length > 0 &&
    typeof v.country === "string" &&
    v.country.trim().length > 0
  );
}

/** Rate quotes only — never used to charge anything, but the subtotal that decides the free-
 * shipping threshold still comes from the authenticated user's real server-side cart, not a
 * client-supplied number, so it can't be gamed. Items for parcel-dimension purposes come from
 * that same cart. */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(`shipping-rates:${ip}`, { maxAttempts: 10, windowMs: 60 * 1000 });
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const b = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  if (!isValidAddress(b.toAddress)) {
    return NextResponse.json({ error: "A complete shipping address is required" }, { status: 400 });
  }
  const toAddress = b.toAddress;

  const cartId = await findCartId(user.id, null);
  const cart = await loadCart(cartId);
  if (cart.items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty" }, { status: 400 });
  }

  if (cart.total >= FREE_SHIPPING_THRESHOLD) {
    return NextResponse.json({ freeShipping: true, rates: [] });
  }

  const items = cart.items.map((item) => ({
    productSlug: item.product?.slug ?? "default",
    quantity: item.quantity,
  }));

  if (!isShippoEnabled()) {
    return NextResponse.json({ freeShipping: false, rates: MOCK_RATES });
  }

  const rates = await getShippingRates(toAddress, items);

  if (rates === null || rates.length === 0) {
    return NextResponse.json({ freeShipping: false, rates: [], message: UNAVAILABLE_MESSAGE });
  }

  return NextResponse.json({ freeShipping: false, rates });
}
