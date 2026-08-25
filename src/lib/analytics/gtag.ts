import { isGA4Enabled, isProduction } from "./config";

export function getGA4ScriptSrc(): string {
  return `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID}`;
}

export function getGA4InitScript(): string {
  const id = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
  return `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');`;
}

type Gtag = (...args: unknown[]) => void;

export function gtagEvent(eventName: string, params?: Record<string, unknown>): void {
  if (!isGA4Enabled()) {
    if (!isProduction()) console.log("[GA4 DEV]", eventName, params);
    return;
  }
  (window as unknown as { gtag?: Gtag }).gtag?.("event", eventName, params);
}
