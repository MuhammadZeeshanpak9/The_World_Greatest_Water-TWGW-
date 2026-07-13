"use client";

import { m } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { WELLNESS_CARDS } from "@/data/content";
import { usePrefersReducedMotion } from "@/lib/hooks";

export default function Wellness() {
  const reduced = usePrefersReducedMotion();

  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-32">
      {/* faint moving water paths */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {[0, 1, 2].map((i) => (
          <svg
            key={i}
            className="absolute w-[200%]"
            style={{ top: `${20 + i * 28}%`, left: 0 }}
            height="80"
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
          >
            <path
              d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40"
              fill="none"
              stroke="rgba(107,47,160,0.03)"
              strokeWidth="2"
              className="will-change-transform"
              style={{
                animation: `waveFlow ${16 + i * 4}s linear infinite${i % 2 ? " reverse" : ""}`,
              }}
            />
          </svg>
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* INHALE / EXHALE */}
        {reduced ? (
          <div className="flex items-center justify-center gap-4 md:gap-10">
            <m.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-cormorant font-light leading-none text-ink text-[9vw] md:text-[6vw]"
            >
              INHALE
            </m.h2>
            <span className="h-[60px] w-px shrink-0 bg-violet" />
            <m.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="font-cormorant font-light leading-none text-[9vw] md:text-[6vw] text-gradient-brand"
            >
              EXHALE
            </m.h2>
            <span className="h-[60px] w-px shrink-0 bg-violet" />
            <m.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="font-cormorant font-light leading-none text-violet text-[9vw] md:text-[6vw]"
            >
              RELAX
            </m.h2>
          </div>
        ) : (
          <div className="overflow-hidden">
            <m.div
              className="flex w-max items-center gap-10 md:gap-16"
              animate={{ x: ["-50%", "0%"] }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            >
              {[0, 1].map((rep) => (
                <div
                  key={rep}
                  aria-hidden={rep === 1}
                  className="flex shrink-0 items-center gap-10 md:gap-16"
                >
                  <h2 className="font-cormorant font-light leading-none text-ink text-[14vw] md:text-[8vw]">
                    INHALE
                  </h2>
                  <span className="h-[60px] w-px shrink-0 bg-violet" />
                  <h2 className="font-cormorant font-light leading-none text-[14vw] md:text-[8vw] text-gradient-brand">
                    EXHALE
                  </h2>
                  <span className="h-[60px] w-px shrink-0 bg-violet" />
                  <h2 className="font-cormorant font-light leading-none text-violet text-[14vw] md:text-[8vw]">
                    RELAX
                  </h2>
                </div>
              ))}
            </m.div>
          </div>
        )}

        <m.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-center font-cormorant text-2xl italic text-violet/70"
        >
          SOUL. MIND. BODY
        </m.p>

        {/* Cards */}
        <div className="mt-16 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {WELLNESS_CARDS.map((card, i) => (
            <m.div
              key={card.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-[20px] transition-shadow hover:shadow-[0_20px_60px_rgba(107,47,160,0.15)] glass-card-light p-6"
            >
              {/* curved wave accent */}
              <svg
                className="absolute inset-x-0 top-0 h-3 w-full"
                viewBox="0 0 100 12"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  d="M0,6 C25,0 40,12 60,6 C75,2 90,10 100,5"
                  fill="none"
                  stroke="#6b2fa0"
                  strokeWidth="3"
                />
              </svg>

              <p className="mt-4 font-inter text-[10px] uppercase tracking-[0.3em] text-muted">
                {card.blurb}
              </p>
              <h3 className="mt-3 font-inter text-[11px] font-semibold uppercase tracking-[0.3em] text-ink">
                {card.name}
              </h3>
              {card.price && (
                <p className="mt-3 font-cormorant text-[26px] text-violet">{card.price}</p>
              )}
              <Link
                href={card.href ?? "/contact"}
                className="mt-6 flex items-center gap-1 font-inter text-[11px] font-semibold uppercase tracking-[0.15em] text-violet"
              >
                {card.cta}
                <ArrowRight
                  size={13}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
