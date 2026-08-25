import { NextResponse } from "next/server";
import { isStripeEnabled, isPayPalEnabled, isCoinbaseEnabled } from "@/lib/payments/config";

/**
 * The checkout UI needs to know which payment providers are live to decide which tabs show
 * "coming soon" — but isStripeEnabled()/isCoinbaseEnabled() read server-only secret env vars
 * (STRIPE_SECRET_KEY, COINBASE_COMMERCE_API_KEY aren't NEXT_PUBLIC_), so a client component can't
 * call them directly. This route exposes just the three booleans — no secrets, nothing sensitive.
 */
export async function GET() {
  return NextResponse.json({
    stripe: isStripeEnabled(),
    paypal: isPayPalEnabled(),
    coinbase: isCoinbaseEnabled(),
  });
}
