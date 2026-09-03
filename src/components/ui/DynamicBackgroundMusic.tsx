"use client";

import dynamic from "next/dynamic";

const DynamicBackgroundMusic = dynamic(() => import("./BackgroundMusic"), { ssr: false });

export default DynamicBackgroundMusic;
