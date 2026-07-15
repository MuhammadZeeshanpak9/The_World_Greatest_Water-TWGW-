"use client";

import { m } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { WELLNESS_CARDS } from "@/data/content";
import { usePrefersReducedMotion } from "@/lib/hooks";

// Helper component to render the beautiful custom backgrounds
// Helper component to render the beautiful custom backgrounds in vibrant purple tones
const CardBackground = ({ index }: { index: number }) => {
  switch (index) {
    case 0:
      return (
        <div className="absolute inset-0 flex flex-col font-inter bg-white">
          <div className="flex-1 border-b-[0.5px] border-[#6b2fa0]/30 flex items-center justify-center text-[#6b2fa0] relative bg-[#f9f5fd]">
            <div className="grid grid-cols-4 gap-x-2 gap-y-[4px] text-center text-[13px] tracking-[0.4em] font-medium mt-4 z-10">
              <span>I</span><span>N</span><span>E</span><span>X</span>
              <span>H</span><span>A</span><span>H</span><span>A</span>
              <span>L</span><span>E</span><span>L</span><span>E</span>
            </div>
            {/* vertical line */}
            <div className="absolute top-0 bottom-0 left-1/2 w-[0.5px] bg-[#6b2fa0] opacity-20" />
          </div>
          <div className="flex-1 bg-[#ead9fa] text-[#4b1d75] flex items-center justify-center">
            <div className="flex flex-col items-center gap-[4px] text-[13px] tracking-[0.4em] font-semibold mb-4">
              <div className="flex gap-6"><span>R</span><span>E</span></div>
              <div className="flex gap-6"><span>L</span><span>A</span></div>
              <div>X</div>
            </div>
          </div>
        </div>
      );
    case 1:
      return (
        <div className="absolute inset-0 bg-[#e8dbf7] overflow-hidden">
          {/* Concrete/Paper texture overlay */}
          <div className="absolute inset-0 opacity-15 mix-blend-multiply" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')" }} />
          <svg className="absolute inset-0 w-full h-full text-[#6b2fa0]/20" preserveAspectRatio="none" viewBox="0 0 100 100">
            <polygon points="-10,-10 60,-10 15,45" fill="currentColor"/>
            <polygon points="110,-10 110,30 35,90" fill="currentColor"/>
            <polygon points="-10,40 40,110 -10,110" fill="currentColor"/>
            <polygon points="35,110 110,110 85,35" fill="currentColor"/>
            <polygon points="50,40 70,20 80,60" fill="currentColor"/>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <p className="text-[#431866] text-[15px] font-inter font-bold text-center tracking-[0.2em] leading-[1.8] drop-shadow-sm">
              EVERYTHING<br/>STARTS IN<br/>THE MIND
            </p>
          </div>
        </div>
      );
    case 2:
      return (
        <div className="absolute inset-0 bg-[#fdfcff] flex items-center justify-center p-4">
          <div className="relative flex items-center justify-center w-full max-w-[160px] h-32">
            {/* The thin frame box */}
            <div className="absolute left-0 top-0 bottom-0 w-[55px] border border-[#bd9de0] bg-[#f5ecfd] shadow-sm" />
            
            <div className="relative z-10 flex items-center w-full px-2">
              <div className="text-[#8861b5] text-[9px] tracking-[0.2em] leading-[2] text-right w-[45px] mr-[10px]">
                THINK<br/>OF<br/>LIFE<br/>AS<br/>AN
              </div>
              <div className="text-[#51237a] text-[11px] tracking-[0.2em] font-medium">
                EXPERIENCE
              </div>
            </div>
          </div>
        </div>
      );
    case 3:
      return (
        <div className="absolute inset-0 flex flex-col bg-[#faf6ff] overflow-hidden">
          <div className="flex-1 flex flex-col items-center justify-center pb-6 z-10 relative bg-transparent">
            <p className="font-cormorant text-[#6b2fa0] text-[28px] tracking-widest leading-none">GO</p>
            <p className="font-cormorant text-[#6b2fa0] text-[20px] tracking-[0.15em] mt-3 leading-none">WITHIN</p>
          </div>
          <div className="flex-1 bg-[#8745c4] relative">
            <div className="absolute -top-4 left-0 right-0 h-8 bg-[#faf6ff] opacity-95" style={{ filter: "url(#roughEdge)" }} />
            {/* Glitter noise */}
            <div className="absolute inset-0 mix-blend-color-dodge opacity-50" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%224%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')" }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#360b5e] via-transparent to-transparent opacity-90" />
            <svg width="0" height="0" className="absolute">
              <filter id="roughEdge">
                <feTurbulence type="fractalNoise" baseFrequency="0.2" numOctaves="3" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </svg>
          </div>
        </div>
      );
    default:
      return <div className="absolute inset-0 bg-[#f7effc]" />;
  }
};

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
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WELLNESS_CARDS.map((card, i) => (
            <m.div
              key={card.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-[2px] h-[400px] shadow-sm transition-shadow hover:shadow-[0_20px_60px_rgba(107,47,160,0.2)] bg-white"
            >
              {/* The aesthetic background */}
              <CardBackground index={i} />

              {/* Default Name label at bottom (visible when NOT hovering) */}
              <div className="absolute inset-x-0 bottom-0 p-4 flex justify-center bg-gradient-to-t from-white/90 to-transparent transition-opacity duration-300 group-hover:opacity-0">
                <span className="font-inter text-[12px] font-bold uppercase tracking-[0.1em] text-ink drop-shadow-sm">
                  {card.name}
                </span>
              </div>

              {/* Hover Overlay - darkens background and shows text */}
              <div className="absolute inset-0 bg-[#290a47]/85 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-between p-8 z-20 backdrop-blur-sm">
                
                {/* Top blurb */}
                <div>
                  <p className="font-inter text-[10px] font-semibold uppercase tracking-[0.3em] text-white/70 border-b border-white/20 pb-3">
                    {card.blurb}
                  </p>
                  <h3 className="mt-4 font-inter text-[16px] font-bold uppercase tracking-[0.15em] text-white leading-snug">
                    {card.name}
                  </h3>
                </div>

                {/* Bottom CTA */}
                <div>
                  {card.price && (
                    <p className="font-cormorant text-[28px] text-white mb-4">{card.price}</p>
                  )}
                  <Link
                    href={card.href ?? "/contact"}
                    className="flex w-fit items-center gap-2 font-inter text-[11px] font-semibold uppercase tracking-[0.15em] text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors"
                  >
                    {card.cta}
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
