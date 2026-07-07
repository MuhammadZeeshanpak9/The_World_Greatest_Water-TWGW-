"use client";

import { m } from "framer-motion";
import { ImageWithFallback } from "@/components/ui/MediaWithFallback";
import { GradientDivider } from "@/components/ui/primitives";

export default function WhyElev8() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero py-24 md:py-32">
      {/* drifting violet orbs */}
      <div
        className="pointer-events-none absolute -left-20 top-10 h-80 w-80 rounded-full will-change-transform"
        style={{
          background: "rgba(107,47,160,0.25)",
          filter: "blur(90px)",
          animation: "orbDrift1 18s ease-in-out infinite",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-10 bottom-0 h-72 w-72 rounded-full will-change-transform"
        style={{
          background: "rgba(78,205,196,0.15)",
          filter: "blur(90px)",
          animation: "orbDrift2 22s ease-in-out infinite",
        }}
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2">
        {/* Left */}
        <div>
          <h2 className="font-cormorant text-[36px] font-semibold text-white md:text-[52px]">
            Why ELEV8 WATER?
          </h2>
          <div className="mt-5">
            <GradientDivider width="w-20" />
          </div>
          <p className="mt-6 max-w-lg font-inter text-base leading-[1.9] text-white/65">
            We are the number one self-development and wellness brand in the
            world — like no other brand globally. More than water, ELEV8 is a
            practice, a frequency, and a return to self.
          </p>

          <p className="mt-8 font-inter text-[11px] font-semibold uppercase tracking-[0.25em] text-teal">
            Our Brand
          </p>
          <p className="mt-3 max-w-lg font-inter text-base leading-[1.9] text-white/65">
            One water. Twelve understandings. Infused with 528hz and crafted to
            elevate every part of your life — body, mind and soul.
          </p>

          <m.p
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: [0.8, 1.05, 1] }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-gradient-brand mt-10 font-cormorant text-[44px] italic md:text-[56px]"
            style={{ textShadow: "0 0 60px rgba(107,47,160,0.6)" }}
          >
            I. AM. YOU.
          </m.p>
        </div>

        {/* Right image */}
        <m.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative aspect-square w-full"
        >
          <div
            className="relative h-full w-full overflow-hidden"
            style={{ borderRadius: "56% 44% 52% 48% / 48% 55% 45% 52%" }}
          >
            <ImageWithFallback
              src={undefined}
              alt="ELEV8 brand blueprint"
              watermark="brand-blueprint.png"
              rounded=""
            />
          </div>
          <div
            className="absolute -inset-6 -z-10 blur-3xl"
            style={{ background: "rgba(107,47,160,0.3)", borderRadius: "50%" }}
          />
        </m.div>
      </div>
    </section>
  );
}
