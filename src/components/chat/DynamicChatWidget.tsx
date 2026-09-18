"use client";

import dynamic from "next/dynamic";

const DynamicChatWidget = dynamic(() => import("./ChatWidget"), { ssr: false });

export default DynamicChatWidget;
