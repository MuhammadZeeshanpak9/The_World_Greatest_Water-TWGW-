"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ANNOUNCEMENTS } from "@/data/content";

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % ANNOUNCEMENTS.length),
      4000,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative z-[60] flex h-9 items-center justify-center overflow-hidden border-b border-white/10 bg-violet">

      <span className="mr-2 inline-block h-1.5 w-1.5 animate-glow-pulse rounded-full bg-violet" />
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.4 }}
          className="font-inter text-[10px] font-medium uppercase tracking-[0.3em] text-white/85"
        >
          {ANNOUNCEMENTS[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
