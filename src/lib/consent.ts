const CONSENT_KEY = "elev8_cookie_consent";

export type ConsentLevel = "all" | "essential";

export function getConsentLevel(): ConsentLevel | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(CONSENT_KEY);
  return value === "all" || value === "essential" ? value : null;
}

export function setConsent(level: ConsentLevel): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONSENT_KEY, level);
}

export function hasAnalyticsConsent(): boolean {
  return getConsentLevel() === "all";
}
