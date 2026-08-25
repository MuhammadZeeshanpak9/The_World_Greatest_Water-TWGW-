import { emailLayout, escapeHtml, BRAND_VIOLET } from "./layout";

export function subscriptionRenewalEmail({
  planName,
  amount,
  nextBillingDate,
}: {
  planName: string;
  amount: number;
  nextBillingDate: string;
}): { subject: string; html: string } {
  const bodyHtml = `
    <h1 style="margin:0 0 20px;font-family:Georgia,serif;font-size:26px;color:${BRAND_VIOLET};">I AM renewed</h1>
    <p style="margin:0 0 16px;font-family:Georgia,serif;font-size:15px;line-height:1.8;color:#14142A;">
      Thank you for continuing your ELEV8 journey. Your <strong>${escapeHtml(planName)}</strong> subscription has been renewed.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td style="padding:8px 0;font-family:Arial,sans-serif;font-size:13px;color:#8e8e9e;">Amount Charged</td>
        <td style="padding:8px 0;font-family:Arial,sans-serif;font-size:13px;color:#14142A;text-align:right;">$${amount.toFixed(2)}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;font-family:Arial,sans-serif;font-size:13px;color:#8e8e9e;">Next Billing Date</td>
        <td style="padding:8px 0;font-family:Arial,sans-serif;font-size:13px;color:#14142A;text-align:right;">${escapeHtml(nextBillingDate)}</td>
      </tr>
    </table>
  `;

  return {
    subject: "Your ELEV8 WATER subscription has been renewed",
    html: emailLayout(bodyHtml, "Your subscription renewed successfully"),
  };
}
