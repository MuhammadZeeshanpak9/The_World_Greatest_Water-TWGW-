"use client";

import { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import Link from "next/link";
import { getConsentLevel, setConsent, type ConsentLevel } from "@/lib/consent";
import { loadAnalyticsScripts } from "@/lib/analytics/loadScripts";

export default function CookieConsent() {
  // This component is always dynamically imported with ssr:false, so it only ever mounts
  // client-side — safe to read localStorage directly in the lazy initializer.
  const [visible, setVisible] = useState(() => getConsentLevel() === null);

  function handleChoice(level: ConsentLevel) {
    setConsent(level);
    setVisible(false);
    if (level === "all") {
      loadAnalyticsScripts();
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          role="dialog"
          aria-label="Cookie consent"
          className="fixed inset-x-0 bottom-0 z-[9999] px-4 pb-4 sm:px-6"
        >
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 rounded-2xl border border-white/10 bg-[#0F0A1E]/95 p-6 backdrop-blur-xl sm:flex-row sm:justify-between">
            <p className="font-inter text-[13px] leading-relaxed text-white/80">
              We use cookies to enhance your experience and measure our impact.{" "}
              <Link
                href="/privacy-policy"
                className="text-white underline hover:text-[#B48CE0]"
              >
                Learn more
              </Link>
            </p>
            <div className="flex shrink-0 gap-3">
              <button
                type="button"
                onClick={() => handleChoice("essential")}
                className="rounded-full border border-white/30 px-5 py-2.5 font-inter text-[11px] font-semibold tracking-[0.15em] text-white uppercase transition-colors hover:bg-white/10"
              >
                Essential Only
              </button>
              <button
                type="button"
                onClick={() => handleChoice("all")}
                className="rounded-full bg-[#6B2FA0] px-5 py-2.5 font-inter text-[11px] font-semibold tracking-[0.15em] text-white uppercase transition-opacity hover:opacity-90"
              >
                Accept All
              </button>
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
