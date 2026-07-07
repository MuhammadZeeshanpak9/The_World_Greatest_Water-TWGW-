"use client";

import { m } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { FOOTER_COLUMNS, SOCIALS, PAYMENTS, BRAND } from "@/data/content";
import { WaterDrop } from "@/components/ui/primitives";
import { SOCIAL_ICONS, InstagramIcon } from "@/components/ui/SocialIcons";

const FooterParticles = dynamic(() => import("@/components/background/FooterParticles"), {
  ssr: false,
});

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-dark-base pt-16 pb-8">
      <FooterParticles />
      {/* top gradient divider */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg,#5e2d91 0%,#3dd6cb 50%,#5e2d91 100%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {/* Brand column */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="col-span-2 md:col-span-1"
          >
            <div className="flex items-center gap-2">
              <WaterDrop />
              <span className="font-cormorant text-[22px] text-white">
                {BRAND.name}
              </span>
            </div>
            <p className="mt-2 font-inter text-[11px] uppercase tracking-[0.25em] text-teal">
              {BRAND.short}
            </p>
            <p className="mt-4 max-w-xs font-inter text-[13px] leading-[1.7] text-white/45">
              Ultra-purified water infused with 528hz. One water, twelve
              understandings — created to elevate your life.
            </p>

            <div className="mt-6 flex gap-3">
              {SOCIALS.map((s) => {
                const Icon = SOCIAL_ICONS[s.name] ?? InstagramIcon;
                return (
                  <a
                    key={s.name}
                    href={s.href}
                    aria-label={s.name}
                    className="group relative flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all hover:border-transparent hover:text-white"
                  >
                    <span 
                      className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{ 
                        boxShadow: `0 0 15px ${s.glow}, inset 0 0 10px ${s.glow}`,
                        border: `1px solid ${s.glow}`,
                      }} 
                    />
                    <Icon size={15} className="relative z-10" />
                  </a>
                );
              })}
            </div>
          </m.div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map((col, ci) => (
            <m.div
              key={col.heading}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + ci * 0.1 }}
            >
              <h4 className="font-inter text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                {col.heading}
              </h4>
              <ul className="mt-5 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center font-inter text-[13px] text-white/45 transition-colors hover:text-violet-mid"
                    >
                      <span className="w-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:mr-1 group-hover:w-3 group-hover:opacity-100">
                        →
                      </span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </m.div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="relative z-10 mt-14">
          <div
            className="h-px w-full"
            style={{
              background: "linear-gradient(90deg, transparent, #5e2d91, #3dd6cb, #5e2d91, transparent)",
              backgroundSize: "200% auto",
              animation: "gradientShift 4s ease infinite",
              opacity: 0.5,
            }}
          />
          <div className="mt-6 flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="font-inter text-[12px] text-white/30">
              © 2026 {BRAND.name}. All Rights Reserved.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {PAYMENTS.map((p) => (
                <span
                  key={p}
                  className="font-inter text-[9px] uppercase tracking-[0.1em] text-white/25 transition-opacity hover:text-white/60"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
