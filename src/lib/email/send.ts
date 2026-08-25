import { getResendClient } from "./resend";
import { welcomeEmail } from "./templates/welcome";
import { orderConfirmationEmail } from "./templates/orderConfirmation";
import { passwordResetEmail } from "./templates/passwordReset";
import { waitlistConfirmationEmail } from "./templates/waitlistConfirmation";
import { adminNotificationEmail } from "./templates/adminNotification";
import { courseEnrollmentEmail } from "./templates/courseEnrollment";
import { shippingConfirmationEmail } from "./templates/shippingConfirmation";
import { orderDeliveredEmail } from "./templates/orderDelivered";
import { paymentFailedEmail } from "./templates/paymentFailed";
import { subscriptionFailedEmail } from "./templates/subscriptionFailed";
import { subscriptionRenewalEmail } from "./templates/subscriptionRenewal";
import { subscriptionConfirmationEmail } from "./templates/subscriptionConfirmation";
import { refundConfirmationEmail } from "./templates/refundConfirmation";
import { orderCancellationEmail } from "./templates/orderCancellation";

function fromAddress() {
  return `ELEV8 WATER <${process.env.RESEND_FROM_EMAIL}>`;
}

function logFailure(fn: string, err: unknown) {
  console.error(`[email] ${fn} failed:`, err instanceof Error ? err.message : err);
}

/** Email failures must never block the operation that triggered them — every function here swallows its own errors. */
export async function sendWelcomeEmail(to: string, name: string) {
  try {
    const { subject, html } = welcomeEmail({
      name,
      shopUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/shop`,
    });
    await getResendClient().emails.send({ from: fromAddress(), to, subject, html });
  } catch (err) {
    logFailure("sendWelcomeEmail", err);
  }
}

export async function sendOrderConfirmation(
  to: string,
  order: {
    orderNumber: string;
    items: { name: string; quantity: number; price: number }[];
    shippingAddress: {
      address1: string;
      address2?: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
    total: number;
    shippingCarrier?: string | null;
    shippingService?: string | null;
    shippingCost?: number | null;
    trackingNumber?: string | null;
  },
) {
  try {
    const { subject, html } = orderConfirmationEmail({
      orderNumber: order.orderNumber,
      items: order.items,
      shippingAddress: order.shippingAddress,
      total: order.total,
      trackOrdersUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/account/orders`,
      shippingCarrier: order.shippingCarrier,
      shippingService: order.shippingService,
      shippingCost: order.shippingCost,
      trackingNumber: order.trackingNumber,
      trackingUrl: order.trackingNumber
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/track/${order.trackingNumber}`
        : null,
    });
    await getResendClient().emails.send({ from: fromAddress(), to, subject, html });
  } catch (err) {
    logFailure("sendOrderConfirmation", err);
  }
}

export async function sendPasswordReset(to: string, resetLink: string) {
  try {
    const { subject, html } = passwordResetEmail({ resetLink });
    await getResendClient().emails.send({ from: fromAddress(), to, subject, html });
  } catch (err) {
    logFailure("sendPasswordReset", err);
  }
}

export async function sendWaitlistConfirmation(to: string) {
  try {
    const { subject, html } = waitlistConfirmationEmail();
    await getResendClient().emails.send({ from: fromAddress(), to, subject, html });
  } catch (err) {
    logFailure("sendWaitlistConfirmation", err);
  }
}

export async function sendCourseEnrollmentEmail(
  to: string,
  courseTitle: string,
  courseSlug: string,
  lessonCount: number,
) {
  try {
    const { subject, html } = courseEnrollmentEmail({
      courseTitle,
      lessonCount,
      courseUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/courses/${courseSlug}`,
    });
    await getResendClient().emails.send({ from: fromAddress(), to, subject, html });
  } catch (err) {
    logFailure("sendCourseEnrollmentEmail", err);
  }
}

export async function sendShippingConfirmation(
  to: string,
  order: { orderNumber: string; trackingNumber: string; carrier: string; estimatedDelivery?: string },
) {
  try {
    const { subject, html } = shippingConfirmationEmail({
      orderNumber: order.orderNumber,
      trackingNumber: order.trackingNumber,
      carrier: order.carrier,
      estimatedDelivery: order.estimatedDelivery,
      trackingUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/track/${order.trackingNumber}`,
    });
    await getResendClient().emails.send({ from: fromAddress(), to, subject, html });
  } catch (err) {
    logFailure("sendShippingConfirmation", err);
  }
}

export async function sendOrderDelivered(to: string, orderNumber: string) {
  try {
    const { subject, html } = orderDeliveredEmail({
      orderNumber,
      reorderUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/shop`,
    });
    await getResendClient().emails.send({ from: fromAddress(), to, subject, html });
  } catch (err) {
    logFailure("sendOrderDelivered", err);
  }
}

export async function sendPaymentFailed(to: string, orderNumber: string) {
  try {
    const { subject, html } = paymentFailedEmail({
      orderNumber,
      retryUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/account/orders`,
    });
    await getResendClient().emails.send({ from: fromAddress(), to, subject, html });
  } catch (err) {
    logFailure("sendPaymentFailed", err);
  }
}

export async function sendSubscriptionFailed(to: string, planName: string) {
  try {
    const { subject, html } = subscriptionFailedEmail({
      planName,
      updatePaymentUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/account/subscriptions`,
    });
    await getResendClient().emails.send({ from: fromAddress(), to, subject, html });
  } catch (err) {
    logFailure("sendSubscriptionFailed", err);
  }
}

export async function sendSubscriptionRenewal(
  to: string,
  data: { planName: string; amount: number; nextBillingDate: string },
) {
  try {
    const { subject, html } = subscriptionRenewalEmail(data);
    await getResendClient().emails.send({ from: fromAddress(), to, subject, html });
  } catch (err) {
    logFailure("sendSubscriptionRenewal", err);
  }
}

export async function sendSubscriptionConfirmation(
  to: string,
  data: { planName: string; amount: number },
) {
  try {
    const { subject, html } = subscriptionConfirmationEmail({
      planName: data.planName,
      amount: data.amount,
      manageUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/account/subscriptions`,
    });
    await getResendClient().emails.send({ from: fromAddress(), to, subject, html });
  } catch (err) {
    logFailure("sendSubscriptionConfirmation", err);
  }
}

export async function sendRefundConfirmation(to: string, orderNumber: string, refundAmount: number) {
  try {
    const { subject, html } = refundConfirmationEmail({ orderNumber, refundAmount });
    await getResendClient().emails.send({ from: fromAddress(), to, subject, html });
  } catch (err) {
    logFailure("sendRefundConfirmation", err);
  }
}

export async function sendOrderCancellation(to: string, orderNumber: string, wasPaid: boolean) {
  try {
    const { subject, html } = orderCancellationEmail({ orderNumber, wasPaid });
    await getResendClient().emails.send({ from: fromAddress(), to, subject, html });
  } catch (err) {
    logFailure("sendOrderCancellation", err);
  }
}

export async function sendAdminFormNotification(
  formType: string,
  data: { name?: string; email: string; message?: string },
) {
  try {
    const replyTo = process.env.RESEND_REPLY_TO;
    if (!replyTo) return;

    const { subject, html } = adminNotificationEmail({
      formType,
      name: data.name,
      email: data.email,
      date: new Date().toLocaleString("en-US"),
      message: data.message,
    });
    await getResendClient().emails.send({ from: fromAddress(), to: replyTo, subject, html });
  } catch (err) {
    logFailure("sendAdminFormNotification", err);
  }
}
