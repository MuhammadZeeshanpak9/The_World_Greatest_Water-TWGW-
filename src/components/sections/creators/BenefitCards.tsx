"use client";

import { m } from "framer-motion";
import { Percent, TrendingUp, Users } from "lucide-react";

const BENEFITS = [
  { icon: Percent, name: "Earn Commission", text: "Become an affiliate" },
  { icon: TrendingUp, name: "Grow Your Brand", text: "Partner with ELEV8" },
  { icon: Users, name: "ELEV8 Together", text: "Community mission" },
];

export default function BenefitCards() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-6 sm:grid-cols-3">
        {BENEFITS.map((b, i) => (
          <m.div
            key={b.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="flex flex-col items-center rounded-[20px] border border-violet/10 p-8 text-center"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-violet/10 text-violet">
              <b.icon size={26} />
            </span>
            <h3 className="mt-6 font-inter text-[13px] font-semibold uppercase tracking-[0.2em] text-ink">
              {b.name}
            </h3>
            <p className="mt-2 font-inter text-[14px] text-body">{b.text}</p>
          </m.div>
        ))}
      </div>
    </section>
  );
}
