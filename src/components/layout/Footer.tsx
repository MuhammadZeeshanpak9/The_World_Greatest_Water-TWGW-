"use client";

import { useState, type FormEvent } from "react";
import { m } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Check } from "lucide-react";
import { FOOTER_COLUMNS, SOCIALS, PAYMENTS, BRAND } from "@/data/content";
import { WaterDrop } from "@/components/ui/primitives";
import { SOCIAL_ICONS, InstagramIcon } from "@/components/ui/SocialIcons";
import { useFormSubmit, isValidEmail, submitWaitlist } from "@/lib/forms";
import { trackLead } from "@/lib/analytics";

function FooterSignupForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const { status, errorMessage, submit } = useFormSubmit({ resetDelayMs: 6000 });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError(undefined);
    submit(async () => {
      await submitWaitlist(email, "footer");
      trackLead("waitlist");
    });
  };

  if (status === "success") {
    return (
      <p className="flex items-center gap-2 font-inter text-[12px] font-semibold tracking-[0.15em] text-teal uppercase">
        <Check size={16} /> You&apos;re on the list
      </p>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="h-11 flex-1 rounded border border-white/15 bg-white/5 px-4 font-inter text-[13px] text-white placeholder:text-white/30 focus:border-violet-mid focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="h-11 shrink-0 rounded bg-violet px-5 font-inter text-[11px] font-semibold tracking-[0.15em] text-white uppercase transition-transform hover:scale-[1.02] disabled:opacity-60"
        >
          {status === "submitting" ? "…" : "Sign Up"}
        </button>
      </form>
      {(error || (status === "error" && errorMessage)) && (
        <p className="mt-2 font-inter text-[11px] text-red-400">{error ?? errorMessage}</p>
      )}
    </div>
  );
}

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
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 flex flex-col items-start justify-between gap-5 border-b border-white/10 pb-14 md:flex-row md:items-center"
        >
          <div>
            <h4 className="font-cormorant text-[22px] text-white">Stay In The Loop</h4>
            <p className="mt-1 font-inter text-[13px] text-white/45">
              New drops, wellness offerings, and updates — straight to your inbox.
            </p>
          </div>
          <FooterSignupForm />
        </m.div>

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
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center font-inter text-[13px] text-white/45 transition-colors hover:text-violet-mid"
                      >
                        <span className="w-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:mr-1 group-hover:w-3 group-hover:opacity-100">
                          →
                        </span>
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="group inline-flex items-center font-inter text-[13px] text-white/45 transition-colors hover:text-violet-mid"
                      >
                        <span className="w-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:mr-1 group-hover:w-3 group-hover:opacity-100">
                          →
                        </span>
                        {link.label}
                      </Link>
                    )}
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
          <p className="mt-6 text-center font-inter text-[10px] uppercase tracking-[0.3em] text-white/25">
            Powered By ELEV8 Incorporation
          </p>
        </div>
      </div>
    </footer>
  );
}
