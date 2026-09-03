"use client";

import { m } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { SectionLabel, GradientDivider } from "@/components/ui/primitives";

const PARAGRAPHS = [
  "ELEV8, derived from the word ELEVATE — meaning to raise or lift up to a higher level.",
  "Our ultra-purified water is infused with binaural frequency 528hz, the frequency of transformation and love. One water, twelve understandings, infinite potential.",
  "Every bottle is an invitation to rise. To reinvent, to renew, and to remember who you truly are.",
];

export default function OurStory() {
  return (
    <section id="story" className="relative overflow-hidden bg-white py-24 md:py-32">
      {/* Background ambient water glow */}
      <div className="pointer-events-none absolute -left-20 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-violet/5 blur-[100px]" />
      <div className="pointer-events-none absolute -right-20 top-1/3 h-[400px] w-[400px] rounded-full bg-teal/5 blur-[100px]" />

      <div className="relative mx-auto max-w-[1200px] px-6">
        <div className="flex justify-center text-center">
          <SectionLabel underline>Our Story</SectionLabel>
        </div>

        <h2 className="mt-8 text-center font-cormorant text-[36px] font-semibold leading-tight md:text-[56px]">
          <span className="text-ink">
            <span className="font-inter [font-variant-numeric:lining-nums]">1</span> WATER.{" "}
          </span>
          <span className="text-gradient-brand">
            <span className="font-inter [font-variant-numeric:lining-nums]">12</span> UNDERSTANDING
          </span>
        </h2>

        <div className="mt-6 flex justify-center">
          <GradientDivider width="w-24" />
        </div>

        {/* Content & Founders Image Grid */}
        <div className="mt-14 grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          
          {/* Left Column — Text Story */}
          <div className="flex flex-col text-center lg:col-span-6 lg:text-left">
            <div className="flex flex-col gap-6">
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
              className="text-glow-violet mt-10 font-cormorant text-[42px] italic text-violet"
            >
              I. AM. YOU.
            </m.p>

            <div className="mt-8 flex justify-center lg:justify-start">
              <m.a
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                href="/our-story"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-brand px-8 py-3.5 font-inter text-[11px] font-semibold uppercase tracking-[0.2em] text-white btn-glow"
              >
                Know More
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </m.a>
            </div>
          </div>

          {/* Right Column — Founders Image with Creative Bubble Effect */}
          <m.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-[480px] lg:col-span-6"
          >
            {/* Animated Floating Water Bubbles around the image */}
            {[
              { size: "h-14 w-14", top: "-top-4", left: "-left-4", delay: 0, duration: 4 },
              { size: "h-10 w-10", top: "top-1/4", left: "-left-8", delay: 1, duration: 5 },
              { size: "h-16 w-16", bottom: "-bottom-6", right: "-right-4", delay: 0.5, duration: 4.5 },
              { size: "h-8 w-8", top: "top-10", right: "-right-6", delay: 1.5, duration: 3.5 },
              { size: "h-12 w-12", bottom: "bottom-1/3", left: "-left-6", delay: 2, duration: 6 },
            ].map((bubble, idx) => (
              <m.div
                key={idx}
                animate={{
                  y: [0, -15, 0],
                  scale: [1, 1.08, 1],
                  opacity: [0.6, 0.9, 0.6],
                }}
                transition={{
                  duration: bubble.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: bubble.delay,
                }}
                className={`absolute ${bubble.size} ${bubble.top ?? ""} ${bubble.left ?? ""} ${bubble.right ?? ""} ${bubble.bottom ?? ""} pointer-events-none z-20 rounded-full border border-white/60 bg-gradient-to-br from-white/40 via-violet-300/30 to-teal-300/20 backdrop-blur-md shadow-[0_8px_32px_rgba(94,45,145,0.25)]`}
              >
                {/* Bubble inner highlight reflection */}
                <div className="absolute top-1.5 left-2 h-2 w-2 rounded-full bg-white/70" />
              </m.div>
            ))}

            {/* Main Glassmorphic Image Frame */}
            <div className="relative overflow-hidden rounded-[32px] border-2 border-violet/20 bg-white/40 p-3 shadow-[0_25px_60px_rgba(94,45,145,0.18)] backdrop-blur-xl transition-all duration-500 hover:border-violet/40 hover:shadow-[0_30px_70px_rgba(94,45,145,0.28)]">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[24px]">
                <Image
                  src="/images/Bottle%20updated%20image.jpeg"
                  alt="ELEV8 Water Bottle"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  priority
                />

                {/* Subtle gradient wash over image bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-violet/60 via-transparent to-transparent" />

                {/* Badge Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-white/20 bg-white/20 p-4 backdrop-blur-md">
                  <div>
                    <span className="flex items-center gap-1.5 font-inter text-[10px] font-bold uppercase tracking-[0.2em] text-green-400">
                      <Sparkles size={12} className="text-green-400" />
                      ELEV8 WATER
                    </span>
                    <p className="mt-0.5 font-cormorant text-[18px] text-white">
                      ELEV8 LOVE + ALL
                    </p>
                  </div>
                  <span className="rounded-full bg-gradient-brand px-3 py-1 font-inter text-[9px] font-bold uppercase tracking-widest text-white shadow-md">
                    EST. 2019
                  </span>
                </div>
              </div>
            </div>
          </m.div>

        </div>
      </div>
    </section>
  );
}
