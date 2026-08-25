import { emailLayout, escapeHtml, BRAND_VIOLET } from "./layout";

export function subscriptionFailedEmail({
  planName,
  updatePaymentUrl,
}: {
  planName: string;
  updatePaymentUrl: string;
}): { subject: string; html: string } {
  const bodyHtml = `
    <h1 style="margin:0 0 20px;font-family:Georgia,serif;font-size:26px;color:${BRAND_VIOLET};">Subscription Payment Issue</h1>
    <p style="margin:0 0 16px;font-family:Georgia,serif;font-size:15px;line-height:1.8;color:#14142A;">
      We were unable to process your renewal for your <strong>${escapeHtml(planName)}</strong> ELEV8 WATER subscription.
      Please update your payment method to keep your subscription active.
    </p>
    <div style="text-align:center;margin-top:32px;">
      <a href="${updatePaymentUrl}" style="display:inline-block;background-color:${BRAND_VIOLET};color:#ffffff;padding:14px 32px;border-radius:999px;text-decoration:none;font-family:Arial,sans-serif;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">Update Payment Method</a>
    </div>
  `;

  return {
    subject: "Subscription payment issue — ELEV8 WATER",
    html: emailLayout(bodyHtml, "We couldn't process your renewal"),
  };
}
