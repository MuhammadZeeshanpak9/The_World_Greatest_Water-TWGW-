"use client";

import { m } from "framer-motion";
import { BOTTLES } from "@/data/content";
import BottleCoverflow from "./BottleCoverflow";
import SectionParticles from "./SectionParticles";

export default function TwelveBottles() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero py-24 md:py-32">
      <SectionParticles count={40} />

      {/* giant faint 12 */}
      <span
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-cormorant font-bold leading-none text-violet/[0.03]"
        style={{ fontSize: "40vw" }}
        aria-hidden
      >
        12
      </span>

      <div className="relative mx-auto max-w-7xl px-6">
        <h2 className="mx-auto max-w-4xl text-center font-cormorant text-[36px] font-semibold leading-tight text-white md:text-[56px] flex flex-wrap justify-center gap-x-3 md:gap-x-4">
          {"EXPLORE OUR 12 INSPIRATIONAL BOTTLES".split(" ").map((word, wIdx) => (
            <span key={wIdx} className="inline-flex whitespace-nowrap">
              {word.split("").map((c, i) => (
                <m.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (wIdx * 5 + i) * 0.02 }}
                >
                  {c}
                </m.span>
              ))}
            </span>
          ))}
        </h2>
        <p className="mt-4 text-center font-inter text-[13px] uppercase tracking-[0.4em] text-teal">
          Created To Add Value To Your Life
        </p>

        <div className="mt-14">
          <BottleCoverflow items={BOTTLES} />
        </div>
      </div>
    </section>
  );
}
