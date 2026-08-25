import crypto from "crypto";
import { isCoinbaseEnabled } from "./config";

const COINBASE_API_BASE = "https://api.commerce.coinbase.com";

type CoinbaseOrder = { orderNumber: string; total: number };

/**
 * Coinbase Commerce client — plain fetch() against their REST API (no SDK dependency, per your
 * instruction). Returns null whenever Coinbase isn't configured (placeholder API key) —
 * activates with zero code changes once a real COINBASE_COMMERCE_API_KEY is set.
 */
export function getCoinbaseClient() {
  if (!isCoinbaseEnabled()) return null;

  return {
    async createCharge(order: CoinbaseOrder): Promise<{ id: string; hosted_url: string }> {
      const res = await fetch(`${COINBASE_API_BASE}/charges`, {
        method: "POST",
        headers: {
          "X-CC-Api-Key": process.env.COINBASE_COMMERCE_API_KEY!,
          "X-CC-Version": "2018-03-22",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `ELEV8 WATER Order ${order.orderNumber}`,
          description: `Order ${order.orderNumber}`,
          pricing_type: "fixed_price",
          local_price: { amount: order.total.toFixed(2), currency: "USD" },
          metadata: { order_number: order.orderNumber },
        }),
      });
      if (!res.ok) throw new Error("Unable to create Coinbase charge");
      const json = await res.json();
      return { id: json.data.code, hosted_url: json.data.hosted_url };
    },

    async getCharge(chargeId: string) {
      const res = await fetch(`${COINBASE_API_BASE}/charges/${chargeId}`, {
        headers: {
          "X-CC-Api-Key": process.env.COINBASE_COMMERCE_API_KEY!,
          "X-CC-Version": "2018-03-22",
        },
      });
      if (!res.ok) throw new Error("Unable to fetch Coinbase charge");
      const json = await res.json();
      return json.data;
    },
  };
}

/**
 * Verifies the raw webhook body against the X-CC-Webhook-Signature header — HMAC-SHA256 keyed
 * with COINBASE_COMMERCE_WEBHOOK_SECRET, same "verify raw body before JSON.parse" discipline as
 * the Cal.com webhook.
 */
export function verifyCoinbaseWebhook(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  const expected = crypto
    .createHmac("sha256", process.env.COINBASE_COMMERCE_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest("hex");

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
