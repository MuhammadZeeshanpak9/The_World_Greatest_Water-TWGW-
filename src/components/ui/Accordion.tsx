"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/types";

type AccordionProps = {
  items: FaqItem[];
  tone?: "light" | "dark";
};

export default function Accordion({ items, tone = "light" }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dark = tone === "dark";

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div
            key={item.question}
            className={`overflow-hidden rounded-2xl border ${
              dark ? "border-white/10 bg-white/5 backdrop-blur-xl" : "border-violet/10 bg-white"
            }`}
          >
            <button
              onClick={() => setOpenIndex(open ? null : i)}
              className={`flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-inter text-[15px] font-semibold ${
                dark ? "text-white" : "text-ink"
              }`}
            >
              {item.question}
              <motion.span
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="shrink-0 text-violet"
              >
                <ChevronDown size={18} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p
                    className={`px-6 pb-5 font-inter text-[14px] leading-relaxed ${
                      dark ? "text-white/65" : "text-body"
                    }`}
                  >
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
