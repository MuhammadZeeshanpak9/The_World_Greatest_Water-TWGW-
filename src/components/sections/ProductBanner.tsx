"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { NOT_IN_WATER } from "@/data/content";
import { ImageWithFallback } from "@/components/ui/MediaWithFallback";
import { SectionLabel } from "@/components/ui/primitives";

export default function ProductBanner() {
  return (
    <section className="relative overflow-hidden bg-violet-tint py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2">
        {/* Left: organic-masked image */}
        <motion.div
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
              src={undefined}
              alt="With you in mind"
              watermark="banner-woman.jpg"
              rounded=""
            />
          </div>
          <div
            className="absolute -inset-4 -z-10 blur-3xl"
            style={{ background: "rgba(107,47,160,0.15)", borderRadius: "50%" }}
          />
        </motion.div>

        {/* Right: text */}
        <div>
          <SectionLabel className="items-start">With You In Mind</SectionLabel>
          <motion.p
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 max-w-lg font-inter text-base leading-[1.9] text-body"
          >
            ELEV8 WATER is ultra-purified and infused with binaural frequency
            528hz — crafted with nothing but you in mind. Pure hydration for a
            higher level of being.
          </motion.p>

          <motion.h3
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8 font-inter text-sm font-bold uppercase tracking-[0.2em] text-violet"
          >
            What&apos;s not in your personal water:
          </motion.h3>

          <ul className="mt-5 flex flex-col gap-3">
            {NOT_IN_WATER.map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25 + i * 0.08 }}
                className="flex items-center gap-3 font-inter text-[15px] text-body"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet/10 text-violet">
                  <Check size={14} strokeWidth={3} />
                </span>
                {item}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
