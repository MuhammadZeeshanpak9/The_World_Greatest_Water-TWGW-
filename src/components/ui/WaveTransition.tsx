"use client";

import { usePrefersReducedMotion } from "@/lib/hooks";

type WaveTransitionProps = {
  fromColor: string; // SVG fill (the section that ends)
  toColor: string; // background behind wave (next section)
  variant?: 1 | 2 | 3 | 4 | 5;
  animated?: boolean;
  flip?: boolean;
  height?: number; // Custom height override
  className?: string;
};

const PATHS: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "M0,60 C360,100 720,20 1440,60 L1440,100 L0,100 Z",
  2: "M0,40 C240,100 480,0 720,50 C960,100 1200,10 1440,40 L1440,100 L0,100 Z",
  3: "M0,80 C180,20 360,100 540,60 C720,20 900,90 1080,50 C1260,10 1380,70 1440,80 L1440,100 L0,100 Z",
  4: "M0,50 C300,10 600,90 900,40 C1200,-10 1350,60 1440,50 L1440,100 L0,100 Z",
  5: "M0,30 C400,120 800,-20 1200,80 C1320,100 1380,50 1440,30 L1440,100 L0,100 Z",
};

/**
 * Organic SVG wave used at every section boundary (never a straight cut).
 * When `animated`, 5 layered paths flow at different speeds/opacities.
 * Negative bottom margin overlaps the next section to kill sub-pixel seams.
 */
export default function WaveTransition({
  fromColor,
  toColor,
  variant = 1,
  animated = false,
  flip = false,
  height,
  className = "",
}: WaveTransitionProps) {
  const d = PATHS[variant];
  const reduced = usePrefersReducedMotion();

  // If user prefers reduced motion, force animated to false
  const isAnimated = animated && !reduced;

  return (
    <div
      className={`relative -mb-[2px] w-full overflow-hidden leading-[0] ${className}`}
      style={{
        backgroundColor: toColor,
        transform: flip ? "scaleX(-1)" : undefined,
      }}
      aria-hidden
    >
      <svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className={!height ? "block h-[60px] w-full sm:h-[80px] md:h-[100px]" : "block w-full"}
        style={height ? { height: `${height}px` } : undefined}
      >
        {isAnimated ? (
          <>
            {/* Layered flowing waves — each path duplicated (200% width) so
                translateX(-50%) loops seamlessly. */}
            <g
              className="will-change-transform"
              style={{ animation: "waveFlow 10s linear infinite", opacity: 0.8 }}
            >
              <path d={d} fill={fromColor} />
              <path d={d} fill={fromColor} transform="translate(1440,0)" />
            </g>
            <g
              className="will-change-transform"
              style={{
                animation: "waveFlow 14s linear infinite reverse",
                opacity: 0.5,
                transform: "translateY(5px)",
              }}
            >
              <path d={PATHS[3]} fill={fromColor} />
              <path d={PATHS[3]} fill={fromColor} transform="translate(1440,0)" />
            </g>
            <g
              className="will-change-transform"
              style={{ 
                animation: "waveFlow 18s linear infinite", 
                opacity: 0.3,
                transform: "translateY(10px)",
              }}
            >
              <path d={PATHS[2]} fill={fromColor} />
              <path d={PATHS[2]} fill={fromColor} transform="translate(1440,0)" />
            </g>
            <g
              className="will-change-transform"
              style={{ 
                animation: "waveFlow 22s linear infinite reverse", 
                opacity: 0.15,
                transform: "translateY(15px)",
              }}
            >
              <path d={PATHS[4]} fill={fromColor} />
              <path d={PATHS[4]} fill={fromColor} transform="translate(1440,0)" />
            </g>
            <g
              className="will-change-transform"
              style={{ 
                animation: "waveFlow 26s linear infinite", 
                opacity: 0.08,
                transform: "translateY(20px)",
              }}
            >
              <path d={PATHS[5]} fill={fromColor} />
              <path d={PATHS[5]} fill={fromColor} transform="translate(1440,0)" />
            </g>
          </>
        ) : (
          <path d={d} fill={fromColor} />
        )}
      </svg>
    </div>
  );
}
