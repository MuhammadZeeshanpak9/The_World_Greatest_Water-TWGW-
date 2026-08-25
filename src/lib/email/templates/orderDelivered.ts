import { emailLayout, escapeHtml, BRAND_VIOLET } from "./layout";

export function orderDeliveredEmail({
  orderNumber,
  reorderUrl,
}: {
  orderNumber: string;
  reorderUrl: string;
}): { subject: string; html: string } {
  const bodyHtml = `
    <h1 style="margin:0 0 20px;font-family:Georgia,serif;font-size:26px;color:${BRAND_VIOLET};">I AM delivered</h1>
    <p style="margin:0 0 16px;font-family:Georgia,serif;font-size:15px;line-height:1.8;color:#14142A;">
      Your ELEV8 WATER order <strong>${escapeHtml(orderNumber)}</strong> has been delivered.
      Thank you for choosing THE WORLD'S GREATEST WATER.
    </p>
    <div style="text-align:center;margin-top:32px;">
      <a href="${reorderUrl}" style="display:inline-block;background-color:${BRAND_VIOLET};color:#ffffff;padding:14px 32px;border-radius:999px;text-decoration:none;font-family:Arial,sans-serif;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">Shop Again</a>
    </div>
  `;

  return {
    subject: "Your ELEV8 WATER order has been delivered!",
    html: emailLayout(bodyHtml, "Your order has arrived"),
  };
}
