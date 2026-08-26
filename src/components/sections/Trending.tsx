"use client";

import { m } from "framer-motion";
import { Play } from "lucide-react";
import { TRENDING_CIRCLES, VIDEO_CARDS } from "@/data/content";
import { GradientPlaceholder } from "@/components/ui/MediaWithFallback";
import { SOCIAL_ICONS, InstagramIcon } from "@/components/ui/SocialIcons";
import SectionParticles from "./SectionParticles";

const INSTAGRAM_URL = "https://www.instagram.com/theworldsgreatestwater";

export default function Trending() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero py-24 md:py-32">
      <SectionParticles count={30} />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center">
          <h2 className="font-cormorant text-[36px] font-semibold text-white md:text-[56px]">
            TRENDING
          </h2>
          <m.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-3 block h-[2px] w-24 origin-left bg-gradient-brand"
          />
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2 font-inter text-[11px] font-semibold uppercase tracking-[0.15em] text-white/85 transition-colors hover:bg-white/10"
          >
            <InstagramIcon size={14} />
            Follow @theworldsgreatestwater
          </a>
        </div>

        {/* Social platform circles */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-8">
          {TRENDING_CIRCLES.map((c, i) => {
            const Icon = SOCIAL_ICONS[c.platform] ?? InstagramIcon;
            return (
              <m.a
                key={c.platform}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit our ${c.label} page`}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.06 }}
                className="group flex flex-col items-center gap-3"
              >
                <div
                  className="rounded-full p-[2px] will-change-transform group-hover:animate-spin-slow"
                  style={{ background: "linear-gradient(135deg,#6b2fa0,#4ecdc4)" }}
                >
                  <div className="flex h-[110px] w-[110px] items-center justify-center overflow-hidden rounded-full border-2 border-dark-base bg-dark-violet text-white transition-colors group-hover:text-teal">
                    <Icon size={38} />
                  </div>
                </div>
                <span className="font-inter text-[11px] font-semibold uppercase tracking-[0.15em] text-white/70 transition-colors group-hover:text-white">
                  {c.label}
                </span>
              </m.a>
            );
          })}
        </div>

        {/* YouTube video cards */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {VIDEO_CARDS.map((v, i) => (
            <m.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="overflow-hidden rounded-[20px] p-4 glass-card-dark"
            >
              <div className="relative flex h-[240px] items-center justify-center overflow-hidden rounded-xl">
                <GradientPlaceholder className="rounded-xl" />
                <button
                  aria-label={`Play ${v.title}`}
                  className="group absolute flex h-16 w-16 items-center justify-center rounded-full bg-gradient-brand text-white shadow-lg btn-glow transition-transform hover:scale-110"
                >
                  <Play size={22} className="ml-1 fill-white" />
                </button>
              </div>
              <p className="mt-4 font-inter text-[15px] font-medium text-white/85">
                {v.title}
              </p>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
