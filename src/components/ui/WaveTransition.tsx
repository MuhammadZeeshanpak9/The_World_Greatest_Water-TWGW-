type WaveTransitionProps = {
  fromColor: string; // SVG fill (the section that ends)
  toColor: string; // background behind wave (next section)
  variant?: 1 | 2 | 3;
  animated?: boolean;
  flip?: boolean;
  className?: string;
};

const PATHS: Record<1 | 2 | 3, string> = {
  1: "M0,60 C360,100 720,20 1440,60 L1440,100 L0,100 Z",
  2: "M0,40 C240,100 480,0 720,50 C960,100 1200,10 1440,40 L1440,100 L0,100 Z",
  3: "M0,80 C180,20 360,100 540,60 C720,20 900,90 1080,50 C1260,10 1380,70 1440,80 L1440,100 L0,100 Z",
};

/**
 * Organic SVG wave used at every section boundary (never a straight cut).
 * When `animated`, three layered paths flow at different speeds/opacities.
 * Negative bottom margin overlaps the next section to kill sub-pixel seams.
 */
export default function WaveTransition({
  fromColor,
  toColor,
  variant = 1,
  animated = false,
  flip = false,
  className = "",
}: WaveTransitionProps) {
  const d = PATHS[variant];

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
        className="block h-[60px] w-full sm:h-[80px] md:h-[100px]"
      >
        {animated ? (
          <>
            {/* Layered flowing waves — each path duplicated (200% width) so
                translateX(-50%) loops seamlessly. */}
            <g
              className="will-change-transform"
              style={{ animation: "waveFlow 10s linear infinite", opacity: 0.6 }}
            >
              <path d={d} fill={fromColor} />
              <path d={d} fill={fromColor} transform="translate(1440,0)" />
            </g>
            <g
              className="will-change-transform"
              style={{
                animation: "waveFlow 14s linear infinite reverse",
                opacity: 0.4,
              }}
            >
              <path d={PATHS[3]} fill={fromColor} />
              <path d={PATHS[3]} fill={fromColor} transform="translate(1440,0)" />
            </g>
            <g
              className="will-change-transform"
              style={{ animation: "waveFlow 18s linear infinite", opacity: 0.25 }}
            >
              <path d={PATHS[2]} fill={fromColor} />
              <path d={PATHS[2]} fill={fromColor} transform="translate(1440,0)" />
            </g>
          </>
        ) : (
          <path d={d} fill={fromColor} />
        )}
      </svg>
    </div>
  );
}
