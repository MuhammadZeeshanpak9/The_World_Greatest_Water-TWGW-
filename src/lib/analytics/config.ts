import { hasAnalyticsConsent } from "@/lib/consent";

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

export function isGA4Enabled(): boolean {
  const id = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
  return isProduction() && hasAnalyticsConsent() && !!id && id !== "G-PLACEHOLDER";
}

export function isMetaEnabled(): boolean {
  const id = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  return isProduction() && hasAnalyticsConsent() && !!id && id !== "PLACEHOLDER";
}

export function isTikTokEnabled(): boolean {
  const id = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
  return isProduction() && hasAnalyticsConsent() && !!id && id !== "PLACEHOLDER";
}
