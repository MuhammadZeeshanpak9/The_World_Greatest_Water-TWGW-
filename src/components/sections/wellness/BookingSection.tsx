"use client";

import { m } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

type BookingSectionProps = {
  heading: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  tone: "standard" | "premium";
  showCalendar: boolean;
  pricingLabel?: string;
  price1yr?: string;
  price2yr?: string;
  pricingNote?: string;
};

export default function BookingSection({
  heading,
  body,
  ctaLabel,
  ctaHref,
  tone,
  showCalendar,
  pricingLabel,
  price1yr,
  price2yr,
  pricingNote,
}: BookingSectionProps) {
  const premium = tone === "premium";

  return (
    <section className="bg-gradient-hero py-24 md:py-32">
      <div className="mx-auto max-w-xl px-6 text-center">
        <m.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`font-cormorant ${
            premium ? "text-[56px] text-gradient-brand md:text-[72px]" : "text-[40px] text-white md:text-[52px]"
          }`}
        >
          {heading}
        </m.h2>
        <p className="mx-auto mt-4 max-w-md font-inter text-base text-white/65">{body}</p>

        {showCalendar && (
          <div className="mx-auto mt-10 max-w-md rounded-2xl border-2 border-dashed border-violet/30 bg-white/5 px-8 py-16 text-center">
            <Calendar size={28} className="mx-auto text-teal" />
            <p className="mt-4 font-inter text-[11px] font-semibold uppercase tracking-[0.3em] text-teal">
              Booking Calendar — Coming Soon
            </p>
          </div>
        )}

        {pricingLabel && price1yr && (
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mt-10 max-w-md"
          >
            <span className="block h-px w-full bg-violet" />
            <div className="py-6">
              <p className="font-inter text-[11px] uppercase tracking-[0.3em] text-violet">
                {pricingLabel}
              </p>
              <p className="mt-3 font-cormorant text-[28px] text-white">{price1yr}</p>
              {price2yr && (
                <p className="mt-2 font-cormorant text-[28px] text-white">{price2yr}</p>
              )}
              {pricingNote && (
                <p className="mt-3 font-inter text-[12px] text-white/50">{pricingNote}</p>
              )}
            </div>
            <span className="block h-px w-full bg-violet" />
          </m.div>
        )}

        <Link
          href={ctaHref}
          className={`group mt-10 inline-flex items-center justify-center gap-2 rounded font-inter font-semibold uppercase tracking-[0.15em] text-white transition-transform duration-300 hover:scale-[1.02] ${
            premium ? "bg-gradient-brand px-10 py-4 text-[13px]" : "bg-violet px-8 py-3.5 text-[12px]"
          }`}
        >
          {ctaLabel}
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
