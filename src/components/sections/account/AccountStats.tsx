"use client";

import { m } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const STATS = [
  { label: "ORDERS", value: "0 orders", href: "/account/orders" },
  { label: "SUBSCRIPTIONS", value: "0 active", href: "/account/subscriptions" },
  { label: "COURSES", value: "0 enrolled", href: "/account/courses" },
  { label: "ELEV8 POINTS", value: "0 points", href: null },
];

export default function AccountStats() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-cormorant text-[36px] text-ink">Welcome back</h2>

        <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
          {STATS.map((stat, i) => {
            const content = (
              <>
                <p className="font-cormorant text-[32px] text-violet">{stat.value}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-inter text-[11px] font-semibold uppercase tracking-[0.2em] text-ink">
                    {stat.label}
                  </span>
                  {stat.href && (
                    <ArrowRight
                      size={14}
                      className="text-violet opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                    />
                  )}
                </div>
              </>
            );

            return (
              <m.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {stat.href ? (
                  <Link
                    href={stat.href}
                    className="group block rounded-[20px] glass-card-light p-6 transition-shadow hover:shadow-[0_20px_50px_rgba(107,47,160,0.12)]"
                  >
                    {content}
                  </Link>
                ) : (
                  <div className="rounded-[20px] glass-card-light p-6 opacity-70">
                    {content}
                  </div>
                )}
              </m.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
