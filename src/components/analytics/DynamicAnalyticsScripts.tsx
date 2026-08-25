"use client";

import dynamic from "next/dynamic";

const DynamicAnalyticsScripts = dynamic(() => import("./AnalyticsScripts"), { ssr: false });

export default DynamicAnalyticsScripts;
