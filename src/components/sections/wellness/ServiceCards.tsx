"use client";

import { m } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { WELLNESS_CARDS } from "@/data/content";

export default function ServiceCards() {
  return (
    <section className="bg-violet-tint py-24 md:py-32">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-6 sm:grid-cols-2">
        {WELLNESS_CARDS.map((card, i) => (
          <m.div
            key={card.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            whileHover={{ y: -8 }}
            className="relative overflow-hidden rounded-[20px] glass-card-light p-8 transition-shadow hover:shadow-[0_20px_60px_rgba(107,47,160,0.15)]"
          >
            <svg
              className="absolute inset-x-0 top-0 h-3 w-full"
              viewBox="0 0 100 12"
              preserveAspectRatio="none"
              aria-hidden
            >
              <path
                d="M0,6 C25,0 40,12 60,6 C75,2 90,10 100,5"
                fill="none"
                stroke="#6b2fa0"
                strokeWidth="3"
              />
            </svg>

            <h3 className="mt-4 font-inter text-[12px] font-semibold uppercase tracking-[0.25em] text-ink">
              {card.name}
            </h3>
            <p className="mt-4 font-cormorant text-[36px] text-violet">
              {card.price}
            </p>
            <p className="mt-2 font-inter text-[14px] leading-relaxed text-body">
              {card.description}
            </p>
            <Link
              href={card.href ?? "/contact"}
              className="group mt-6 inline-flex items-center gap-1 font-inter text-[11px] font-semibold uppercase tracking-[0.15em] text-violet"
            >
              {card.cta === "Enquire" ? "Enquire Now" : "Book Session"}
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </m.div>
        ))}
      </div>
    </section>
  );
}
