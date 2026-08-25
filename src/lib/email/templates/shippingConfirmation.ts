import { emailLayout, escapeHtml, BRAND_VIOLET } from "./layout";

export function shippingConfirmationEmail({
  orderNumber,
  trackingNumber,
  carrier,
  estimatedDelivery,
  trackingUrl,
}: {
  orderNumber: string;
  trackingNumber: string;
  carrier: string;
  estimatedDelivery?: string;
  trackingUrl: string;
}): { subject: string; html: string } {
  const bodyHtml = `
    <h1 style="margin:0 0 20px;font-family:Georgia,serif;font-size:26px;color:${BRAND_VIOLET};">I AM on the way</h1>
    <p style="margin:0 0 16px;font-family:Georgia,serif;font-size:15px;line-height:1.8;color:#14142A;">
      Your ELEV8 WATER order <strong>${escapeHtml(orderNumber)}</strong> has shipped.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td style="padding:8px 0;font-family:Arial,sans-serif;font-size:13px;color:#8e8e9e;">Carrier</td>
        <td style="padding:8px 0;font-family:Arial,sans-serif;font-size:13px;color:#14142A;text-align:right;">${escapeHtml(carrier)}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;font-family:Arial,sans-serif;font-size:13px;color:#8e8e9e;">Tracking Number</td>
        <td style="padding:8px 0;font-family:Arial,sans-serif;font-size:13px;color:#14142A;text-align:right;">${escapeHtml(trackingNumber)}</td>
      </tr>
      ${
        estimatedDelivery
          ? `<tr>
        <td style="padding:8px 0;font-family:Arial,sans-serif;font-size:13px;color:#8e8e9e;">Estimated Delivery</td>
        <td style="padding:8px 0;font-family:Arial,sans-serif;font-size:13px;color:#14142A;text-align:right;">${escapeHtml(estimatedDelivery)}</td>
      </tr>`
          : ""
      }
    </table>
    <div style="text-align:center;margin-top:32px;">
      <a href="${trackingUrl}" style="display:inline-block;background-color:${BRAND_VIOLET};color:#ffffff;padding:14px 32px;border-radius:999px;text-decoration:none;font-family:Arial,sans-serif;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">Track Your Order</a>
    </div>
  `;

  return {
    subject: "Your ELEV8 WATER order has shipped!",
    html: emailLayout(bodyHtml, "Your order is on the way"),
  };
}
