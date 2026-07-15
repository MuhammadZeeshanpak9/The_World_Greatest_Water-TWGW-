"use client";

import { useRef } from "react";
import type { SVGProps } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import { PROCESS_STEPS } from "@/data/content";
import { SectionLabel, GradientDivider } from "@/components/ui/primitives";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const OriginalIcons = {
  LOVE: ({ size = 24, className = "", ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="currentColor" className={className} {...props}>
      <path d="M50 85 C20 60 10 40 10 25 C10 10 25 5 35 15 C45 25 50 30 50 30 C50 30 55 25 65 15 C75 5 90 10 90 25 C90 40 80 60 50 85 Z" />
    </svg>
  ),
  MICRON: ({ size = 24, className = "", ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M40 20 L60 15 L60 65 L40 70 Z" />
      <path d="M60 15 L70 20 L70 70 L60 65" />
      <path d="M45 23 L55 20 M45 35 L55 32 M45 47 L55 44 M45 59 L55 56" strokeWidth="2" />
      <path d="M70 30 Q 80 20 90 30" />
      <path d="M90 30 L85 25 M90 30 L85 35" />
      <path d="M70 50 Q 80 40 90 50" />
      <path d="M90 50 L85 45 M90 50 L85 55" />
      <path d="M70 70 Q 80 60 90 70" />
      <path d="M90 70 L85 65 M90 70 L85 75" />
      <circle cx="20" cy="30" r="3" fill="currentColor" stroke="none" />
      <circle cx="15" cy="45" r="4" fill="currentColor" stroke="none" />
      <circle cx="25" cy="65" r="3" fill="currentColor" stroke="none" />
      <circle cx="12" cy="70" r="2" fill="currentColor" stroke="none" />
      <path d="M12 28 L14 30 M28 45 L30 43 M20 60 L22 62" strokeWidth="2" />
    </svg>
  ),
  OSMOSIS: ({ size = 24, className = "", ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <rect x="15" y="30" width="40" height="10" rx="5" />
      <rect x="15" y="50" width="40" height="10" rx="5" />
      <rect x="15" y="70" width="40" height="10" rx="5" />
      <path d="M35 30 V20 H70" />
      <path d="M35 40 V50" />
      <path d="M35 60 V70" />
      <rect x="65" y="25" width="20" height="55" rx="10" />
      <path d="M65 40 H85 M65 65 H85" strokeWidth="2" />
    </svg>
  ),
  DEIONIZATION: ({ size = 24, className = "", ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <rect x="25" y="25" width="50" height="50" rx="4" />
      <path d="M25 65 Q 37.5 55 50 65 T 75 65 V71 A4 4 0 0 1 71 75 H29 A4 4 0 0 1 25 71 Z" fill="currentColor" stroke="none" opacity="0.2"/>
      <path d="M25 65 Q 37.5 55 50 65 T 75 65" strokeWidth="3" />
      <path d="M35 55 V35" strokeDasharray="4 4" />
      <path d="M50 50 V30" strokeDasharray="4 4" />
      <path d="M65 55 V35" strokeDasharray="4 4" />
      <path d="M30 40 L35 35 L40 40" />
      <path d="M45 35 L50 30 L55 35" />
      <path d="M60 40 L65 35 L70 40" />
      <circle cx="35" cy="20" r="2" fill="currentColor" stroke="none" />
      <circle cx="50" cy="15" r="2" fill="currentColor" stroke="none" />
      <circle cx="65" cy="20" r="2" fill="currentColor" stroke="none" />
    </svg>
  ),
  ULTRAVIOLET: ({ size = 24, className = "", ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <circle cx="50" cy="40" r="16" />
      <text x="50" y="46" fontSize="16" fontWeight="900" textAnchor="middle" fill="currentColor" stroke="none">UV</text>
      <path d="M50 12 V18 M50 62 V68" strokeWidth="5" />
      <path d="M22 40 H28 M72 40 H78" strokeWidth="5" />
      <path d="M30 20 L35 25 M65 55 L70 60" strokeWidth="5" />
      <path d="M70 20 L65 25 M30 60 L35 55" strokeWidth="5" />
      <path d="M35 60 V90" strokeDasharray="4 4" />
      <path d="M50 70 V90" strokeDasharray="4 4" />
      <path d="M65 60 V90" strokeDasharray="4 4" />
    </svg>
  ),
  OZONATION: ({ size = 24, className = "", ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M35 65 A 12 12 0 0 1 35 41 A 18 18 0 0 1 65 41 A 12 12 0 0 1 65 65 Z" />
      <text x="50" y="58" fontSize="20" fontWeight="900" textAnchor="middle" fill="currentColor" stroke="none">O<tspan dy="3" fontSize="12">3</tspan></text>
      <circle cx="20" cy="30" r="4" />
      <circle cx="85" cy="45" r="3" />
      <circle cx="75" cy="25" r="2" fill="currentColor" stroke="none" />
      <circle cx="30" cy="75" r="2" fill="currentColor" stroke="none" />
      <path d="M15 75 L25 85 M25 75 L15 85" strokeWidth="3" />
      <path d="M80 75 L90 85 M90 75 L80 85" strokeWidth="3" />
    </svg>
  ),
  GRATITUDE: ({ size = 24, className = "", ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="currentColor" className={className} {...props}>
      <path d="M15 80 C15 70 20 50 35 40 C45 30 50 40 50 45 C50 55 45 60 40 60 C35 60 30 70 30 80 Z" />
      <path d="M85 80 C85 70 80 50 65 40 C55 30 50 40 50 45 C50 55 55 60 60 60 C65 60 70 70 70 80 Z" />
    </svg>
  )
};

const getIcon = (label: string) => {
  if (label.includes("LOVE")) return OriginalIcons.LOVE;
  if (label.includes("MICRON")) return OriginalIcons.MICRON;
  if (label.includes("OSMOSIS")) return OriginalIcons.OSMOSIS;
  if (label.includes("DEIONIZATION")) return OriginalIcons.DEIONIZATION;
  if (label.includes("ULTRAVIOLET")) return OriginalIcons.ULTRAVIOLET;
  if (label.includes("OZONATION")) return OriginalIcons.OZONATION;
  if (label.includes("GRATITUDE")) return OriginalIcons.GRATITUDE;
  return OriginalIcons.LOVE;
};

export default function ScientificProcess() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"]
  });

  // A drawing progress that drives the continuous interlocking wave
  const pathLength = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  return (
    <section 
      ref={containerRef}
      className="relative overflow-hidden bg-violet-tint py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 text-center">
        <div className="flex justify-center">
          <SectionLabel color="text-violet/60">Curious As To Know More About</SectionLabel>
        </div>
        <h2 className="mx-auto mt-4 max-w-3xl font-cormorant text-[32px] font-semibold leading-tight text-ink md:text-[52px]">
          What Our Scientific Process and Research Entails?
        </h2>
        <div className="mt-6 flex justify-center">
          <GradientDivider width="w-24" />
        </div>
        <p className="mx-auto mt-6 max-w-xl font-inter text-base text-body">
          Every bottle of ELEV8 WATER undergoes the following — aligned to the
          seven centres of understanding.
        </p>

        {/* Steps Container */}
        <div className="relative mt-24">
          
          {/* Continuous Interlocking Wave Background (Desktop) */}
          <div className="absolute top-8 left-0 right-0 hidden h-32 lg:block" aria-hidden>
            <svg 
              className="h-full w-full" 
              viewBox="0 0 1400 120" 
              preserveAspectRatio="xMidYMid meet"
            >
              {/* 
                We draw an interlocking wave pattern.
                It loops around 7 centers.
              */}
              <m.path
                d="M 100,60 
                   C 100,10 180,10 200,60 
                   C 220,110 280,110 300,60 
                   C 320,10 380,10 400,60 
                   C 420,110 480,110 500,60 
                   C 520,10 580,10 600,60 
                   C 620,110 680,110 700,60 
                   C 720,10 780,10 800,60 
                   C 820,110 880,110 900,60 
                   C 920,10 980,10 1000,60 
                   C 1020,110 1080,110 1100,60 
                   C 1120,10 1180,10 1200,60 
                   C 1220,110 1300,110 1300,60"
                fill="none"
                stroke="url(#gradient-wave)"
                strokeWidth="12"
                strokeLinecap="round"
                style={{ pathLength }}
                className="opacity-40 drop-shadow-xl"
              />
              <defs>
                <linearGradient id="gradient-wave" x1="0%" y1="0%" x2="100%" y2="0%">
                  {PROCESS_STEPS.map((step, i) => (
                    <stop 
                      key={i} 
                      offset={`${(i / (PROCESS_STEPS.length - 1)) * 100}%`} 
                      stopColor={step.color} 
                    />
                  ))}
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="relative z-10 grid grid-cols-1 gap-y-16 sm:grid-cols-2 lg:grid-cols-7 lg:gap-y-0">
            {PROCESS_STEPS.map((step, i) => {
              const IconComponent = getIcon(step.label);
              // Shift odd elements slightly up and even elements slightly down to match the wave curve
              const yOffset = i % 2 === 0 ? -12 : 12;

              return (
                <m.div
                  key={step.label}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: i * 0.15, type: "spring", stiffness: 100, damping: 20 }}
                  className="flex flex-col items-center"
                >
                  <m.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white transition-shadow duration-500 lg:h-28 lg:w-28"
                    style={{ 
                      color: step.color, 
                      boxShadow: `0 10px 30px ${step.color}44`,
                      border: `4px solid ${step.color}22`,
                      transform: `translateY(${yOffset}px)`
                    }}
                  >
                    {/* Ring glow behind icon */}
                    <div 
                      className="absolute inset-0 rounded-full opacity-20 blur-md"
                      style={{ backgroundColor: step.color }}
                    />
                    <IconComponent size={36} strokeWidth={1.5} className="relative z-10" />
                  </m.div>

                  <div 
                    className="mt-8 flex flex-col items-center lg:mt-12"
                    style={{ transform: `translateY(${yOffset}px)` }}
                  >
                    <span 
                      className="text-center font-inter text-[12px] font-bold uppercase tracking-[0.15em]"
                      style={{ color: step.color }}
                    >
                      {step.label}
                    </span>
                    <p className="mx-auto mt-3 max-w-[150px] text-center font-inter text-[11px] leading-relaxed text-muted">
                      {step.description}
                    </p>
                  </div>
                </m.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
