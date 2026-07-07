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
  children,
}: PageHeroProps) {
  const dark = variant === "dark";

  return (
    <section
      className={`relative overflow-hidden pt-40 pb-20 md:pt-48 md:pb-28 ${
        dark ? "bg-gradient-hero" : "bg-violet-tint"
      }`}
    >
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
