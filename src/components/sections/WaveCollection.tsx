"use client";

import { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import Link from "next/link";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { ImageWithFallback } from "@/components/ui/MediaWithFallback";
import ProductStatusBadge from "@/components/sections/shop/ProductStatusBadge";
import type { ProductStatus } from "@/types";

type WaveCategory = {
  id: string;
  tab: string;
  name: string;
  tagline: string;
  description: string;
  price: string;
  status: ProductStatus;
  cta: string;
  images: string[];
};

const WAVE_COLLECTION: WaveCategory[] = [
  {
    id: "pet-bottles",
    tab: "PET WATER BOTTLES",
    name: "ELEV8 Water Bottles",
    tagline: "1 Water. 12 Understanding.",
    description:
      "Ultra-purified water infused with 528hz binaural frequency. Each bottle represents one of 12 self-development understandings, created with YOU in mind.",
    price: "From $47.77",
    status: "sold-out",
    cta: "NOTIFY ME →",
    images: [
      "/images/products/bottle-1.jpg",
      "/images/products/bottle-2.jpg",
      "/images/products/bottle-3.jpg",
    ],
  },
  {
    id: "essence-pods",
    tab: "ESSENCE PODS",
    name: "ELEV8 Essence Pods",
    tagline: "12 Premium Flavors. Frequency Enhanced.",
    description:
      "Premium flavor enhancement pods for your ELEV8 Water. Citrus Lift, Alpine Mint, Botanical Bloom and more — all frequency enhanced and free from additives.",
    price: "From $47.77",
    status: "coming-soon",
    cta: "NOTIFY ME →",
    images: [
      "/images/products/essence-pods-teal.jpg",
      "/images/products/essence-pods-flavors.jpg",
      "/images/products/essence-pods-citrus.jpg",
    ],
  },
  {
    id: "aluminum-bottles",
    tab: "ALUMINUM BOTTLES",
    name: "ELEV8 Aluminum Bottles",
    tagline: "100% Recyclable. Premium Feel.",
    description:
      "Premium aluminum bottles — sustainable, sleek and built for the elevated lifestyle. The same ultra-purified ELEV8 Water in a bold, eco-conscious format.",
    price: "Coming Soon",
    status: "coming-soon",
    cta: "NOTIFY ME →",
    images: ["/images/products/aluminum-bottle-1.jpg", "/images/products/aluminum-bottle-2.jpg"],
  },
  {
    id: "glass-bottles",
    tab: "GLASS BOTTLES",
    name: "ELEV8 Glass Bottles",
    tagline: "Earth-Friendly. Pure Luxury.",
    description:
      "Premium glass bottles for those who demand the purest experience. Earth-friendly, beautifully designed and filled with the world's greatest ultra-purified water.",
    price: "Coming Soon",
    status: "coming-soon",
    cta: "NOTIFY ME →",
    images: ["/images/products/glass-bottle-1.jpg", "/images/products/glass-bottle-2.jpg"],
  },
  {
    id: "smart-bottle",
    tab: "SMART BOTTLE",
    name: "ELEV8 Smart Bottle",
    tagline: "Real-Time Hydration Tracking.",
    description:
      "The future of hydration. Smart hydration tracking, pH balance monitoring, temperature sensor and Bluetooth connectivity — all in one premium futuristic design.",
    price: "Coming Soon",
    status: "coming-soon",
    cta: "NOTIFY ME →",
    images: ["/images/products/smart-bottle.jpg", "/images/products/smart-bottle-2.jpg"],
  },
  {
    id: "flavor-caps",
    tab: "FLAVOR CAPS",
    name: "ELEV8 Flavor Caps",
    tagline: "Twistable. Flavorful. Elevated.",
    description:
      "12 fruit-inspired twistable flavor caps that transform your ELEV8 Water into a premium flavored hydration experience. Each flavor uniquely crafted for elevation.",
    price: "Coming Soon",
    status: "coming-soon",
    cta: "NOTIFY ME →",
    images: ["/images/products/water-caps-variety.jpg", "/images/products/water-caps-grid.jpg"],
  },
];

export default function WaveCollection() {
  const [activeId, setActiveId] = useState(WAVE_COLLECTION[0].id);
  const reduced = usePrefersReducedMotion();
  const active = WAVE_COLLECTION.find((c) => c.id === activeId) ?? WAVE_COLLECTION[0];

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(107,47,160,0.05), transparent 60%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="text-center">
          <p className="font-inter text-[10px] font-semibold uppercase tracking-[0.5em] text-teal">
            Explore Our World
          </p>
          <h2 className="mt-3 font-cormorant text-[40px] font-bold text-ink md:text-[64px]">
            The Wave Collection
          </h2>
          <p className="mt-3 font-inter text-base text-body">
            Every offering crafted with YOU in mind
          </p>
          <span className="mx-auto mt-5 block h-px w-20 bg-gradient-brand" />
        </div>

        {/* Two-column layout */}
        <div className="mt-16 flex flex-col gap-8 lg:flex-row">
          {/* Left — category tabs */}
          <div
            role="tablist"
            aria-label="Wave Collection categories"
            className="no-scrollbar flex gap-2 overflow-x-auto pb-2 lg:w-[30%] lg:flex-col lg:gap-2 lg:overflow-visible lg:border-r lg:border-violet/10 lg:pb-0 lg:pr-6"
          >
            {WAVE_COLLECTION.map((cat) => {
              const isActive = cat.id === activeId;
              return (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveId(cat.id)}
                  className={`relative flex h-14 shrink-0 items-center justify-between gap-2 whitespace-nowrap rounded-lg px-5 font-inter text-[13px] uppercase tracking-[0.1em] transition-all duration-200 lg:h-16 lg:w-full lg:whitespace-normal ${
                    isActive
                      ? "font-bold text-violet"
                      : "bg-white text-body hover:bg-violet/[0.04] hover:text-violet"
                  }`}
                  style={isActive ? { background: "rgba(107,47,160,0.06)" } : undefined}
                >
                  {isActive && (
                    <m.span
                      layoutId="waveTabIndicator"
                      className="absolute inset-y-0 left-0 hidden w-1 rounded-full bg-violet lg:block"
                      transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span>{cat.tab}</span>
                  {isActive && <span className="hidden shrink-0 text-violet lg:inline">→</span>}
                </button>
              );
            })}
          </div>

          {/* Right — animated product content */}
          <div className="min-w-0 lg:w-[70%]">
            <AnimatePresence mode="wait">
              <m.div
                key={active.id}
                initial={reduced ? { opacity: 0 } : { x: 20, opacity: 0 }}
                animate={{
                  x: 0,
                  opacity: 1,
                  transition: { duration: reduced ? 0.1 : 0.3 },
                }}
                exit={{
                  x: reduced ? 0 : -20,
                  opacity: 0,
                  transition: { duration: reduced ? 0.1 : 0.2 },
                }}
              >
                <div
                  className={`grid grid-cols-2 gap-4 ${
                    active.images.length >= 3 ? "sm:grid-cols-3" : ""
                  }`}
                >
                  {active.images.map((src, i) => (
                    <m.div
                      key={src}
                      whileHover={reduced ? undefined : { y: -4 }}
                      className="flex h-[160px] items-center justify-center overflow-hidden rounded-2xl border border-violet/10 bg-white/80 p-4 backdrop-blur transition-shadow hover:shadow-[0_20px_40px_rgba(107,47,160,0.15)] hover:border-violet/30 md:h-[220px]"
                    >
                      <ImageWithFallback
                        src={undefined}
                        alt={`${active.name} — view ${i + 1}`}
                        watermark={active.name}
                        rounded="rounded-xl"
                        className="object-contain"
                      />
                    </m.div>
                  ))}
                </div>

                <h3 className="mt-8 font-cormorant text-[36px] text-ink">{active.name}</h3>
                <p className="mt-1 font-inter text-[14px] uppercase tracking-[0.1em] text-violet">
                  {active.tagline}
                </p>
                <p className="mt-4 max-w-xl font-inter text-[15px] leading-[1.8] text-body">
                  {active.description}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <p className="font-cormorant text-[28px] text-violet">{active.price}</p>
                  <ProductStatusBadge status={active.status} />
                </div>

                {active.status === "available" ? (
                  <Link
                    href="/shop"
                    className="group mt-8 flex h-[52px] w-fit items-center gap-2 rounded bg-violet px-8 font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-white transition-transform duration-300 hover:scale-[1.02]"
                  >
                    {active.cta}
                  </Link>
                ) : (
                  <button
                    disabled
                    className="mt-8 flex h-[52px] items-center gap-2 rounded bg-violet px-8 font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-white disabled:cursor-not-allowed disabled:bg-muted/40"
                  >
                    {active.cta}
                  </button>
                )}
              </m.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
