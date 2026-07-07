import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { AnimatedIconWrapper } from "@/components/ui/primitives";

type EmptyStateProps = {
  icon: LucideIcon;
  heading: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
};

export default function EmptyState({
  icon: Icon,
  heading,
  description,
  ctaLabel,
  ctaHref,
}: EmptyStateProps) {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-pale z-0" />
      <div className="mx-auto flex max-w-md flex-col items-center px-8 py-10 text-center relative z-10 rounded-3xl glass-card-light">
        <AnimatedIconWrapper>
          <Icon size={32} />
        </AnimatedIconWrapper>
        <h2 className="mt-6 font-cormorant text-[36px] text-ink">{heading}</h2>
        <p className="mt-3 font-inter text-base text-body">{description}</p>
        <Link
          href={ctaHref}
          className="group mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-8 py-3.5 font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-white btn-glow"
        >
          {ctaLabel}
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
