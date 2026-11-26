import type { ReactNode } from "react";
import SectionParticles from "@/components/sections/SectionParticles";
import YouTubeEmbed from "@/components/ui/YouTubeEmbed";

type PageHeroProps = {
  variant: "dark" | "light";
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description?: string;
  youtube?: { url: string; title?: string };
  titleClassName?: string;
  /** Looping video background scoped to this section only (absolute, not
   * fixed — it scrolls away with the section). When set, overrides the flat
   * `bg-gradient-hero` fill with a cinematic dark gradient for legibility. */
  backgroundVideo?: string;
  children?: ReactNode;
};

export default function PageHero({
  variant,
  eyebrow,
  title,
  subtitle,
  description,
  youtube,
  titleClassName,
  backgroundVideo,
  children,
}: PageHeroProps) {
  const dark = variant === "dark";

  return (
    <section
      className={`relative overflow-hidden ${
        backgroundVideo
          ? "flex min-h-[80vh] flex-col justify-end pb-16 pt-40 md:pb-20"
          : "pt-40 pb-20 md:pt-48 md:pb-28"
      } ${dark && !backgroundVideo ? "bg-gradient-hero" : ""} ${
        !dark ? "bg-violet-tint" : ""
      }`}
    >
      {backgroundVideo && (
        <>
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            src={backgroundVideo}
            aria-hidden
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, #060608 0%, #060608 18%, rgba(6,6,8,0.6) 55%, rgba(6,6,8,0.15) 100%)",
            }}
            aria-hidden
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 30%, rgba(6,6,8,0.65) 100%)",
            }}
            aria-hidden
          />
          {/* Softens the hard cut into the next section: a blurred fade plus
              a curved (not straight) edge shape. */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 backdrop-blur-xl md:h-40"
            style={{
              background: "linear-gradient(to top, #060608 0%, transparent 100%)",
              maskImage: "linear-gradient(to top, black 0%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 100%)",
            }}
            aria-hidden
          />
          <svg
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 w-full md:h-28"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path d="M0,40 C360,120 1080,0 1440,60 L1440,120 L0,120 Z" fill="#060608" />
          </svg>
        </>
      )}
      {dark && <SectionParticles count={30} />}

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        {eyebrow && (
          <p
            className={`font-inter text-[10px] font-semibold uppercase tracking-[0.4em] ${
              dark ? "text-teal" : "text-violet"
            }`}
          >
            {eyebrow}
          </p>
        )}

        <h1
          className={`mt-3 font-cormorant font-bold leading-[0.95] ${
            titleClassName ?? "text-[52px] md:text-[80px]"
          } ${dark ? "text-white" : "text-ink"}`}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            className={`mt-4 font-inter text-[11px] font-semibold uppercase tracking-[0.35em] ${
              dark ? "text-teal" : "text-violet"
            }`}
          >
            {subtitle}
          </p>
        )}

        {description && (
          <p
            className={`mx-auto mt-5 max-w-xl font-inter text-base leading-relaxed ${
              dark ? "text-white/65" : "text-body"
            }`}
          >
            {description}
          </p>
        )}

        {youtube && (
          <div className="mx-auto mt-10 max-w-2xl">
            <YouTubeEmbed url={youtube.url} title={youtube.title} />
          </div>
        )}

        {children}
      </div>
    </section>
  );
}
