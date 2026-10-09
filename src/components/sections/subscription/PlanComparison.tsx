"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { SUBSCRIPTION_PLANS } from "@/data/content";

export default function PlanComparison() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-center font-cormorant text-[40px] text-ink md:text-[52px] text-glow-violet">
          Choose Your Plan
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2">
          {SUBSCRIPTION_PLANS.map((plan, i) => (
            <m.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="rounded-[24px] glass-card-light p-10 shadow-[0_20px_60px_rgba(107,47,160,0.08)]"
            >
              <h3 className="font-cormorant text-[28px] text-ink">{plan.name}</h3>

              <ul className="mt-6 flex flex-col gap-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet/10 text-violet">
                      <Check size={13} />
                    </span>
                    <span className="font-inter text-[14px] text-body">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/contact?subject=${encodeURIComponent("Subscription inquiry")}`}
                className="group mt-8 flex h-[52px] w-full items-center justify-center gap-2 rounded bg-violet px-8 font-inter text-[12px] font-semibold tracking-[0.15em] text-white uppercase transition-transform duration-300 hover:scale-[1.02]"
              >
                {plan.ctaLabel}
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
