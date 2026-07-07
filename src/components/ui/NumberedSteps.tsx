"use client";

import { m } from "framer-motion";
import type { TitledItem } from "@/types";

type NumberedStepsProps = {
  heading: string;
  steps: TitledItem[];
};

export default function NumberedSteps({ heading, steps }: NumberedStepsProps) {
  return (
    <section className="bg-violet-tint py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h2 className="font-cormorant text-[36px] text-ink md:text-[48px]">{heading}</h2>

        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3">
          {steps.map((step, i) => (
            <m.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="flex flex-col items-center"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-violet font-inter text-[15px] font-semibold text-white">
                {i + 1}
              </span>
              <h3 className="mt-4 font-inter text-[13px] font-semibold uppercase tracking-[0.2em] text-ink">
                {step.title}
              </h3>
              <p className="mt-2 max-w-[220px] font-inter text-[14px] text-body">
                {step.description}
              </p>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
