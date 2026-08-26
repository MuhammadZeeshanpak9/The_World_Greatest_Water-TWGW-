"use client";

import { m } from "framer-motion";
import Image from "next/image";

// Flower of Life Mandala SVG (Fully Animated)
const FlowerOfLife = () => (
  <m.svg
    viewBox="0 0 100 100"
    className="w-full h-auto max-w-[220px] mx-0 opacity-90 drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]"
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
        { cx: 50, cy: 50 },
        { cx: 50, cy: 36 },
        { cx: 62.1, cy: 43 },
        { cx: 62.1, cy: 57 },
        { cx: 50, cy: 64 },
        { cx: 37.9, cy: 57 },
        { cx: 37.9, cy: 43 },
        { cx: 50, cy: 22 },
        { cx: 62.1, cy: 29 },
        { cx: 74.2, cy: 36 },
        { cx: 74.2, cy: 50 },
        { cx: 74.2, cy: 64 },
        { cx: 62.1, cy: 71 },
        { cx: 50, cy: 78 },
        { cx: 37.9, cy: 71 },
        { cx: 25.8, cy: 64 },
        { cx: 25.8, cy: 50 },
        { cx: 25.8, cy: 36 },
        { cx: 37.9, cy: 29 }
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

          {/* COLUMN 1: 7 COLORS — slides in from LEFT on mobile */}
          <m.div
            initial={{ opacity: 0, x: -40, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center text-center p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 transform origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />

            <p className="font-inter text-[11px] text-gray-400 mb-1">The Name</p>
            <h3 className="font-inter text-[20px] font-bold text-white mb-6">ELEV8</h3>

            <p className="font-inter text-[13px] text-gray-300 leading-loose min-h-[120px] tracking-wide">
              Created to ELEV8 the<br />
              profound mentalphysical<br />
              understanding &amp;<br />
              innerstanding of MYSELF.
            </p>

            <h3 className="font-inter font-bold text-[16px] text-white uppercase mt-12 mb-4 tracking-widest">
              7 COLORS
            </h3>
            <p className="font-inter text-[12px] text-gray-400 leading-loose mb-12 tracking-wide max-w-[200px]">
              The 7 universal rainbow<br />
              colors which also represents<br />
              the 7 chakra colors<br />
              in ALL human body.
            </p>

            {/* Chakra image visualization - Center aligned */}
            <m.div 
              className="relative w-full flex items-center justify-center mt-auto h-[120px]"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[440px] opacity-85 pointer-events-none">
                <Image
                  src="/images/meditation-figure.png"
                  alt="Meditating Soul"
                  fill
                  sizes="320px"
                  className="object-contain object-center blur-[6px] grayscale contrast-75 brightness-125"
                />
                <div className="absolute inset-0 w-full h-full" style={{ left: "50%" }}>
                  {[
                    { color: "#8b5cf6", label: "TO KNOW",    top: "30%" },
                    { color: "#4f46e5", label: "TO SEE",     top: "36%" },
                    { color: "#0ea5e9", label: "TO SPEAK",   top: "42%" },
                    { color: "#10b981", label: "TO LOVE",    top: "48%" },
                    { color: "#eab308", label: "TO ACT",     top: "54%" },
                    { color: "#f97316", label: "TO FEEL",    top: "60%" },
                    { color: "#ef4444", label: "TO BE HERE", top: "66%" },
                  ].map((chakra, i) => (
                    <div
                      key={i}
                      className="absolute flex items-center gap-3 z-10"
                      style={{ top: chakra.top, transform: "translateX(-50%)" }}
                    >
                      <m.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: chakra.color,
                          boxShadow: `0 0 10px 3px ${chakra.color}90, 0 0 15px 5px ${chakra.color}50`,
                        }}
                      />
                      <span className="font-inter text-[8px] tracking-[0.3em] text-white/90 whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-bold absolute left-[calc(100%+8px)]">
                        {chakra.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </m.div>
          </m.div>

          {/* COLUMN 2: 12 BOTTLES — slides in from RIGHT on mobile */}
          <m.div
            initial={{ opacity: 0, x: 40, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="flex flex-col items-center text-center p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl relative overflow-hidden group lg:-translate-y-4"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-pink-500 to-rose-500 transform origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />

            <h3 className="font-inter text-[18px] font-bold text-white uppercase mb-6 leading-tight">
              THE WORLD&apos;S<br />GREATEST WATER
            </h3>

            <p className="font-inter text-[13px] text-gray-300 leading-loose tracking-wide">
              THE ONLY BRAND<br />
              YOUNIVERSALLY THAT TRULY<br />
              CARES ABOUT MY<br />
              MENTALPHYSICAL ELEVATION.
            </p>

            <p className="font-inter text-[12px] text-white/70 leading-relaxed mt-6 mb-8">
              Imagination + Manifestation<br />
              + Ultra-Purified Water<br />
              + Positive Impact<br />
              On Your Life +<br />
              Love + Gratitude.
            </p>

            <h3 className="font-inter font-bold text-[16px] text-white uppercase mt-auto mb-2 tracking-widest">
              12 BOTTLES to ELEV8
            </h3>

            <p className="font-inter text-[12px] text-pink-400 mb-10">
              Your EXPERIENCE.
            </p>

            {/* 12 Bottles Grid */}
            <div className="w-full flex justify-center mt-auto mb-2">
              <div className="grid grid-cols-6 gap-x-2 gap-y-4">
                {[
                  { text: "ALL", color: "#9b78a9" },
                  { text: "YOU", color: "#2b2756" },
                  { text: "LOVE", color: "#88c258" },
                  { text: "DESIRE", color: "#d66c30" },
                  { text: "ENERGY", color: "#6ca1c4" },
                  { text: "BELIEVE", color: "#ebd256" },
                  { text: "VIBRATION", color: "#6da3c6" },
                  { text: "MINDSET", color: "#9a2b33" },
                  { text: "GRATITUDE", color: "#7cb757" },
                  { text: "FREQUENCY", color: "#71a1c9" },
                  { text: "THOUGHTS", color: "#e8c843" },
                  { text: "CONSCIOUSNESS", color: "#312a58" },
                ].map((bottle, i) => (
                  <m.div 
                    key={i} 
                    className="flex flex-col items-center group cursor-default"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
                  >
                    {/* Bottle Cap */}
                    <div className="w-[10px] h-[6px] rounded-t-sm bg-gradient-to-r from-white/40 via-white/60 to-white/30 border border-white/30 border-b-0" />
                    {/* Bottle Neck */}
                    <div className="w-[14px] h-[4px] bg-gradient-to-r from-white/20 via-white/40 to-white/10 border-x border-white/30" />
                    {/* Bottle Body */}
                    <div className="relative w-[32px] h-[95px] rounded-t-xl rounded-b-lg flex flex-col justify-center overflow-hidden border border-white/40 shadow-[inset_0_0_10px_rgba(255,255,255,0.2)] bg-gradient-to-r from-white/5 via-transparent to-white/10 group-hover:from-white/10 group-hover:to-white/20 transition-colors">
                      
                      {/* Cylindrical Glass Reflection overlay */}
                      <div className="absolute inset-y-0 w-[4px] bg-gradient-to-r from-transparent via-white/40 to-transparent left-[4px] pointer-events-none z-10" />

                      {/* Label Layer */}
                      <div 
                        className="w-full h-[65%] flex items-center justify-center relative shadow-[0_2px_10px_rgba(0,0,0,0.1)]" 
                        style={{ backgroundColor: bottle.color }}
                      >
                        {/* Vertical Text */}
                        <span className="text-white font-inter font-bold text-[8px] tracking-[0.2em] -rotate-90 whitespace-nowrap absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] z-20">
                          {bottle.text}
                        </span>
                      </div>
                    </div>
                  </m.div>
                ))}
              </div>
            </div>
          </m.div>

          {/* COLUMN 3: WHY 12 BOTTLES — slides in from LEFT on mobile */}
          <m.div
            initial={{ opacity: 0, x: -40, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
            className="flex flex-col items-center text-center p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 transform origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />

            <h3 className="font-inter text-[18px] font-bold text-white uppercase mb-6 leading-tight">
              YOUR PERSONAL<br />WATER
            </h3>

            <p className="font-inter text-[13px] text-gray-300 leading-loose tracking-wide">
              I EXPLORE thoughtfully<br />
              created contents &amp;<br />
              information to allow a<br />
              more enjoyable life<br />
              experiences.<br /><br />
              I DESERVE ONLY THE<br />
              GREATEST LIFE EXPERIENCES.<br />
              I AM WORTH THE INVESTMENT.
            </p>

            <h3 className="font-inter font-bold text-[16px] text-white uppercase mt-auto mb-4 tracking-widest">
              WHY WE CHOOSE<br />
              12 BOTTLES?
            </h3>

            <p className="font-inter text-[12px] text-gray-400 leading-loose tracking-wide max-w-[200px]">
              12 COMMONLY USED WORDS<br />
              with a profound<br />
              interpretation for<br />
              MENTALPHYSICAL GREATNESS.
            </p>
          </m.div>

          {/* COLUMN 4: INTENTION & INFINITY — slides in from RIGHT on mobile */}
          <m.div
            initial={{ opacity: 0, x: 40, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="flex flex-col items-center text-center p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl relative overflow-hidden group lg:-translate-y-4"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500 transform origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />

            <h3 className="font-inter text-[18px] font-bold text-white uppercase mb-6 leading-tight">
              WHY SET A<br />POSITIVE<br />INTENTION?
            </h3>

            <p className="font-inter text-[13px] text-gray-300 leading-loose tracking-wide">
              Setting a positive intention<br />
              before drinking your<br />
              personal water allows<br />
              you to stay focused on<br />
              <span className="text-white font-bold">GRATITUDE</span> and being<br />
              present in the NOW<br />
              which is all that EXISTS.
            </p>

            <h3 className="font-inter font-bold text-[16px] text-white uppercase mt-auto mb-2 tracking-widest">
              INFINITY SYMBOL
            </h3>
            <p className="font-inter text-[10px] text-white/50 uppercase tracking-widest leading-loose mb-8">
              THE UNLIMITED NATURE<br />OF CONSCIOUSNESS.
            </p>

            <div className="w-full flex items-center justify-center pb-4">
              <svg viewBox="0 0 200 100" className="w-[120px] drop-shadow-[0_0_20px_rgba(94,45,145,0.5)] overflow-visible">
                <defs>
                  <linearGradient id="infinity-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b6aad">
                      <animate attributeName="stop-color" values="#8b6aad;#5e2d91;#8b6aad" dur="4s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="100%" stopColor="#2d1152">
                      <animate attributeName="stop-color" values="#2d1152;#5e2d91;#2d1152" dur="4s" repeatCount="indefinite" />
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

          {/* COLUMN 5: FLOWER OF LIFE — slides in from LEFT on mobile */}
          <m.div
            initial={{ opacity: 0, x: -40, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.25 }}
            className="flex flex-col items-center text-center p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-400 to-emerald-400 transform origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />

            <h3 className="font-inter text-[18px] font-bold text-white uppercase mb-6 leading-tight">
              WHY ULTRA-<br />PURIFIED?
            </h3>

            <p className="font-inter text-[13px] text-gray-300 leading-loose tracking-wide">
              Mainly because it&apos;s free<br />
              from all chemical additives<br />
              to allow a more natural<br />
              connection to life&apos;s beautiful<br />
              experiences.
            </p>

            <h3 className="font-inter font-bold text-[16px] text-white uppercase mt-auto mb-2 tracking-widest">
              THE FLOWER OF LIFE
            </h3>
            <p className="font-inter text-[10px] text-teal-400 uppercase tracking-widest mb-8">
              The connection to everything.
            </p>

            <div className="w-full flex items-center justify-center pb-4">
              <div className="w-[120px]">
                <FlowerOfLife />
              </div>
            </div>
          </m.div>

        </div>
      </div>
    </section>
  );
}
