export function isStripeEnabled(): boolean {
  return !!process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== "sk_test_placeholder";
}

export function isPayPalEnabled(): boolean {
  return (
    !!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID &&
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID !== "paypal_placeholder"
  );
}

export function isShippoEnabled(): boolean {
  return !!process.env.SHIPPO_API_KEY && process.env.SHIPPO_API_KEY !== "shippo_placeholder";
}

export function isCoinbaseEnabled(): boolean {
  return (
    !!process.env.COINBASE_COMMERCE_API_KEY &&
    process.env.COINBASE_COMMERCE_API_KEY !== "coinbase_placeholder"
  );
}

export type PackageDimensions = { length: number; width: number; height: number; weight: number };

// Estimates only — client confirms real case dimensions/weights before launch.
export const PACKAGE_DIMENSIONS: Record<string, PackageDimensions> = {
  "elev8-water-16-9-fl-oz": { length: 16, width: 11, height: 9, weight: 15 },
  "elev8-water-1-liter": { length: 16, width: 11, height: 12, weight: 28 },
  default: { length: 12, width: 10, height: 8, weight: 5 },
};
