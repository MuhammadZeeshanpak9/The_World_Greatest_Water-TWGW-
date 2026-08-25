import { emailLayout, escapeHtml, BRAND_VIOLET } from "./layout";

export function subscriptionConfirmationEmail({
  planName,
  amount,
  manageUrl,
}: {
  planName: string;
  amount: number;
  manageUrl: string;
}): { subject: string; html: string } {
  const bodyHtml = `
    <h1 style="margin:0 0 20px;font-family:Georgia,serif;font-size:26px;color:${BRAND_VIOLET};">I AM subscribed</h1>
    <p style="margin:0 0 16px;font-family:Georgia,serif;font-size:15px;line-height:1.8;color:#14142A;">
      Your <strong>${escapeHtml(planName)}</strong> ELEV8 WATER subscription is active — $${amount.toFixed(2)} per ${escapeHtml(planName.toLowerCase())} delivery.
    </p>
    <div style="text-align:center;margin-top:32px;">
      <a href="${manageUrl}" style="display:inline-block;background-color:${BRAND_VIOLET};color:#ffffff;padding:14px 32px;border-radius:999px;text-decoration:none;font-family:Arial,sans-serif;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">Manage Subscription</a>
    </div>
  `;

  return {
    subject: "Your ELEV8 WATER subscription is confirmed",
    html: emailLayout(bodyHtml, "Your subscription is active"),
  };
}
