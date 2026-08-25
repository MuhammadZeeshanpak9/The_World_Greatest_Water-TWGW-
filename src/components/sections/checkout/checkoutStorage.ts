import type { ContactValues, ShippingValues, SelectedRate } from "./types";

export const CHECKOUT_STATE_KEY = "elev8_checkout_state";

export type PersistedCheckoutState = {
  step: 1 | 2 | 3;
  contact: ContactValues | null;
  shipping: ShippingValues | null;
  selectedRate: SelectedRate | null;
  freeShipping: boolean;
};

export function readCheckoutState(): PersistedCheckoutState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CHECKOUT_STATE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedCheckoutState;
  } catch {
    return null;
  }
}

export function writeCheckoutState(state: PersistedCheckoutState): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(CHECKOUT_STATE_KEY, JSON.stringify(state));
  } catch {
    // sessionStorage can throw in private-browsing/quota-exceeded edge cases — losing checkout
    // resumption isn't worth failing the checkout flow over.
  }
}

export function clearCheckoutState(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(CHECKOUT_STATE_KEY);
}
