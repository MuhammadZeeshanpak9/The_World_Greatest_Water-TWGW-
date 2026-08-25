"use client";

import Script from "next/script";
import { isGA4Enabled, isMetaEnabled, isTikTokEnabled } from "@/lib/analytics/config";
import { getGA4ScriptSrc, getGA4InitScript } from "@/lib/analytics/gtag";
import { getMetaInitScript } from "@/lib/analytics/meta";
import { getTikTokInitScript } from "@/lib/analytics/tiktok";

/**
 * Handles the "returning visitor who already consented in a prior session" case on mount.
 * The "consent granted mid-session" case is handled separately by loadAnalyticsScripts(),
 * called directly from CookieConsent's "Accept All" handler.
 */
export default function AnalyticsScripts() {
  return (
    <>
      {isGA4Enabled() && (
        <>
          <Script src={getGA4ScriptSrc()} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {getGA4InitScript()}
          </Script>
        </>
      )}
      {isMetaEnabled() && (
        <Script id="meta-init" strategy="afterInteractive">
          {getMetaInitScript()}
        </Script>
      )}
      {isTikTokEnabled() && (
        <Script id="tiktok-init" strategy="afterInteractive">
          {getTikTokInitScript()}
        </Script>
      )}
    </>
  );
}
