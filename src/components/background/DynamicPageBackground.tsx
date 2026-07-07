"use client";

import dynamic from "next/dynamic";

/**
 * Canvas/window-only decorative background — no SEO value, safe to skip SSR
 * and defer out of the critical bundle entirely.
 */
const DynamicPageBackground = dynamic(() => import("./PageBackground"), {
  ssr: false,
});

export default DynamicPageBackground;
