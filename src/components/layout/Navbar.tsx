"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, m } from "framer-motion";
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
        <m.div
          animate={{
            boxShadow: scrolled
              ? "0 10px 40px rgba(94,45,145,0.08), inset 0 1px 0 rgba(255,255,255,0.6)"
              : "0 2px 20px rgba(94,45,145,0.04), inset 0 1px 0 rgba(255,255,255,0.2)",
            borderColor: scrolled
              ? "rgba(255,255,255,0.4)"
              : "rgba(255,255,255,0.1)",
          }}
          transition={{ duration: 0.4 }}
          className="border-b bg-white/80 backdrop-blur-2xl"
          onMouseLeave={() => setOpenMenu(null)}
        >
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
            {/* Logo */}
            <Link href="/" className="group flex shrink-0 items-center gap-2">
              <WaterDrop />
              <span className="font-cormorant text-[20px] font-medium tracking-[0.15em] shimmer-text">
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
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group relative inline-block font-inter text-[11px] font-medium uppercase tracking-[0.15em] transition-colors hover:text-violet ${textColor}`}
                    >
                      {link.label}
                      <CurvedUnderline />
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className={`group relative inline-block font-inter text-[11px] font-medium uppercase tracking-[0.15em] transition-colors hover:text-violet ${textColor}`}
                    >
                      {link.label}
                      <CurvedUnderline />
                    </Link>
                  )}

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
        </m.div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}

function MegaDropdown({ open, items }: { open: boolean; items: NavLink[] }) {
  return (
    <AnimatePresence>
      {open && (
        <m.div
          initial={{ opacity: 0, y: -10, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.97 }}
          transition={{ duration: 0.2, type: "spring", bounce: 0, stiffness: 200, damping: 20 }}
          className="absolute left-1/2 top-full mt-4 w-64 -translate-x-1/2 rounded-2xl glass-card-light p-4"
        >
          <div className="flex flex-col">
            {items.map((item, i) => (
              <m.div
                key={item.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center overflow-hidden rounded-lg px-3 py-2 font-inter text-[13px] text-body transition-all hover:bg-violet/5 hover:text-violet"
                  >
                    <span className="absolute bottom-0 left-0 top-0 w-[3px] -translate-x-full bg-gradient-brand transition-transform duration-200 group-hover:translate-x-0" />
                    <span className="transition-transform duration-200 group-hover:translate-x-2">
                      {item.label}
                    </span>
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className="group relative flex items-center overflow-hidden rounded-lg px-3 py-2 font-inter text-[13px] text-body transition-all hover:bg-violet/5 hover:text-violet"
                  >
                    <span className="absolute bottom-0 left-0 top-0 w-[3px] -translate-x-full bg-gradient-brand transition-transform duration-200 group-hover:translate-x-0" />
                    <span className="transition-transform duration-200 group-hover:translate-x-2">
                      {item.label}
                    </span>
                  </Link>
                )}
              </m.div>
            ))}
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
