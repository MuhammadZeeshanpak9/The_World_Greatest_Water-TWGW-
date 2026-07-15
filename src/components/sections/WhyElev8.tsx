"use client";

import { m } from "framer-motion";
import Image from "next/image";

// Flower of Life Mandala SVG (Fully Animated)
const FlowerOfLife = () => (
  <m.svg 
    viewBox="0 0 100 100" 
    className="w-full h-auto max-w-[220px] mx-auto opacity-90 drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]"
    animate={{ rotate: 360 }}
    transition={{ duration: 80, ease: "linear", repeat: Infinity }}
  >
    <defs>
      <linearGradient id="fol-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6">
          <animate attributeName="stop-color" values="#8b5cf6;#ec4899;#8b5cf6" dur="8s" repeatCount="indefinite" />
        </stop>
        <stop offset="100%" stopColor="#ec4899">
          <animate attributeName="stop-color" values="#ec4899;#0ea5e9;#ec4899" dur="8s" repeatCount="indefinite" />
        </stop>
      </linearGradient>
    </defs>
    
    <m.circle 
      cx="50" cy="50" r="45" fill="none" stroke="url(#fol-grad)" strokeWidth="0.8"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 3, ease: "easeInOut" }}
      viewport={{ once: true }}
    />
    <m.circle 
      cx="50" cy="50" r="42" fill="none" stroke="url(#fol-grad)" strokeWidth="0.5"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 3, ease: "easeInOut", delay: 0.5 }}
      viewport={{ once: true }}
    />
    
    <g fill="none" stroke="url(#fol-grad)" strokeWidth="0.6">
      {[
        {cx: 50, cy: 50},
        {cx: 50, cy: 36},
        {cx: 62.1, cy: 43},
        {cx: 62.1, cy: 57},
        {cx: 50, cy: 64},
        {cx: 37.9, cy: 57},
        {cx: 37.9, cy: 43},
        {cx: 50, cy: 22},
        {cx: 62.1, cy: 29},
        {cx: 74.2, cy: 36},
        {cx: 74.2, cy: 50},
        {cx: 74.2, cy: 64},
        {cx: 62.1, cy: 71},
        {cx: 50, cy: 78},
        {cx: 37.9, cy: 71},
        {cx: 25.8, cy: 64},
        {cx: 25.8, cy: 50},
        {cx: 25.8, cy: 36},
        {cx: 37.9, cy: 29}
      ].map((pos, i) => (
        <m.circle 
          key={i} cx={pos.cx} cy={pos.cy} r="14"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.5, ease: "easeInOut", delay: 1 + (i * 0.1) }}
          viewport={{ once: true }}
        />
      ))}
    </g>
  </m.svg>
);

