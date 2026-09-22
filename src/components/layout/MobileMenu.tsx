"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import Link from "next/link";
import { Sparkles, X } from "lucide-react";
import { NAV_LINKS } from "@/data/content";
import { useScrollLock } from "@/lib/hooks";

export default function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  // Close on route change — covers browser back/forward and any navigation
  // that doesn't already call onClose (nav links inside the menu do, via
  // their own onClick, but this is the backstop for everything else).
  useEffect(() => {
    onClose();
    // Only re-run when the pathname itself changes, not when onClose's
    // identity changes (Navbar defines it inline every render).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // This panel is lg:hidden — if it's open and the viewport grows to lg
  // (1024px) or wider (iPad rotation, window resize), the menu visually
  // disappears via CSS but `open` stays true, which would otherwise leave
  // useScrollLock's lock held forever. Close it explicitly when that
  // breakpoint starts matching.
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const handleChange = () => {
      if (mq.matches) onClose();
    };
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useScrollLock(open);

  return (
    <AnimatePresence>
      {open && (
        <m.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-[80] flex flex-col overflow-y-auto overscroll-contain px-6 py-8 backdrop-blur-2xl bg-white/80 lg:hidden"
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
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    className="font-cormorant text-4xl font-light text-ink transition-colors hover:text-violet"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="font-cormorant text-4xl font-light text-ink transition-colors hover:text-violet"
                  >
                    {link.label}
                  </Link>
                )}
              </m.div>
            ))}
            <m.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + NAV_LINKS.length * 0.05 }}
            >
              <Link
                href="/chat"
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-full border border-violet px-4 py-2 font-inter text-[11px] font-medium uppercase tracking-[0.2em] text-violet transition-colors hover:bg-violet hover:text-white"
              >
                <Sparkles size={13} />
                ELEV8 V.A.
              </Link>
            </m.div>
          </nav>
        </m.div>
      )}
    </AnimatePresence>
  );
}
