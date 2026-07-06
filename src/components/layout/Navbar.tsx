"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import { NAV_LINKS } from "@/data/content";
import { useScrollPosition } from "@/lib/hooks";
import { CurvedUnderline, WaterDrop } from "@/components/ui/primitives";
import AnnouncementBar from "./AnnouncementBar";
import MobileMenu from "./MobileMenu";
import type { NavLink } from "@/types";

export default function Navbar() {
  const scrollY = useScrollPosition();
  const scrolled = scrollY > 80;
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Hero is a white section (not dark), so nav text stays dark at all scroll depths.
  const textColor = "text-ink";
  const iconColor = "text-ink";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[70]">
        <AnnouncementBar />
        <motion.div
          animate={{
            boxShadow: scrolled
              ? "0 4px 30px rgba(107,47,160,0.1)"
              : "0 2px 20px rgba(107,47,160,0.06)",
            borderColor: scrolled
              ? "rgba(107,47,160,0.15)"
              : "rgba(107,47,160,0.1)",
          }}
          transition={{ duration: 0.4 }}
          // Solid (non-transparent) at all scroll depths so hero media never
          // bleeds through and visually clashes with nav content.
          className="border-b bg-white backdrop-blur-xl"
          onMouseLeave={() => setOpenMenu(null)}
        >
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
            {/* Logo */}
            <Link href="/" className="group flex shrink-0 items-center gap-2">
              <WaterDrop />
              <span className="font-cormorant text-[20px] font-medium tracking-[0.15em] text-violet transition-colors group-hover:shimmer-text">
                ELEV8 WATER
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-6 lg:flex">
              {NAV_LINKS.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() =>
                    setOpenMenu(link.children ? link.label : null)
                  }
                >
                  <Link
                    href={link.href}
                    className={`group relative inline-block font-inter text-[11px] font-medium uppercase tracking-[0.15em] transition-colors hover:text-violet ${textColor}`}
                  >
                    {link.label}
                    <CurvedUnderline />
                  </Link>

                  {link.children && (
                    <MegaDropdown
                      open={openMenu === link.label}
                      items={link.children}
                    />
                  )}
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-4">
              <Link href="/account" aria-label="Account" className={`hidden sm:block ${iconColor}`}>
                <User size={18} />
              </Link>
              <button aria-label="Search" className={`hidden sm:block ${iconColor}`}>
                <Search size={18} />
              </button>
              <Link href="/cart" aria-label="Cart" className={`relative ${iconColor}`}>
                <ShoppingBag size={18} />
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-violet text-[9px] font-semibold text-white">
                  0
                </span>
              </Link>
              <button
                aria-label="Open menu"
                onClick={() => setMobileOpen(true)}
                className={`lg:hidden ${iconColor}`}
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </motion.div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}

function MegaDropdown({ open, items }: { open: boolean; items: NavLink[] }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.97 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="absolute left-1/2 top-full mt-4 w-64 -translate-x-1/2 rounded-2xl border p-4"
          style={{
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(30px)",
            borderColor: "rgba(107,47,160,0.12)",
            boxShadow:
              "0 20px 60px rgba(107,47,160,0.12), 0 4px 16px rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex flex-col">
            {items.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg border-l-2 border-transparent px-3 py-2 font-inter text-[13px] text-body transition-all hover:border-violet hover:bg-violet/5 hover:text-violet"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className="block rounded-lg border-l-2 border-transparent px-3 py-2 font-inter text-[13px] text-body transition-all hover:border-violet hover:bg-violet/5 hover:text-violet"
                  >
                    {item.label}
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
