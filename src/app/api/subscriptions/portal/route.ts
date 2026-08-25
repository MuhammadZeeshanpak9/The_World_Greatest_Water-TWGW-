import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isStripeEnabled } from "@/lib/payments/config";
import { getStripeClient } from "@/lib/payments/stripe";
import { getOrCreateStripeCustomerId } from "@/lib/payments/stripeCustomer";

/** Returns a { url } the client navigates to — a real Stripe customer portal session URL when
 * enabled, or the account subscriptions page as a graceful fallback when not. */
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const fallbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/account/subscriptions`;

  if (!isStripeEnabled()) {
    return NextResponse.json({ url: fallbackUrl, enabled: false });
  }

  const stripe = getStripeClient();
  if (!stripe) {
    return NextResponse.json({ url: fallbackUrl, enabled: false });
  }

  try {
    const stripeCustomerId = await getOrCreateStripeCustomerId(user.id, user.email);
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: fallbackUrl,
    });

    return NextResponse.json({ url: session.url, enabled: true });
  } catch (err) {
    console.error("[subscriptions/portal] failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ url: fallbackUrl, enabled: false });
  }
}
