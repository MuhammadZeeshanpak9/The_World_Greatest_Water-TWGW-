import { emailLayout, escapeHtml, BRAND_VIOLET } from "./layout";

export function refundConfirmationEmail({
  orderNumber,
  refundAmount,
}: {
  orderNumber: string;
  refundAmount: number;
}): { subject: string; html: string } {
  const bodyHtml = `
    <h1 style="margin:0 0 20px;font-family:Georgia,serif;font-size:26px;color:${BRAND_VIOLET};">Refund Processed</h1>
    <p style="margin:0 0 16px;font-family:Georgia,serif;font-size:15px;line-height:1.8;color:#14142A;">
      Your refund of <strong>$${refundAmount.toFixed(2)}</strong> for order <strong>${escapeHtml(orderNumber)}</strong> has been processed.
      Allow 5-10 business days for it to appear on your original payment method.
    </p>
  `;

  return {
    subject: `Refund processed — ${orderNumber}`,
    html: emailLayout(bodyHtml, "Your refund has been processed"),
  };
}
