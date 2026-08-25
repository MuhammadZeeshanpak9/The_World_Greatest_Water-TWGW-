import Stripe from "stripe";
import { isStripeEnabled } from "./config";

let client: Stripe | null = null;

/**
 * Lazily-created Stripe client singleton. Returns null whenever Stripe isn't configured (the
 * secret key is still the literal placeholder) — every caller must check isStripeEnabled() (or
 * just null-check the return value) before doing anything payment-related. The `stripe` package
 * is installed and its real client is constructed here so the moment a real STRIPE_SECRET_KEY is
 * set in the environment, this activates with zero code changes.
 */
export function getStripeClient(): Stripe | null {
  if (!isStripeEnabled()) return null;
  if (!client) {
    client = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return client;
}
