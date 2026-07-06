"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { SUBSCRIPTION_PLANS } from "@/data/content";

export default function PlanComparison() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-center font-cormorant text-[40px] text-ink md:text-[52px]">
          Choose Your Plan
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2">
          {SUBSCRIPTION_PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="rounded-[24px] border border-violet/10 bg-white p-10 shadow-[0_20px_60px_rgba(107,47,160,0.08)]"
            >
              <span
                className={`inline-block rounded-full px-4 py-1.5 font-inter text-[10px] font-semibold uppercase tracking-[0.25em] ${
                  plan.badgeTone === "teal" ? "bg-teal/15 text-teal" : "bg-violet/10 text-violet"
                }`}
              >
                {plan.badge}
              </span>

              <h3 className="mt-6 font-cormorant text-[28px] text-ink">{plan.name}</h3>

              <div className="mt-3 flex flex-col gap-1">
                <p className="font-inter text-[15px] text-body">
                  16.9 FL OZ — <span className="font-semibold text-violet">{plan.price16oz}</span>
                </p>
                <p className="font-inter text-[15px] text-body">
                  1 LITER — <span className="font-semibold text-violet">{plan.price1L}</span>
                </p>
              </div>

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
                href="/contact"
                className="group mt-8 flex h-[52px] items-center justify-center gap-2 rounded bg-violet font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-white transition-transform duration-300 hover:scale-[1.02]"
              >
                {plan.ctaLabel}
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
