import { isGA4Enabled, isMetaEnabled, isTikTokEnabled } from "./config";
import { getGA4ScriptSrc, getGA4InitScript } from "./gtag";
import { getMetaInitScript } from "./meta";
import { getTikTokInitScript } from "./tiktok";

function injectInlineScript(content: string, id: string) {
  const script = document.createElement("script");
  script.id = id;
  script.text = content;
  document.head.appendChild(script);
}

function injectExternalScript(src: string) {
  const script = document.createElement("script");
  script.src = src;
  script.async = true;
  document.head.appendChild(script);
}

/**
 * Called right after the user grants "Accept All" consent, so analytics starts firing in the
 * same session without a page refresh. `AnalyticsScripts.tsx` only covers the initial-mount
 * case (a returning visitor who already consented in a prior session) — this covers granting
 * consent mid-session. Guards against double-injection if both paths somehow fire.
 */
export function loadAnalyticsScripts(): void {
  if (typeof document === "undefined") return;

  if (isGA4Enabled() && !document.getElementById("ga4-init")) {
    injectExternalScript(getGA4ScriptSrc());
    injectInlineScript(getGA4InitScript(), "ga4-init");
  }
  if (isMetaEnabled() && !document.getElementById("meta-init")) {
    injectInlineScript(getMetaInitScript(), "meta-init");
  }
  if (isTikTokEnabled() && !document.getElementById("tiktok-init")) {
    injectInlineScript(getTikTokInitScript(), "tiktok-init");
  }
}
