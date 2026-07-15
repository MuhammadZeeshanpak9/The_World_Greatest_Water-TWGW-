"use client";

import { m } from "framer-motion";
import { ImageWithFallback } from "@/components/ui/MediaWithFallback";
import { SectionLabel } from "@/components/ui/primitives";

export default function ProductBanner() {
  return (
    <section className="relative overflow-hidden bg-violet-tint py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2">
        {/* Left: organic-masked image */}
        <m.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative aspect-[4/5] w-full"
        >
          <div
            className="relative h-full w-full overflow-hidden"
            style={{ borderRadius: "48% 52% 44% 56% / 55% 48% 52% 45%" }}
          >
            <ImageWithFallback
              src="/images/welness.png"
              alt="With you in mind"
              watermark="banner-woman.jpg"
              rounded=""
              className="object-center"
            />
          </div>
          <div
            className="absolute -inset-4 -z-10 blur-3xl"
            style={{ background: "rgba(107,47,160,0.15)", borderRadius: "50%" }}
          />
        </m.div>

        {/* Right: text */}
        <div>
          <SectionLabel className="items-start">With You In Mind</SectionLabel>
          <m.p
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 max-w-lg font-inter text-base leading-[1.9] text-body"
          >
            Inside every bottle of{" "}
            <strong className="font-semibold text-ink">
              THE WORLD&apos;S GREATEST WATER. ELEV8 WATER
            </strong>{" "}
            is a refreshing ultra-pure water, soothing and enjoyable to the
            body, mind and soul allowing a more natural connection to life&apos;s
            beautiful experiences.
          </m.p>

          <m.h3
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8 font-inter text-sm font-bold uppercase tracking-[0.2em] text-violet"
          >
            What&apos;s not in your personal water:
          </m.h3>

          <m.p
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="mt-5 max-w-lg font-inter text-[15px] leading-[1.9] text-body"
          >
            FREE FROM Chemical Additives such as Chlorine, Fluoride, Sodium
            Bicarbonate and many more to deliver a refreshing and pure
            hydrating experience.
          </m.p>
        </div>
      </div>
    </section>
  );
}
