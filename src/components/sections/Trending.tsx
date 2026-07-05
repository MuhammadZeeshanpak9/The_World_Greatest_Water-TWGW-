"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { TRENDING_CIRCLES, VIDEO_CARDS } from "@/data/content";
import { GradientPlaceholder } from "@/components/ui/MediaWithFallback";
import SectionParticles from "./SectionParticles";

export default function Trending() {
  return (
    <section className="relative overflow-hidden bg-dark-base py-24 md:py-32">
      <SectionParticles count={30} />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center">
          <h2 className="font-cormorant text-[36px] font-semibold text-white md:text-[56px]">
            TRENDING
          </h2>
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-3 block h-[2px] w-24 origin-left bg-gradient-brand"
          />
        </div>

        {/* Instagram circles */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-6">
          {TRENDING_CIRCLES.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.06 }}
              className="group relative"
            >
              <div
                className="rounded-full p-[2px] will-change-transform group-hover:animate-spin-slow"
                style={{ background: "linear-gradient(135deg,#6b2fa0,#4ecdc4)" }}
              >
                <div className="relative h-[110px] w-[110px] overflow-hidden rounded-full border-2 border-dark-base">
                  <GradientPlaceholder watermark={c.label ?? "ELEV8"} className="rounded-full" />
                </div>
              </div>
              {c.badge && (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gold px-3 py-1 font-inter text-[9px] font-bold uppercase tracking-[0.1em] text-dark-base">
                  {c.badge}
                </span>
              )}
            </motion.div>
          ))}
        </div>

        {/* YouTube video cards */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {VIDEO_CARDS.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="overflow-hidden rounded-[20px] border border-white/10 p-4"
              style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)" }}
            >
              <div className="relative flex h-[240px] items-center justify-center overflow-hidden rounded-xl">
                <GradientPlaceholder className="rounded-xl" />
                <button
                  aria-label={`Play ${v.title}`}
                  className="group absolute flex h-16 w-16 items-center justify-center rounded-full bg-violet text-white shadow-lg shadow-violet/40 transition-transform hover:scale-110"
                >
                  <Play size={22} className="ml-1 fill-white" />
                </button>
              </div>
              <p className="mt-4 font-inter text-[15px] font-medium text-white/85">
                {v.title}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
