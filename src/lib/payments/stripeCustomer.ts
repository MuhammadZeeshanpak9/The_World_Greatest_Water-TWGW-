import { createAdminClient } from "@/lib/supabase/admin";
import { getStripeClient } from "./stripe";

/**
 * Returns the Stripe customer ID for a user, creating both the Stripe customer and the
 * stripe_customers row on first use. Shared by create-intent, subscriptions/create, and
 * subscriptions/portal so there's exactly one place that does this lookup-or-create. Callers
 * must already know Stripe is enabled (getStripeClient() would return null otherwise).
 */
export async function getOrCreateStripeCustomerId(userId: string, email: string): Promise<string> {
  const stripe = getStripeClient();
  if (!stripe) throw new Error("Stripe is not enabled");

  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("stripe_customers")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) return existing.stripe_customer_id;

  const customer = await stripe.customers.create({ email, metadata: { user_id: userId } });

  await admin.from("stripe_customers").insert({ user_id: userId, stripe_customer_id: customer.id });

  return customer.id;
}
