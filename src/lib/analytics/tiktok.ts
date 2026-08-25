import { isTikTokEnabled, isProduction } from "./config";

// TikTok's pixel loader is also self-loading — one init script, no separate <Script src>.
export function getTikTokInitScript(): string {
  const id = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
  return `!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<e.length;n++)ttq.setAndDefer(e,e[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=i+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
  ttq.load('${id}');
  ttq.page();
}(window, document, 'ttq');`;
}

type Ttq = { track: (...args: unknown[]) => void };

export function tiktokEvent(eventName: string, params?: Record<string, unknown>): void {
  if (!isTikTokEnabled()) {
    if (!isProduction()) console.log("[TIKTOK DEV]", eventName, params);
    return;
  }
  (window as unknown as { ttq?: Ttq }).ttq?.track(eventName, params);
}
