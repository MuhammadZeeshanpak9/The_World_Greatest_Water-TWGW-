"use client";

import { m } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionLabel, GradientDivider } from "@/components/ui/primitives";

const PARAGRAPHS = [
  "ELEV8, derived from the word ELEVATE — meaning to raise or lift up to a higher level.",
  "Our ultra-purified water is infused with binaural frequency 528hz, the frequency of transformation and love. One water, twelve understandings, infinite potential.",
  "Every bottle is an invitation to rise. To reinvent, to renew, and to remember who you truly are.",
];

export default function OurStory() {
  return (
    <section id="story" className="relative bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[860px] px-6 text-center">
        <div className="flex justify-center">
          <SectionLabel underline>Our Story</SectionLabel>
        </div>

        <h2 className="mt-8 font-cormorant text-[36px] font-semibold leading-tight md:text-[56px]">
          <span className="text-ink">1 WATER. </span>
          <span className="text-gradient-brand">12 UNDERSTANDING</span>
        </h2>

        <div className="mt-6 flex justify-center">
          <GradientDivider width="w-24" />
        </div>

        <div className="mt-8 flex flex-col gap-6">
          {PARAGRAPHS.map((p, i) => (
            <m.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="font-inter text-base leading-[1.95] text-body"
            >
              {p}
            </m.p>
          ))}
        </div>

        <m.p
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-glow-violet mt-14 font-cormorant text-[42px] italic text-violet"
        >
          I. AM. YOU.
        </m.p>

        <m.a
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          href="#"
          className="group mt-12 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-8 py-3 font-inter text-[11px] font-semibold uppercase tracking-[0.2em] text-white btn-glow"
        >
          Know More
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </m.a>
      </div>
    </section>
  );
}
