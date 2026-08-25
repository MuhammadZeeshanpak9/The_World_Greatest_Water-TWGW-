import { NextResponse, type NextRequest } from "next/server";
import { after } from "next/server";
import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { isStripeEnabled } from "@/lib/payments/config";
import { getStripeClient } from "@/lib/payments/stripe";
import {
  sendOrderConfirmation,
  sendPaymentFailed,
  sendSubscriptionFailed,
  sendSubscriptionRenewal,
  sendAdminFormNotification,
} from "@/lib/email/send";
import { logAudit } from "@/lib/supabase/audit";

type Admin = ReturnType<typeof createAdminClient>;

function mapSubscriptionStatus(status: Stripe.Subscription.Status): "active" | "paused" | "cancelled" {
  if (status === "paused") return "paused";
  if (status === "canceled" || status === "unpaid" || status === "incomplete_expired") return "cancelled";
  return "active";
}

async function handlePaymentIntentSucceeded(admin: Admin, pi: Stripe.PaymentIntent) {
  const courseSlug = pi.metadata?.course_slug;
  const userId = pi.metadata?.user_id;
  const orderId = pi.metadata?.order_id;

  // Course payment path — idempotent upsert (verified unique constraint on user_id+course_slug),
  // per your idempotency-key instruction, so a retried webhook never double-enrolls.
  if (courseSlug && userId) {
    const { data: course } = await admin
      .from("blog_posts")
      .select("title")
      .eq("slug", courseSlug)
      .maybeSingle();

    const { data: enrollment } = await admin
      .from("course_enrollments")
      .upsert(
        {
          user_id: userId,
          course_slug: courseSlug,
          course_title: course?.title ?? courseSlug,
          paid_at: new Date().toISOString(),
          price_paid: pi.amount / 100,
        },
        { onConflict: "user_id,course_slug" },
      )
      .select()
      .single();

    await logAudit({
      action: "create",
      table: "course_enrollments",
      recordId: enrollment?.id,
      newData: enrollment,
    });
    return;
  }

  // Regular cart-order payment path.
  if (!orderId) return;

  const { data: order } = await admin.from("orders").select("*").eq("id", orderId).maybeSingle();
  if (!order || order.payment_status === "paid") return;

  const { data: updated } = await admin
    .from("orders")
    .update({ payment_status: "paid", payment_method: "stripe", updated_at: new Date().toISOString() })
    .eq("id", orderId)
    .select()
    .single();

  await admin.from("payment_attempts").insert({
    order_id: orderId,
    payment_method: "stripe",
    amount: order.total,
    status: "succeeded",
    provider_reference: pi.id,
  });

  await logAudit({ action: "update", table: "orders", recordId: orderId, oldData: order, newData: updated });

  after(async () => {
    await sendOrderConfirmation(order.customer_email, {
      orderNumber: order.order_number,
      items: order.items,
      shippingAddress: order.shipping_address,
      total: order.total,
      shippingCarrier: order.shipping_carrier,
      shippingService: order.shipping_service,
      shippingCost: order.shipping_rate,
      trackingNumber: order.tracking_number,
    });
  });
}

async function handlePaymentIntentFailed(admin: Admin, pi: Stripe.PaymentIntent) {
  const orderId = pi.metadata?.order_id;
  if (!orderId) return;

  const { data: order } = await admin.from("orders").select("*").eq("id", orderId).maybeSingle();
  if (!order) return;

  await admin.from("payment_attempts").insert({
    order_id: orderId,
    payment_method: "stripe",
    amount: order.total,
    status: "failed",
    error_message: pi.last_payment_error?.message ?? "Payment failed",
    provider_reference: pi.id,
  });

  after(async () => {
    await sendPaymentFailed(order.customer_email, order.order_number);
    await sendAdminFormNotification("Payment Failed", {
      name: order.customer_name ?? order.customer_email,
      email: order.customer_email,
      message: `Payment failed for order ${order.order_number} — amount: $${Number(order.total).toFixed(2)}`,
    });
  });
}

async function handleSubscriptionCreated(admin: Admin, sub: Stripe.Subscription) {
  const { data: existing } = await admin
    .from("subscriptions")
    .select("id")
    .eq("stripe_subscription_id", sub.id)
    .maybeSingle();
  // Already created synchronously by /api/subscriptions/create in the common path — this handler
  // only matters as a fallback for subscriptions created outside that flow (e.g. Stripe dashboard).
  if (existing) return;

  const email = sub.metadata?.email;
  if (!email) return;

  const priceId = sub.items.data[0]?.price?.id;
  const plan =
    priceId === process.env.STRIPE_WEEKLY_PRICE_ID
      ? "weekly"
      : priceId === process.env.STRIPE_MONTHLY_PRICE_ID
        ? "monthly"
        : (sub.metadata?.plan ?? "unknown");

  const { data: created } = await admin
    .from("subscriptions")
    .insert({
      customer_email: email,
      customer_name: sub.metadata?.customer_name ?? email,
      plan,
      product: sub.metadata?.product_slug ?? "elev8-water",
      status: mapSubscriptionStatus(sub.status),
      amount: (sub.items.data[0]?.price?.unit_amount ?? 0) / 100,
      next_billing_date: sub.items.data[0]?.current_period_end
        ? new Date(sub.items.data[0].current_period_end * 1000).toISOString()
        : null,
      stripe_subscription_id: sub.id,
      stripe_customer_id: typeof sub.customer === "string" ? sub.customer : sub.customer.id,
      stripe_price_id: priceId,
    })
    .select()
    .single();

  await logAudit({ action: "create", table: "subscriptions", recordId: created?.id, newData: created });
}

