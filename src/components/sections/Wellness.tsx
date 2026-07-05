"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { WELLNESS_CARDS } from "@/data/content";

const INHALE = "INHALE".split("");
const EXHALE = "EXHALE".split("");

export default function Wellness() {
  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-32">
      {/* faint moving water paths */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {[0, 1, 2].map((i) => (
          <svg
            key={i}
            className="absolute w-[200%]"
            style={{ top: `${20 + i * 28}%`, left: 0 }}
            height="80"
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
          >
            <path
              d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40"
              fill="none"
              stroke="rgba(107,47,160,0.03)"
              strokeWidth="2"
              className="will-change-transform"
              style={{
                animation: `waveFlow ${16 + i * 4}s linear infinite${i % 2 ? " reverse" : ""}`,
              }}
            />
          </svg>
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* INHALE / EXHALE */}
        <div className="flex items-center justify-center gap-4 md:gap-10">
          <h2 className="flex font-cormorant font-light leading-none text-ink text-[20vw] md:text-[15vw]">
            {INHALE.map((c, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                {c}
              </motion.span>
            ))}
          </h2>
          <span className="h-[60px] w-px bg-violet" />
          <h2 className="flex font-cormorant font-light leading-none text-[20vw] md:text-[15vw]">
            {EXHALE.map((c, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="text-gradient-brand"
              >
                {c}
              </motion.span>
            ))}
          </h2>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-center font-cormorant text-2xl italic text-violet/70"
        >
          Reinvent · Renew · Rise
        </motion.p>

        {/* Cards */}
        <div className="mt-16 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {WELLNESS_CARDS.map((card, i) => (
            <motion.div
              key={card.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-[20px] border border-violet/10 bg-white p-6 transition-shadow hover:border-violet/30 hover:shadow-[0_20px_60px_rgba(107,47,160,0.15)]"
            >
              {/* curved wave accent */}
              <svg
                className="absolute inset-x-0 top-0 h-3 w-full"
                viewBox="0 0 100 12"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  d="M0,6 C25,0 40,12 60,6 C75,2 90,10 100,5"
                  fill="none"
                  stroke="#6b2fa0"
                  strokeWidth="3"
                />
              </svg>

              <p className="mt-4 font-inter text-[10px] uppercase tracking-[0.3em] text-muted">
                {card.blurb}
              </p>
              <h3 className="mt-3 font-inter text-[11px] font-semibold uppercase tracking-[0.3em] text-ink">
                {card.name}
              </h3>
              <a
                href="#"
                className="mt-6 flex items-center gap-1 font-inter text-[11px] font-semibold uppercase tracking-[0.15em] text-violet"
              >
                {card.cta}
                <ArrowRight
                  size={13}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
