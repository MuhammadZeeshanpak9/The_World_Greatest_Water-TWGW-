"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";

/** Small tracked violet section label with an optional draw-in underline. */
export function SectionLabel({
  children,
  underline = false,
  className = "",
  color = "text-violet",
}: {
  children: ReactNode;
  underline?: boolean;
  className?: string;
  color?: string;
}) {
  return (
    <div className={`inline-flex flex-col items-center gap-2 ${className}`}>
      <span
        className={`font-inter text-[10px] font-semibold uppercase tracking-[0.4em] ${color}`}
      >
        {children}
      </span>
      {underline && (
        <m.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h-px w-16 origin-left bg-gradient-brand"
        />
      )}
    </div>
  );
}

/** Thin gradient divider (violet -> teal). */
export function GradientDivider({
  width = "w-20",
  className = "",
}: {
  width?: string;
  className?: string;
}) {
  return <span className={`block h-px ${width} bg-gradient-brand ${className}`} />;
}

/**
 * ELEV8 logo mark, clipped into a circle (gentle bob loop, same animation
 * as the original hand-drawn drop). The source image is a square crop of
 * the "8 WATER" emblem, centered so it fills the circle cleanly.
 */
export function WaterDrop({
  className = "",
  size = 40,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <m.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <defs>
        <clipPath id="dropClip">
          <circle cx="12" cy="12" r="12" />
        </clipPath>
      </defs>
      <circle cx="12" cy="12" r="12" fill="#ffffff" />
      <image
        href="/logo/elev8-emblem.jpg"
        x="4.5"
        y="4.5"
        width="15"
        height="15"
        preserveAspectRatio="xMidYMid meet"
        clipPath="url(#dropClip)"
      />
    </m.svg>
  );
}

/**
 * Organic curved underline that draws in on hover (stroke-dasharray).
 * Used per nav link. Parent must have `group` + `relative`.
 */
export function CurvedUnderline() {
  return (
    <svg
      className="pointer-events-none absolute -bottom-1 left-0 w-full"
      height="6"
      viewBox="0 0 100 6"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="curveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5e2d91" />
          <stop offset="100%" stopColor="#3dd6cb" />
        </linearGradient>
      </defs>
      <path
        d="M1,4 C25,1 50,6 75,3 C88,1.5 95,3 99,2"
        fill="none"
        stroke="url(#curveGrad)"
        strokeWidth="1.5"
        strokeLinecap="round"
        pathLength={1}
        className="[stroke-dasharray:1] [stroke-dashoffset:1] transition-[stroke-dashoffset] duration-300 ease-out group-hover:[stroke-dashoffset:0]"
      />
    </svg>
  );
}

/** Animated wrapper for icons, floating with a glow. */
export function AnimatedIconWrapper({ children }: { children: ReactNode }) {
  return (
    <m.span 
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-brand text-white shadow-lg shadow-violet/20"
    >
      {children}
    </m.span>
  );
}
