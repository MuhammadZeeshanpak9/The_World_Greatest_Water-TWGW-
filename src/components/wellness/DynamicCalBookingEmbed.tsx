"use client";

import dynamic from "next/dynamic";

// @calcom/embed-react has SSR incompatibility with the App Router — must be ssr:false. The 4
// wellness sub-pages that use this are Server Components, and `dynamic(..., {ssr:false})` isn't
// allowed directly inside one — same wrapper pattern as DynamicCookieConsent/DynamicPageBackground.
const DynamicCalBookingEmbed = dynamic(() => import("./CalBookingEmbed"), { ssr: false });

export default DynamicCalBookingEmbed;
