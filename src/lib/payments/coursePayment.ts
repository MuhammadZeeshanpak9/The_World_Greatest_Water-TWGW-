import { getStripeClient } from "./stripe";

export const COURSE_PRICE = 47.77;

/** Creates a PaymentIntent for a course purchase with idempotency metadata — the Stripe webhook's
 * payment_intent.succeeded handler reads course_slug + user_id from this same metadata to decide
 * whether an incoming payment is a course purchase (vs. a cart order) and upserts the enrollment. */
export async function createCoursePaymentIntent(userId: string, email: string, courseSlug: string) {
  const stripe = getStripeClient();
  if (!stripe) throw new Error("Stripe is not enabled");

  return stripe.paymentIntents.create({
    amount: Math.round(COURSE_PRICE * 100),
    currency: "usd",
    metadata: { course_slug: courseSlug, user_id: userId, email },
  });
}
