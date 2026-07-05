"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { VideoWithFallback } from "@/components/ui/MediaWithFallback";

const TRUST = [
  { title: "528HZ Infused", sub: "Binaural frequency of love" },
  { title: "Ultra-Purified", sub: "Nothing but pure hydration" },
  { title: "Free From Additives", sub: "No sugars · no synthetics" },
];

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-28 pb-16">
      {/* Full-bleed video background */}
      <div className="absolute inset-0">
        <VideoWithFallback src="/videos/hero.mp4" className="object-cover" speed={0.7} />
        {/* faint wash only — keeps the video clear while lifting text contrast */}
        <div className="absolute inset-0 bg-white/15" />
        {/* soft bottom gradient so headline/CTA area stays readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-white/10 to-transparent" />
      </div>

      {/* Editorial depth text */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1.5 }}
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center font-cormorant font-bold leading-none text-violet/[0.06]"
        style={{ fontSize: "35vw" }}
        aria-hidden
      >
        ELEV8
      </motion.span>

      {/* Content overlay */}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
        {/* LEFT — headline */}
        <div className="text-center lg:text-left">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-inter text-[10px] font-semibold uppercase tracking-[0.5em] text-violet"
          >
            The World&apos;s Greatest
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-3 font-cormorant font-bold leading-[0.9] text-violet text-[52px] md:text-[80px] lg:text-[96px]"
          >
            ELEV8
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="font-cormorant font-bold leading-[0.9] text-violet text-[52px] md:text-[80px] lg:text-[96px]"
          >
            WATER.
          </motion.h1>

          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mx-auto mt-6 block h-[2px] w-20 origin-left bg-violet lg:mx-0"
          />

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="mx-auto mt-6 max-w-md font-inter text-[15px] leading-relaxed text-violet/80 lg:mx-0"
          >
            Ultra-Purified · 528hz Frequency Infused. 1 Water. 12 Understanding.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 flex justify-center lg:justify-start"
          >
            <a
              href="#shop"
              className="group flex h-[52px] items-center gap-2 rounded bg-violet px-8 font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-white shadow-lg shadow-violet/30 transition-transform duration-300 hover:scale-[1.03]"
            >
              Shop Now
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>
        </div>

        {/* RIGHT — trust points */}
        <div className="flex flex-col items-center gap-5 text-center lg:items-end lg:text-right">
          {TRUST.map((t, i) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + i * 0.12 }}
              className="flex items-center gap-3 lg:flex-row-reverse"
            >
              <span className="h-2 w-2 shrink-0 animate-glow-pulse rounded-full bg-violet" />
              <div>
                <p className="font-inter text-[12px] font-semibold uppercase tracking-[0.2em] text-violet">
                  {t.title}
                </p>
                <p className="font-inter text-[11px] text-violet/60">{t.sub}</p>
              </div>
            </motion.div>
          ))}

          <motion.a
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.3 }}
            href="#story"
            className="group mt-2 flex items-center gap-2 font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-violet/80 transition-colors hover:text-violet"
          >
            Our Story
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </motion.a>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-violet/40 text-violet"
        >
          <ChevronDown size={18} />
        </motion.div>
      </motion.div>
    </section>
  );
}
