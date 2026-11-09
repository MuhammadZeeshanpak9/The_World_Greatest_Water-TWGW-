"use client";

import { useState } from "react";
import { m } from "framer-motion";
import WaveTransition from "@/components/ui/WaveTransition";
import GlobalRetailMap from "@/components/sections/join/GlobalRetailMap";
import InquiryForm from "@/components/sections/join/InquiryForm";
import { usePrefersReducedMotion } from "@/lib/hooks";
import type { RetailMarket } from "@/data/retailMarkets";

const WHITE = "#ffffff";
const TINT = "#f0e8f8";

export default function JoinPageClient() {
  const [presetMarket, setPresetMarket] = useState<string | undefined>();
  const reducedMotion = usePrefersReducedMotion();

  const handleSelectMarket = (market: RetailMarket) => {
    setPresetMarket(market.name);
    document
      .getElementById("join-inquiry-form")
      ?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  };

  return (
    <>
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="font-cormorant text-[40px] font-bold text-ink md:text-[64px]">
            GLOBAL RETAIL EXPANSION
          </h2>
          <p className="mx-auto mt-3 max-w-xl font-inter text-base text-body">
            Our global retail network is expanding. Join as a retail partner in your market.
          </p>
          <p className="mx-auto mt-5 max-w-md font-inter text-[13px] text-muted">
            Tap a glowing dot to zoom into that market and see how to become a retailer there.
          </p>
        </div>

        {/* Full-bleed on mobile (no side padding) so the map gets the
            whole screen width to work with — at a narrow max-w-5xl
            gutter, the map was shrinking to ~325px wide, making each
            dot too small to tap comfortably. Padding returns at sm+. */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-14 max-w-5xl px-0 sm:px-6"
        >
          <GlobalRetailMap onSelectMarket={handleSelectMarket} />
        </m.div>
      </section>
      <WaveTransition fromColor={WHITE} toColor={TINT} variant={1} />

      <InquiryForm presetMarket={presetMarket} />
    </>
  );
}