async function handleSubscriptionUpdated(admin: Admin, sub: Stripe.Subscription) {
  const { data: existing } = await admin
    .from("subscriptions")
    .select("*")
    .eq("stripe_subscription_id", sub.id)
    .maybeSingle();
  if (!existing) return;

  const status = mapSubscriptionStatus(sub.status);
  if (status === existing.status) return;

  const { data: updated } = await admin
    .from("subscriptions")
    .update({ status })
    .eq("id", existing.id)
    .select()
    .single();

  await logAudit({
    action: "update",
    table: "subscriptions",
    recordId: existing.id,
    oldData: existing,
    newData: updated,
  });
}

async function handleSubscriptionDeleted(admin: Admin, sub: Stripe.Subscription) {
  const { data: existing } = await admin
    .from("subscriptions")
    .select("*")
    .eq("stripe_subscription_id", sub.id)
    .maybeSingle();
  if (!existing || existing.status === "cancelled") return;

  const { data: updated } = await admin
    .from("subscriptions")
    .update({ status: "cancelled" })
    .eq("id", existing.id)
    .select()
    .single();

  await logAudit({
    action: "update",
    table: "subscriptions",
    recordId: existing.id,
    oldData: existing,
    newData: updated,
  });
}

function resolveSubscriptionId(invoice: Stripe.Invoice): string | null {
  const ref = invoice.parent?.subscription_details?.subscription;
  if (!ref) return null;
  return typeof ref === "string" ? ref : ref.id;
}

async function handleInvoicePaymentSucceeded(admin: Admin, invoice: Stripe.Invoice) {
  const subId = resolveSubscriptionId(invoice);
  if (!subId) return;

  const { data: existing } = await admin
    .from("subscriptions")
    .select("*")
    .eq("stripe_subscription_id", subId)
    .maybeSingle();
  if (!existing) return;

  // Next billing date comes straight from the invoice's own period_end, per your instruction.
  const nextBillingDate = new Date(invoice.period_end * 1000).toISOString();

  const { data: updated } = await admin
    .from("subscriptions")
    .update({ next_billing_date: nextBillingDate })
    .eq("id", existing.id)
    .select()
    .single();

  await logAudit({
    action: "update",
    table: "subscriptions",
    recordId: existing.id,
    oldData: existing,
    newData: updated,
  });

  await admin.from("payment_attempts").insert({
    order_id: null,
    payment_method: "stripe",
    amount: (invoice.amount_paid ?? 0) / 100,
    status: "succeeded",
    provider_reference: invoice.id,
  });

  after(async () => {
    await sendSubscriptionRenewal(existing.customer_email, {
      planName: existing.plan,
      amount: (invoice.amount_paid ?? 0) / 100,
      nextBillingDate: new Date(nextBillingDate).toLocaleDateString("en-US"),
    });
  });
}

async function handleInvoicePaymentFailed(admin: Admin, invoice: Stripe.Invoice) {
  const subId = resolveSubscriptionId(invoice);
  if (!subId) return;

  const { data: existing } = await admin
    .from("subscriptions")
    .select("*")
    .eq("stripe_subscription_id", subId)
    .maybeSingle();
  if (!existing) return;

  await admin.from("payment_attempts").insert({
    order_id: null,
    payment_method: "stripe",
    amount: (invoice.amount_due ?? 0) / 100,
    status: "failed",
    provider_reference: invoice.id,
  });

  after(async () => {
    await sendSubscriptionFailed(existing.customer_email, existing.plan);
    await sendAdminFormNotification("Subscription Payment Failed", {
      name: existing.customer_name ?? existing.customer_email,
      email: existing.customer_email,
      message: `Subscription renewal failed for the ${existing.plan} plan — customer: ${existing.customer_email}`,
    });
  });
}

/**
 * Signature verification is real and active (stripe.webhooks.constructEvent against the raw
 * body) — it just never gets exercised while Stripe is disabled, since nothing would ever POST
 * here with a valid signature from a placeholder secret. DB writes happen synchronously inside
 * each handler; only outbound emails are deferred via after(), same discipline as every other
 * webhook in this app.
 */
export async function POST(request: NextRequest) {
  if (!isStripeEnabled()) {
    return NextResponse.json({ received: true });
  }

  const stripe = getStripeClient();
  if (!stripe) {
    return NextResponse.json({ received: true });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature ?? "", process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const admin = createAdminClient();

  switch (event.type) {
    case "payment_intent.succeeded":
      await handlePaymentIntentSucceeded(admin, event.data.object as Stripe.PaymentIntent);
      break;
    case "payment_intent.payment_failed":
      await handlePaymentIntentFailed(admin, event.data.object as Stripe.PaymentIntent);
      break;
    case "customer.subscription.created":
      await handleSubscriptionCreated(admin, event.data.object as Stripe.Subscription);
      break;
    case "customer.subscription.updated":
      await handleSubscriptionUpdated(admin, event.data.object as Stripe.Subscription);
      break;
    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(admin, event.data.object as Stripe.Subscription);
      break;
    case "invoice.payment_succeeded":
      await handleInvoicePaymentSucceeded(admin, event.data.object as Stripe.Invoice);
      break;
    case "invoice.payment_failed":
      await handleInvoicePaymentFailed(admin, event.data.object as Stripe.Invoice);
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
