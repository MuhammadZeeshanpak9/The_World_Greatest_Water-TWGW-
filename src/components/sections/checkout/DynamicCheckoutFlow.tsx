"use client";

import dynamic from "next/dynamic";

/**
 * Pure client interactivity (step state, no data fetching) — no SSR value,
 * safe to defer out of the initial page bundle.
 */
const DynamicCheckoutFlow = dynamic(() => import("./CheckoutFlow"), {
  ssr: false,
});

export default DynamicCheckoutFlow;
