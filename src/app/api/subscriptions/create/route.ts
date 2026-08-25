import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isStripeEnabled } from "@/lib/payments/config";
import { getStripeClient } from "@/lib/payments/stripe";
import { getOrCreateStripeCustomerId } from "@/lib/payments/stripeCustomer";
import { sendSubscriptionConfirmation } from "@/lib/email/send";
import { logAudit } from "@/lib/supabase/audit";

const VALID_PLANS = new Set(["weekly", "monthly"]);

/** The charged amount is never client-supplied — it's whatever the Stripe Price object (chosen
 * by plan, via env-configured price IDs) actually bills, read back from Stripe's own response. */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const b = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  const plan = typeof b.plan === "string" ? b.plan : "";
  const productSlug = typeof b.productSlug === "string" ? b.productSlug.trim() : "";

  if (!VALID_PLANS.has(plan)) {
    return NextResponse.json({ error: "plan must be 'weekly' or 'monthly'" }, { status: 400 });
  }
  if (!productSlug) {
    return NextResponse.json({ error: "productSlug is required" }, { status: 400 });
  }

  if (!isStripeEnabled()) {
    return NextResponse.json({ enabled: false, message: "Subscriptions launching soon" });
  }

  const stripe = getStripeClient();
  if (!stripe) {
    return NextResponse.json({ enabled: false, message: "Subscriptions launching soon" });
  }

  const priceId =
    plan === "weekly" ? process.env.STRIPE_WEEKLY_PRICE_ID : process.env.STRIPE_MONTHLY_PRICE_ID;
  if (!priceId) {
    return NextResponse.json({ error: "Subscription pricing is not configured" }, { status: 500 });
  }

  try {
    const stripeCustomerId = await getOrCreateStripeCustomerId(user.id, user.email);

    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: priceId }],
      metadata: {
        user_id: user.id,
        email: user.email,
        plan,
        product_slug: productSlug,
      },
    });

    const item = subscription.items.data[0];
    const amount = (item?.price?.unit_amount ?? 0) / 100;
    const nextBillingDate = item?.current_period_end
      ? new Date(item.current_period_end * 1000).toISOString()
      : null;

    const admin = createAdminClient();
    const { data: created } = await admin
      .from("subscriptions")
      .insert({
        customer_email: user.email,
        customer_name: user.email,
        plan,
        product: productSlug,
        status: "active",
        amount,
        next_billing_date: nextBillingDate,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: stripeCustomerId,
        stripe_price_id: priceId,
      })
      .select()
      .single();

    await logAudit({ action: "create", table: "subscriptions", recordId: created?.id, newData: created });
    await sendSubscriptionConfirmation(user.email, { planName: plan, amount });

    return NextResponse.json({ enabled: true, subscription: created });
  } catch (err) {
    console.error("[subscriptions/create] failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Unable to create subscription. Please try again." }, { status: 500 });
  }
}
