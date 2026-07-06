"use client";

import { motion } from "framer-motion";
import type { WellnessFeature } from "@/types";

type FeatureGridProps = {
  features: WellnessFeature[];
  tone: "standard" | "premium";
};

export default function FeatureGrid({ features, tone }: FeatureGridProps) {
  const premium = tone === "premium";

  return (
    <section className={`py-24 md:py-32 ${premium ? "bg-dark-violet" : "bg-violet-tint"}`}>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-6 sm:grid-cols-2">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className={`rounded-[20px] border p-8 ${
              premium
                ? "border-white/10 bg-white/5 backdrop-blur-xl"
                : "border-violet/10 bg-white"
            }`}
          >
            <h3
              className={`font-inter text-[13px] font-semibold uppercase tracking-[0.2em] ${
                premium ? "text-white" : "text-ink"
              }`}
            >
              {feature.title}
            </h3>
            <p
              className={`mt-2 font-inter text-[14px] leading-relaxed ${
                premium ? "text-white/65" : "text-body"
              }`}
            >
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
