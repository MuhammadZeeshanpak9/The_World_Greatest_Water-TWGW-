"use client";

import { useState } from "react";
import { m } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { VideoWithFallback } from "@/components/ui/MediaWithFallback";

const TRUST = [
  { title: "528HZ Infused", sub: "Binaural frequency of love" },
  { title: "Ultra-Purified", sub: "My Personal Water" },
  { title: "Free From Additives", sub: "I ONLY DRINK THE GREATEST" },
];

export default function Hero() {
  const [rippling, setRippling] = useState(false);

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
      <m.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1.5 }}
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center font-cormorant font-bold leading-none text-violet/[0.06]"
        style={{ fontSize: "35vw" }}
        aria-hidden
      >
        ELEV8
      </m.span>

      {/* Content overlay */}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
        {/* LEFT — headline */}
        <div className="text-center lg:text-left">
          <m.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="font-cormorant font-bold leading-[0.95] text-gradient-brand text-[38px] md:text-[60px] lg:text-[72px]"
          >
            THE WORLD&apos;S
          </m.h1>
          <m.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="font-cormorant font-bold leading-[0.95] text-gradient-brand text-[38px] md:text-[60px] lg:text-[72px]"
          >
            GREATEST WATER.
          </m.h1>

          <m.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="mt-3 font-inter text-[15px] font-semibold uppercase tracking-[0.5em] text-white"
          >
            ELEV8 WATER
          </m.p>

          <m.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mx-auto mt-6 block h-[2px] w-20 origin-left bg-violet lg:mx-0"
          />

          <m.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="mx-auto mt-6 max-w-md font-inter text-[15px] leading-relaxed text-violet/80 lg:mx-0"
          >
            The Number 1 Self-development And Wellness Brand In The World.
          </m.p>

          <m.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 flex justify-center lg:justify-start"
          >
            <a
              href="#shop"
              onClick={() => {
                setRippling(true);
                setTimeout(() => setRippling(false), 600);
              }}
              className="group relative overflow-hidden flex h-[52px] items-center gap-2 rounded-full bg-gradient-brand px-8 font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-white shadow-lg btn-glow transition-transform duration-300 active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-2">
                Shop Now
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </span>
              {rippling && (
                <span className="absolute inset-0 z-0 animate-water-ripple rounded-full bg-white/40" />
              )}
            </a>
          </m.div>
        </div>

        {/* RIGHT — trust points */}
        <div className="flex flex-col items-center gap-5 text-center lg:items-end lg:text-right">
          {TRUST.map((t, i) => (
            <m.div
              key={t.title}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + i * 0.12 }}
              className="flex items-center gap-3 lg:flex-row-reverse"
            >
              <span className="h-2 w-2 shrink-0 animate-glow-pulse rounded-full bg-violet" />
              <div>
                <p className="font-inter text-[12px] font-semibold uppercase tracking-[0.2em] text-white">
                  {t.title}
                </p>
                <p className="font-inter text-[11px] text-white/80">{t.sub}</p>
              </div>
            </m.div>
          ))}

          <m.a
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.3 }}
            href="#story"
            className="group mt-2 flex items-center gap-2 font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-violet/80 transition-colors hover:text-violet"
          >
            Our Story
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </m.a>
        </div>
      </div>

      {/* Scroll indicator */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
      >
        <m.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-violet/40 text-violet"
        >
          <ChevronDown size={18} />
        </m.div>
      </m.div>
    </section>
  );
}
