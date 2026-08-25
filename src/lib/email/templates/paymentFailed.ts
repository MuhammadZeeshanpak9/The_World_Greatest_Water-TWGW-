import { emailLayout, escapeHtml, BRAND_VIOLET } from "./layout";

export function paymentFailedEmail({
  orderNumber,
  retryUrl,
}: {
  orderNumber: string;
  retryUrl: string;
}): { subject: string; html: string } {
  const bodyHtml = `
    <h1 style="margin:0 0 20px;font-family:Georgia,serif;font-size:26px;color:${BRAND_VIOLET};">Payment Issue</h1>
    <p style="margin:0 0 16px;font-family:Georgia,serif;font-size:15px;line-height:1.8;color:#14142A;">
      Your payment for order <strong>${escapeHtml(orderNumber)}</strong> could not be processed.
      No charge was made. Please try again with a different payment method.
    </p>
    <div style="text-align:center;margin-top:32px;">
      <a href="${retryUrl}" style="display:inline-block;background-color:${BRAND_VIOLET};color:#ffffff;padding:14px 32px;border-radius:999px;text-decoration:none;font-family:Arial,sans-serif;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">Retry Payment</a>
    </div>
  `;

  return {
    subject: "Payment issue — Your ELEV8 WATER order",
    html: emailLayout(bodyHtml, "Your payment could not be processed"),
  };
}
