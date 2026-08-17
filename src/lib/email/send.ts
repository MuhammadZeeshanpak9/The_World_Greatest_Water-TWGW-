import { getResendClient } from "./resend";
import { welcomeEmail } from "./templates/welcome";
import { orderConfirmationEmail } from "./templates/orderConfirmation";
import { passwordResetEmail } from "./templates/passwordReset";
import { waitlistConfirmationEmail } from "./templates/waitlistConfirmation";
import { adminNotificationEmail } from "./templates/adminNotification";

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
  },
) {
  try {
    const { subject, html } = orderConfirmationEmail({
      orderNumber: order.orderNumber,
      items: order.items,
      shippingAddress: order.shippingAddress,
      total: order.total,
      trackOrdersUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/account/orders`,
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
