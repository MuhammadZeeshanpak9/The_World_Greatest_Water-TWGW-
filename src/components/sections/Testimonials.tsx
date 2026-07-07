"use client";

import { m } from "framer-motion";
import { Star } from "lucide-react";
import { TESTIMONIALS } from "@/data/content";

export default function Testimonials() {
  return (
    <section className="relative bg-violet-tint py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center font-cormorant text-[36px] font-semibold text-ink md:text-[52px]">
          WHAT THEY SAY
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <m.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -4 }}
              className="relative overflow-hidden rounded-[20px] transition-shadow hover:shadow-[0_16px_50px_rgba(107,47,160,0.14)] p-8 glass-card-light"
            >
              <span className="pointer-events-none absolute -top-2 left-5 select-none font-cormorant text-[80px] leading-none text-violet/25">
                &ldquo;
              </span>

              <div className="relative pt-8">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <m.span
                      key={s}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 + s * 0.1 }}
                    >
                      <Star size={16} className="fill-violet text-violet" />
                    </m.span>
                  ))}
                </div>

                <p className="mt-5 font-cormorant text-[20px] italic leading-[1.8] text-ink">
                  {t.quote}
                </p>
                <p className="mt-6 font-inter text-[13px] font-semibold uppercase tracking-[0.15em] text-violet">
                  {t.name}
                </p>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
