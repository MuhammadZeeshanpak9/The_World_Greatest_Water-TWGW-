"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GIFT_TIERS } from "@/data/content";

export default function GiftTiers() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h2 className="font-cormorant text-[40px] text-ink md:text-[52px]">
          Gift THE WORLD&apos;S GREATEST WATER
        </h2>
        <p className="mx-auto mt-4 max-w-xl font-inter text-base text-body">
          Give someone you love the experience of ultra-purified consciousness water
        </p>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {GIFT_TIERS.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="flex flex-col items-center rounded-[20px] border-2 border-violet/20 bg-white p-8 text-center"
            >
              <p className="font-cormorant text-[48px] text-violet">{tier.price}</p>
              <h3 className="mt-2 font-inter text-[13px] font-semibold uppercase tracking-[0.2em] text-ink">
                {tier.name}
              </h3>
              <p className="mt-3 font-inter text-[14px] text-body">{tier.description}</p>

              <Link
                href="/contact"
                className="group mt-6 inline-flex items-center gap-2 rounded border border-violet px-6 py-3 font-inter text-[11px] font-semibold uppercase tracking-[0.15em] text-violet transition-colors hover:bg-violet hover:text-white"
              >
                Select
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
