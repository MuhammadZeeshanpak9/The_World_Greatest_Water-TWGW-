"use client";

import { AnimatePresence, m } from "framer-motion";
import Link from "next/link";
import { X } from "lucide-react";
import { NAV_LINKS } from "@/data/content";

export default function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <m.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-[80] flex flex-col overflow-y-auto px-6 py-8 backdrop-blur-2xl bg-white/80 lg:hidden"
        >
          <div className="flex items-center justify-between">
            <span className="font-cormorant text-lg tracking-[0.15em] text-violet">
              ELEV8
            </span>
            <button
              aria-label="Close menu"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-violet/15 text-ink transition-colors hover:bg-violet/5"
            >
              <X size={22} />
            </button>
          </div>

          <nav className="mt-10 flex flex-col gap-5">
            {NAV_LINKS.map((link, i) => (
              <m.div
                key={link.label}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="font-cormorant text-4xl font-light text-ink transition-colors hover:text-violet"
                >
                  {link.label}
                </Link>
              </m.div>
            ))}
          </nav>
        </m.div>
      )}
    </AnimatePresence>
  );
}
