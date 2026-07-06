import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

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
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto flex max-w-md flex-col items-center px-6 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-violet/10 text-violet">
          <Icon size={28} />
        </span>
        <h2 className="mt-6 font-cormorant text-[36px] text-ink">{heading}</h2>
        <p className="mt-3 font-inter text-base text-body">{description}</p>
        <Link
          href={ctaHref}
          className="group mt-8 inline-flex items-center gap-2 rounded bg-violet px-8 py-3.5 font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-white transition-transform duration-300 hover:scale-[1.02]"
        >
          {ctaLabel}
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
