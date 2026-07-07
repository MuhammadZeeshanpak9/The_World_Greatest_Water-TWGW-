"use client";

import { m } from "framer-motion";
import { GradientPlaceholder } from "@/components/ui/MediaWithFallback";

const RETAILERS = ["Retailer One", "Retailer Two", "Retailer Three"];

export default function RetailerCards() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-6 sm:grid-cols-3">
        {RETAILERS.map((name, i) => (
          <m.div
            key={name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="overflow-hidden rounded-[20px] border border-violet/10 p-5"
          >
            <div className="relative h-[140px] overflow-hidden rounded-xl">
              <GradientPlaceholder watermark="Coming Soon" className="rounded-xl" />
            </div>
            <span className="mt-4 inline-block rounded-full bg-violet/10 px-3 py-1 font-inter text-[10px] font-semibold uppercase tracking-[0.2em] text-violet">
              Coming Soon
            </span>
          </m.div>
        ))}
      </div>
    </section>
  );
}
