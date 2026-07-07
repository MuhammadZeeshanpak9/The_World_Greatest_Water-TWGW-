"use client";

import { m } from "framer-motion";
import { Sparkles } from "lucide-react";
import { PROCESS_STEPS } from "@/data/content";
import { SectionLabel, GradientDivider } from "@/components/ui/primitives";

export default function ScientificProcess() {
  return (
    <section className="relative overflow-hidden bg-violet-tint py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <div className="flex justify-center">
          <SectionLabel color="text-violet/60">Curious As To Know More About</SectionLabel>
        </div>
        <h2 className="mx-auto mt-4 max-w-3xl font-cormorant text-[32px] font-semibold leading-tight text-ink md:text-[52px]">
          What Our Scientific Process and Research Entails?
        </h2>
        <div className="mt-6 flex justify-center">
          <GradientDivider width="w-24" />
        </div>
        <p className="mx-auto mt-6 max-w-xl font-inter text-base text-body">
          Every bottle of ELEV8 WATER undergoes the following — aligned to the
          seven centres of understanding.
        </p>

        {/* Steps */}
        <div className="relative mt-16 grid grid-cols-2 gap-y-12 sm:grid-cols-4 lg:grid-cols-7 lg:gap-y-0">
          {/* connecting dotted line (desktop) */}
          <svg
            className="pointer-events-none absolute left-0 top-8 hidden h-6 w-full lg:block"
            viewBox="0 0 1000 20"
            preserveAspectRatio="none"
            aria-hidden
          >
            <m.path
              d="M70,10 C210,-6 300,26 430,10 C560,-6 650,26 780,10 C860,2 900,14 930,10"
              fill="none"
              stroke="#6b2fa0"
              strokeWidth="1.5"
              strokeDasharray="2 6"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
            />
          </svg>

          {PROCESS_STEPS.map((step, i) => (
            <m.div
              key={step.label}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, type: "spring", stiffness: 200, damping: 18 }}
              className="relative z-10 flex flex-col items-center"
            >
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg"
                style={{ color: step.color, boxShadow: `0 8px 24px ${step.color}33` }}
              >
                <Sparkles size={22} />
              </div>
              <span className="mt-4 font-inter text-[11px] font-semibold uppercase tracking-[0.15em] text-ink">
                {step.label}
              </span>
              <span className="mt-1 font-inter text-[9px] uppercase tracking-[0.2em] text-muted">
                {step.chakra}
              </span>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