export default function WhyElev8() {
  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] py-24 md:py-32">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-[1500px] px-6">

        {/* Horizontal scroll container on mobile, grid on desktop */}
        <div className="flex flex-col lg:grid lg:grid-cols-5 gap-8 lg:gap-6">

          {/* COLUMN 1: 7 COLORS */}
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 transform origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />

            <p className="font-inter text-[13px] text-gray-300 leading-loose min-h-[120px] tracking-wide">
              Created to ELEV8 YOU<br />
              to an higher level<br />
              of understanding<br />
              and awareness<br />
              to LIFE.
            </p>

            <div className="w-12 h-[1px] bg-white/20 my-8" />

            <h3 className="font-cormorant italic text-[32px] text-white mb-6">
              7 Colors
            </h3>
            <p className="font-inter text-[12px] text-gray-400 leading-loose mb-12 tracking-wide max-w-[200px]">
              The 7 universal rainbow<br />
              colors which also represents<br />
              the 7 chakra colors<br />
              in ALL human body.
            </p>

            {/* Chakra image visualization */}
            {/* The container is visually larger than the column (120% width) to make the figure big, 
                but without using CSS scale, so the dots and text remain normal size. */}
            <div className="relative w-[130%] -ml-[15%] aspect-[4/5] mt-auto flex flex-col justify-center items-center mb-4">
              <div className="absolute inset-0 w-full h-full opacity-85">
                <Image
                  src="/images/meditation-figure.png"
                  alt="Meditating Body"
                  fill
                  className="object-contain"
                />
              </div>
              
              {/* 
                Adjust this horizontalOffset if the meditation figure is not perfectly centered in its PNG image file.
                For example, if the body is slightly to the right, change this to "52%" 
              */}
              <div className="absolute inset-0 w-full h-full" style={{ left: "50%" }}>
                {/* Chakra dots positioned along the figure's center spine */}
                {[
                  { color: "#8b5cf6", label: "TO KNOW",    top: "12%" },
                  { color: "#4f46e5", label: "TO SEE",     top: "22%" },
                  { color: "#0ea5e9", label: "TO SPEAK",   top: "32%" },
                  { color: "#10b981", label: "TO LOVE",    top: "43%" },
                  { color: "#eab308", label: "TO ACT",     top: "54%" },
                  { color: "#f97316", label: "TO FEEL",    top: "65%" },
                  { color: "#ef4444", label: "TO BE HERE", top: "75%" },
                ].map((chakra, i) => (
                  <div
                    key={i}
                    className="absolute flex items-center gap-3 z-10"
                    style={{ top: chakra.top, transform: "translateX(-50%)" }}
                  >
                    <div
                      className="w-5 h-5 rounded-full"
                      style={{
                        backgroundColor: chakra.color,
                        boxShadow: `0 0 15px 5px ${chakra.color}90, 0 0 25px 10px ${chakra.color}50`,
                      }}
                    />
                    <span className="font-inter text-[10px] tracking-[0.35em] text-white/90 whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-bold absolute left-[calc(100%+12px)]">
                      {chakra.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </m.div>

          {/* COLUMN 2: 12 BOTTLES */}
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center text-center p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl relative overflow-hidden group lg:-translate-y-4"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-pink-500 to-rose-500 transform origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />

            <p className="font-inter text-[13px] text-gray-300 leading-loose tracking-wide">
              The only drinking water<br />
              brand in the world that<br />
              truly CARES about YOU.
            </p>

            <p className="font-inter text-[11px] text-white/50 leading-relaxed tracking-wider mt-6 mb-8 uppercase">
              Imagination + Manifestation<br />
              + Ultra-Purified Water<br />
              + Positive Impact<br />
              On Your Life +<br />
              Love + Gratitude.
            </p>

            <h3 className="font-cormorant italic text-[32px] text-white mb-6">
              12 Bottles<br /><span className="text-[20px] not-italic text-white/70">to ELEV8</span>
            </h3>

            <p className="font-inter text-[11px] font-bold tracking-[0.2em] text-pink-400 mb-10">
              YOUR EXPERIENCE.
            </p>

            {/* Placeholder for images */}
            <div className="mt-auto w-full h-[180px] border border-dashed border-white/20 rounded-xl flex items-center justify-center bg-white/5">
              <span className="font-inter text-xs text-white/40 uppercase tracking-widest text-center px-4">
                12 Bottles<br />Visual Journey<br />(Coming Soon)
              </span>
            </div>
          </m.div>

          {/* COLUMN 3: WHY 12 BOTTLES */}
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center text-center p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 transform origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />

            <p className="font-inter text-[13px] text-gray-300 leading-loose min-h-[120px] tracking-wide">
              Explore the power of YOU<br />
              with our thoughtfully<br />
              created self-development<br />
              informations created<br />
              for YOU.
            </p>

            <div className="w-12 h-[1px] bg-white/20 my-8" />

            <h3 className="font-cormorant text-[28px] text-white mb-6 leading-tight">
              WHY WE CHOOSE<br />
              <span className="italic text-[36px] text-blue-400">12 Bottles?</span>
            </h3>

            <p className="font-inter text-[12px] text-gray-400 leading-loose tracking-wide max-w-[200px]">
              Represent the 12 most<br />
              important understanding<br />
              that would allow a more<br />
              enjoyable experience<br />
              in this grand design<br />
              called LIFE.
            </p>
          </m.div>

          {/* COLUMN 4: INTENTION & INFINITY */}
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center text-center p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl relative overflow-hidden group lg:-translate-y-4"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500 transform origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />

            <h3 className="font-cormorant italic text-[32px] text-amber-400 mb-6">
              Intention?
            </h3>

            <p className="font-inter text-[13px] text-gray-300 leading-loose min-h-[140px] tracking-wide">
              Setting a positive intention<br />
              before drinking your<br />
              personal water allows<br />
              you to stay focused on<br />
              <span className="text-white font-bold tracking-widest">GRATITUDE</span> and being<br />
              present in the NOW<br />
              which is all that EXISTS.
            </p>

            <div className="w-12 h-[1px] bg-white/20 my-8" />

            <h3 className="font-inter font-bold text-[14px] tracking-[0.2em] text-white mb-4">
              INFINITY SYMBOL
            </h3>
            <p className="font-inter text-[10px] text-white/50 uppercase tracking-widest leading-loose mb-8">
              THE UNLIMITED NATURE<br />OF CONCIOUSNESS.
            </p>

            <div className="flex-1 flex items-center justify-center mt-auto w-full pb-4">
              <svg viewBox="0 0 200 100" className="w-[180px] drop-shadow-[0_0_20px_rgba(251,191,36,0.5)] overflow-visible">
                <defs>
                  <linearGradient id="infinity-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24">
                      <animate attributeName="stop-color" values="#fbbf24;#f59e0b;#fbbf24" dur="4s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="100%" stopColor="#ea580c">
                      <animate attributeName="stop-color" values="#ea580c;#dc2626;#ea580c" dur="4s" repeatCount="indefinite" />
                    </stop>
                  </linearGradient>
                </defs>
                {/* Base Infinity Path - Draws in on scroll */}
                <m.path 
                  d="M100,50 C60,5 10,5 10,50 C10,95 60,95 100,50 C140,5 190,5 190,50 C190,95 140,95 100,50 Z" 
                  fill="none" 
                  stroke="url(#infinity-glow)" 
                  strokeWidth="8" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 2.5, ease: "easeInOut" }}
                  viewport={{ once: true }}
                />
                {/* Continuous traveling light pulse */}
                <m.path 
                  d="M100,50 C60,5 10,5 10,50 C10,95 60,95 100,50 C140,5 190,5 190,50 C190,95 140,95 100,50 Z" 
                  fill="none" 
                  stroke="#ffffff" 
                  strokeWidth="10" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="blur-[6px] mix-blend-overlay"
                  initial={{ pathLength: 0, pathOffset: 1 }}
                  animate={{ pathLength: 0.15, pathOffset: 0 }}
                  transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                />
                <m.path 
                  d="M100,50 C60,5 10,5 10,50 C10,95 60,95 100,50 C140,5 190,5 190,50 C190,95 140,95 100,50 Z" 
                  fill="none" 
                  stroke="#ffffff" 
                  strokeWidth="4" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, pathOffset: 1 }}
                  animate={{ pathLength: 0.05, pathOffset: 0 }}
                  transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                />
              </svg>
            </div>
          </m.div>

          {/* COLUMN 5: FLOWER OF LIFE */}
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center text-center p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-400 to-emerald-400 transform origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />

            <p className="font-inter text-[13px] text-gray-300 leading-loose min-h-[120px] tracking-wide">
              Mainly because its free<br />
              from all chemical additives<br />
              to allow a more natural<br />
              connection to life&apos;s beautiful<br />
              experiences.
            </p>

            <div className="w-12 h-[1px] bg-white/20 my-8" />

            <h3 className="font-cormorant italic text-[32px] text-white mb-4">
              Flower of Life
            </h3>
            <p className="font-inter text-[11px] text-teal-400 font-bold uppercase tracking-[0.2em] mb-12">
              The connection to everything.
            </p>

            <div className="flex-1 flex items-center justify-center mt-auto w-full">
              <FlowerOfLife />
            </div>
          </m.div>

        </div>
      </div>
    </section>
  );
}
