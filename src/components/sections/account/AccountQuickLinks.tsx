"use client";

import { m } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const QUICK_LINKS = [
  { label: "SHOP NOW", href: "/shop" },
  { label: "SUBSCRIBE", href: "/subscription" },
  { label: "EXPLORE COURSES", href: "/courses" },
];

export default function AccountQuickLinks() {
  return (
    <section className="bg-violet-tint py-24 md:py-32">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-6 sm:grid-cols-3">
        {QUICK_LINKS.map((link, i) => (
          <m.div
            key={link.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
          >
            <Link
              href={link.href}
              className="group flex h-[100px] items-center justify-center gap-2 rounded-[20px] glass-card-light font-inter text-[13px] font-semibold uppercase tracking-[0.2em] text-violet transition-shadow hover:shadow-[0_20px_50px_rgba(107,47,160,0.14)]"
            >
              {link.label}
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </m.div>
        ))}
      </div>
    </section>
  );
}
