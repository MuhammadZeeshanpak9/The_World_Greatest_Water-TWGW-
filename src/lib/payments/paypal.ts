import { isPayPalEnabled } from "./config";

const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE ?? "https://api-m.sandbox.paypal.com";

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`,
  ).toString("base64");

  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error("Unable to authenticate with PayPal");
  const json = await res.json();
  return json.access_token;
}

/**
 * PayPal REST client — plain fetch() against the PayPal Orders v2 API, no SDK dependency
 * (same approach as the Coinbase Commerce client). Returns null whenever PayPal isn't
 * configured (placeholder client ID) — activates with zero code changes once real
 * NEXT_PUBLIC_PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET values are set.
 */
export function getPayPalClient() {
  if (!isPayPalEnabled()) return null;

  return {
    async createOrder(amount: number) {
      const token = await getAccessToken();
      const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [{ amount: { currency_code: "USD", value: amount.toFixed(2) } }],
        }),
      });
      if (!res.ok) throw new Error("Unable to create PayPal order");
      return res.json();
    },

    async captureOrder(orderId: string) {
      const token = await getAccessToken();
      const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Unable to capture PayPal order");
      return res.json();
    },
  };
}

/**
 * PayPal doesn't sign webhooks with a simple HMAC — verification is a server-side call to
 * PayPal's own /v1/notifications/verify-webhook-signature endpoint, passing the five
 * paypal-transmission-* headers plus the raw event body and the configured PAYPAL_WEBHOOK_ID.
 * Returns false (never throws) on any failure, same contract as the other webhook verifiers.
 */
export async function verifyPayPalWebhook(
  headers: {
    transmissionId: string | null;
    transmissionTime: string | null;
    certUrl: string | null;
    authAlgo: string | null;
    transmissionSig: string | null;
  },
  rawBody: string,
): Promise<boolean> {
  if (!isPayPalEnabled()) return false;
  if (
    !headers.transmissionId ||
    !headers.transmissionTime ||
    !headers.certUrl ||
    !headers.authAlgo ||
    !headers.transmissionSig
  ) {
    return false;
  }

  try {
    const token = await getAccessToken();
    const res = await fetch(`${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        transmission_id: headers.transmissionId,
        transmission_time: headers.transmissionTime,
        cert_url: headers.certUrl,
        auth_algo: headers.authAlgo,
        transmission_sig: headers.transmissionSig,
        webhook_id: process.env.PAYPAL_WEBHOOK_ID,
        webhook_event: JSON.parse(rawBody),
      }),
    });
    if (!res.ok) return false;
    const json = await res.json();
    return json.verification_status === "SUCCESS";
  } catch {
    return false;
  }
}
