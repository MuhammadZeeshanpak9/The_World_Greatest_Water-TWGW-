"use client";

import { useEffect } from "react";
import { trackWellnessView } from "@/lib/analytics";

export default function WellnessViewTracker({ wellnessType }: { wellnessType: string }) {
  useEffect(() => {
    trackWellnessView(wellnessType);
  }, [wellnessType]);

  return null;
}
