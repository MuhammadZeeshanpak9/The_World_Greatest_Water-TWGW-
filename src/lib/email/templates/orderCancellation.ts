import { emailLayout, escapeHtml, BRAND_VIOLET } from "./layout";

export function orderCancellationEmail({
  orderNumber,
  wasPaid,
}: {
  orderNumber: string;
  wasPaid: boolean;
}): { subject: string; html: string } {
  const bodyHtml = `
    <h1 style="margin:0 0 20px;font-family:Georgia,serif;font-size:26px;color:${BRAND_VIOLET};">Order Cancelled</h1>
    <p style="margin:0 0 16px;font-family:Georgia,serif;font-size:15px;line-height:1.8;color:#14142A;">
      Your order <strong>${escapeHtml(orderNumber)}</strong> has been cancelled.
    </p>
    ${
      wasPaid
        ? `<p style="margin:0 0 16px;font-family:Georgia,serif;font-size:15px;line-height:1.8;color:#14142A;">
             A refund has been initiated and will appear on your original payment method within 5-10 business days.
           </p>`
        : ""
    }
  `;

  return {
    subject: `Your order #${orderNumber} has been cancelled`,
    html: emailLayout(bodyHtml, "Your order has been cancelled"),
  };
}
