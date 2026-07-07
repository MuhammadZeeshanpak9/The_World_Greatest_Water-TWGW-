"use client";

import { m } from "framer-motion";
import { COURSE_BENEFITS } from "@/data/content";

export default function CourseBenefits() {
  return (
    <section className="bg-gradient-hero py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-center font-cormorant text-[36px] text-white md:text-[48px]">
          Value-Packed. Evergreen. Transformational.
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {COURSE_BENEFITS.map((b, i) => (
            <m.div
              key={b.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="rounded-[20px] glass-card-dark p-8 text-center backdrop-blur-xl"
            >
              <h3 className="font-inter text-[13px] font-semibold uppercase tracking-[0.2em] text-white">
                {b.title}
              </h3>
              <p className="mt-3 font-inter text-[14px] text-white/65">{b.description}</p>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
