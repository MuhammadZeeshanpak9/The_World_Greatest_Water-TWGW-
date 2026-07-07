"use client";

import { m } from "framer-motion";

type PullQuoteProps = {
  quote: string;
  attribution?: string;
  tone?: "light" | "dark";
  className?: string;
};

export default function PullQuote({
  quote,
  attribution,
  tone = "light",
  className = "",
}: PullQuoteProps) {
  const textColor = tone === "dark" ? "text-white" : "text-ink";
  const markColor = tone === "dark" ? "text-white/20" : "text-violet/25";

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative text-center ${className}`}
    >
      <span
        aria-hidden
        className={`pointer-events-none select-none font-cormorant text-[80px] leading-none ${markColor}`}
      >
        &ldquo;
      </span>
      <p className={`mx-auto -mt-6 max-w-2xl font-cormorant text-[28px] italic leading-[1.6] ${textColor}`}>
        {quote}
      </p>
      {attribution && (
        <p className="mt-4 font-inter text-[13px] uppercase tracking-[0.15em] text-violet">
          — {attribution}
        </p>
      )}
    </m.div>
  );
}
