import { emailLayout, escapeHtml, BRAND_VIOLET } from "./layout";

type OrderItem = { name: string; quantity: number; price: number };
type ShippingAddress = {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export function orderConfirmationEmail(params: {
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  total: number;
  trackOrdersUrl: string;
}): { subject: string; html: string } {
  const { orderNumber, items, shippingAddress, total, trackOrdersUrl } = params;

  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #eee;font-family:Arial,sans-serif;font-size:14px;color:#14142A;">${escapeHtml(item.name)}</td>
        <td style="padding:10px 0;border-bottom:1px solid #eee;font-family:Arial,sans-serif;font-size:14px;color:#4a4a5a;text-align:center;">×${item.quantity}</td>
        <td style="padding:10px 0;border-bottom:1px solid #eee;font-family:Arial,sans-serif;font-size:14px;color:#14142A;text-align:right;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`,
    )
    .join("");

  const body = `
    <p style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${BRAND_VIOLET};margin:0 0 8px;">I ONLY DRINK THE GREATEST</p>
    <h1 style="font-family:Georgia,serif;font-size:26px;color:#14142A;margin:0 0 8px;">Order Confirmed</h1>
    <p style="font-family:Arial,sans-serif;font-size:18px;font-weight:bold;color:${BRAND_VIOLET};margin:0 0 24px;">${escapeHtml(orderNumber)}</p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      ${itemsHtml}
      <tr>
        <td colspan="2" style="padding:14px 0 0;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;color:#14142A;">Total</td>
        <td style="padding:14px 0 0;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;color:#14142A;text-align:right;">$${total.toFixed(2)}</td>
      </tr>
    </table>

    <h2 style="font-family:Arial,sans-serif;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#8e8e9e;margin:0 0 8px;">Shipping To</h2>
    <p style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#4a4a5a;margin:0 0 24px;">
      ${escapeHtml(shippingAddress.address1)}${shippingAddress.address2 ? `<br/>${escapeHtml(shippingAddress.address2)}` : ""}<br/>
      ${escapeHtml(shippingAddress.city)}, ${escapeHtml(shippingAddress.state)} ${escapeHtml(shippingAddress.zip)}<br/>
      ${escapeHtml(shippingAddress.country)}
    </p>

    <div style="text-align:center;margin:32px 0 0;">
      <a href="${trackOrdersUrl}" style="display:inline-block;background-color:${BRAND_VIOLET};color:#ffffff;font-family:Arial,sans-serif;font-size:13px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;text-decoration:none;padding:14px 32px;border-radius:6px;">Track Your Order</a>
    </div>
  `;

  return {
    subject: `Order Confirmed — ${orderNumber}`,
    html: emailLayout(body, `Your order ${orderNumber} is confirmed.`),
  };
}
