"use client";

import dynamic from "next/dynamic";

const DynamicCookieConsent = dynamic(() => import("./CookieConsent"), { ssr: false });

export default DynamicCookieConsent;
