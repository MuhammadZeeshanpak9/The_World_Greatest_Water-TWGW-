"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import Link from "next/link";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { ImageWithFallback } from "@/components/ui/MediaWithFallback";
import NotifyMeForm from "@/components/ui/NotifyMeForm";
import ProductStatusBadge from "@/components/sections/shop/ProductStatusBadge";
import type { ProductStatus } from "@/types";

// Maps a Wave Collection category to the real `products.category` value it corresponds to.
// Categories with no entry here have no live product yet — they keep their static status.
const CATEGORY_MATCH: Record<string, string> = {
  "pet-bottles": "Water Bottles",
  "essence-pods": "Essence Pods",
};

type WaveVariant = {
  /** One of the 12 Understandings (e.g. "ALL", "YOU") this variant represents. */
  name: string;
  /** Flavor label shown alongside the Understanding (e.g. "Lavender"). */
  flavor: string;
  /** Short blurb for this specific Understanding (from the source flier art). */
  description: string;
  /** Studio/product shot, used as the variant's card thumbnail. */
  image: string;
};

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
  /** When set, renders a named/described grid of all 12 Understanding
   * variants instead of the plain `images` thumbnail grid. */
  variants?: WaveVariant[];
};

// Kept in alphabetical order by `tab` — add new categories in their alphabetical slot.
const WAVE_COLLECTION: WaveCategory[] = [
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
    images: ["", ""],
  },
  {
    id: "elev8ated-ice",
    tab: "ELEV8ATED ICE",
    name: "ELEV8ATED Ice",
    tagline: "1 Water. 12 Understandings.",
    description:
      "The same ultra-purified, 528hz frequency-infused ELEV8 Water, frozen into premium flavored ice cubes — one for each of the 12 self-development understandings.",
    price: "Coming Soon",
    status: "coming-soon",
    cta: "NOTIFY ME →",
    images: ["", ""],
    variants: [
      {
        name: "ALL",
        flavor: "Lavender",
        description: "Everyone without exception. The grand design.",
        image: "/images/elev8ated-ice/all-lavender-product.png",
      },
      {
        name: "YOU",
        flavor: "Blueberry",
        description: "The experiencer of the experience called life. I am You.",
        image: "/images/elev8ated-ice/you-blueberry-product.png",
      },
      {
        name: "DESIRE",
        flavor: "Orange",
        description: "The feeling that creates the will to move towards an experience in life.",
        image: "/images/elev8ated-ice/desire-orange-product.png",
      },
      {
        name: "ENERGY",
        flavor: "Coconut",
        description: "The source of the design.",
        image: "/images/elev8ated-ice/energy-coconut-product.png",
      },
      {
        name: "BELIEVE",
        flavor: "Lemon",
        description: "Trust in the unknown.",
        image: "/images/elev8ated-ice/believe-lemon-product.png",
      },
      {
        name: "GRATITUDE",
        flavor: "Cucumber Mint",
        description: "The feeling of connection to an undefined source of love.",
        image: "/images/elev8ated-ice/gratitude-cucumber-mint-product.png",
      },
      {
        name: "FREQUENCY",
        flavor: "Ice Mint",
        description: "The understanding of awareness to life.",
        image: "/images/elev8ated-ice/frequency-ice-mint-product.png",
      },
      {
        name: "THOUGHTS",
        flavor: "Mango",
        description: "Series of imagination.",
        image: "/images/elev8ated-ice/thoughts-mango-product.png",
      },
      {
        name: "CONSCIOUSNESS",
        flavor: "Blackberry",
        description: "Awareness of my existence in connection to all and everything.",
        image: "/images/elev8ated-ice/consciousness-blackberry-product.png",
      },
      {
        name: "VIBRATION",
        flavor: "Blue Apple",
        description: "Emotional connection to reality.",
        image: "/images/elev8ated-ice/vibration-blue-apple-product.png",
      },
      {
        name: "LOVE",
        flavor: "Lime Basil",
        description: "A feeling of selflessness in relation to life experiences.",
        image: "/images/elev8ated-ice/love-lime-basil-product.png",
      },
      {
        name: "MINDSET",
        flavor: "Strawberry",
        description: "My perspective of myself and the world around me.",
        image: "/images/elev8ated-ice/mindset-strawberry-product.png",
      },
    ],
  },
  {
    id: "elev8ated-refresh",
    tab: "ELEV8ATED REFRESH",
    name: "ELEV8ATED Refresh",
    tagline: "Instant. Purified. Elevated.",
    description:
      "A fast, on-the-go way to ELEV8 — the same ultra-purified, 528hz frequency-infused water in a refreshing new format built for your everyday reset.",
    price: "Coming Soon",
    status: "coming-soon",
    cta: "NOTIFY ME →",
    images: ["", ""],
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
    images: ["", "", ""],
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
    images: ["", ""],
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
    images: ["", ""],
  },
  {
    id: "paper-box",
    tab: "PAPER BOX",
    name: "ELEV8 Paper Box Bottles",
    tagline: "Biodegradable. Sustainable. Pure.",
    description:
      "Biodegradable paper box packaging with your ultra-purified water — a sustainable alternative to our PET BPA-free bottles.",
    price: "Coming Soon",
    status: "coming-soon",
    cta: "NOTIFY ME →",
    images: ["", ""],
  },
  {
    id: "pet-bottles",
    tab: "PET WATER BOTTLES",
    name: "ELEV8 Water Bottles",
    tagline: "1 Water. 12 Understandings.",
    description:
      "Ultra-purified water infused with 528hz binaural frequency. Each bottle represents one of 12 self-development understandings, created with YOU in mind.",
    price: "From $47.77",
    status: "sold-out",
    cta: "NOTIFY ME →",
    images: [
      "/images/bottles2/ALL.png",
      "/images/bottles2/YOU.png",
      "/images/bottles2/LOVE.png",
    ],
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
    images: ["", ""],
  },
];

export default function WaveCollection() {
  const [activeId, setActiveId] = useState(WAVE_COLLECTION[0].id);
  const [liveStatus, setLiveStatus] = useState<Record<string, ProductStatus>>({});
  const reduced = usePrefersReducedMotion();
  const active = WAVE_COLLECTION.find((c) => c.id === activeId) ?? WAVE_COLLECTION[0];
  const activeStatus = liveStatus[active.id] ?? active.status;

  useEffect(() => {
    let cancelled = false;

    async function loadLiveStatus() {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to load products");
        const { products } = (await res.json()) as {
          products: { category: string; status: ProductStatus }[];
        };
        if (cancelled) return;

        const next: Record<string, ProductStatus> = {};
        for (const [waveId, dbCategory] of Object.entries(CATEGORY_MATCH)) {
          const match = products.find((p) => p.category === dbCategory);
          if (match) next[waveId] = match.status;
        }
        setLiveStatus(next);
      } catch {
        // Fall back silently to each category's static status.
      }
    }

    loadLiveStatus();
    return () => {
      cancelled = true;
    };
  }, []);

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
            EXPLORE OUR YOUNIVERSE
          </p>
          <h2 className="mt-3 font-cormorant text-[40px] font-bold text-ink md:text-[64px]">
            THE PERSONAL COLLECTION
          </h2>
          <p className="mt-3 font-inter text-base text-body">
            Every offering created with YOU in mind
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
                    <>
                      <m.span
                        layoutId="waveTabIndicatorDesktop"
                        className="absolute inset-y-0 left-0 hidden w-1 rounded-full bg-violet lg:block"
                        transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 30 }}
                      />
                      <m.span
                        layoutId="waveTabIndicatorMobile"
                        className="absolute inset-x-2 bottom-0 block h-[3px] rounded-t-md bg-violet lg:hidden"
                        transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 30 }}
                      />
                    </>
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
                {active.variants ? (
                  <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                    {active.variants.map((variant) => (
                      <m.div
                        key={variant.name}
                        whileHover={reduced ? undefined : { y: -6 }}
                        className="group flex flex-col overflow-hidden rounded-2xl border border-violet/10 bg-white shadow-[0_2px_12px_rgba(20,20,42,0.05)] transition-all duration-300 hover:shadow-[0_24px_48px_rgba(107,47,160,0.18)] hover:border-violet/25"
                      >
                        <div
                          className="relative aspect-[4/5] w-full overflow-hidden"
                          style={{
                            background:
                              "radial-gradient(circle at 50% 30%, rgba(107,47,160,0.08), rgba(78,205,196,0.05) 60%, transparent 100%)",
                          }}
                        >
                          <div className="absolute inset-0 flex items-center justify-center p-3 transition-transform duration-500 group-hover:scale-[1.04]">
                            <ImageWithFallback
                              src={variant.image || undefined}
                              alt={`ELEV8 ${variant.name} — ${variant.flavor}`}
                              watermark={variant.name}
                              rounded="rounded-none"
                              className="object-contain"
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 220px"
                            />
                          </div>
                        </div>
                        <div className="border-t border-violet/10 px-3.5 py-3.5">
                          <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.12em] text-violet">
                            {variant.name}
                            <span className="mx-1.5 text-violet/30">·</span>
                            <span className="font-normal normal-case tracking-normal text-body">
                              {variant.flavor}
                            </span>
                          </p>
                          <p className="mt-1.5 font-inter text-[12px] leading-relaxed text-body/80">
                            {variant.description}
                          </p>
                        </div>
                      </m.div>
                    ))}
                  </div>
                ) : (
                  <div
                    className={`grid grid-cols-2 gap-4 ${
                      active.images.length >= 3 ? "sm:grid-cols-3" : ""
                    }`}
                  >
                    {active.images.map((src, i) => (
                      <m.div
                        key={i}
                        whileHover={reduced ? undefined : { y: -4 }}
                        className="flex h-[160px] items-center justify-center overflow-hidden rounded-2xl border border-violet/10 bg-white/80 p-4 backdrop-blur transition-shadow hover:shadow-[0_20px_40px_rgba(107,47,160,0.15)] hover:border-violet/30 md:h-[220px]"
                      >
                        <ImageWithFallback
                          src={src || undefined}
                          alt={`${active.name} — view ${i + 1}`}
                          watermark={active.name}
                          rounded="rounded-xl"
                          className="object-contain"
                        />
                      </m.div>
                    ))}
                  </div>
                )}

                <h3 className="mt-8 font-cormorant text-[36px] text-ink">{active.name}</h3>
                <p className="mt-1 font-inter text-[14px] uppercase tracking-[0.1em] text-violet">
                  {active.tagline}
                </p>
                <p className="mt-4 max-w-xl font-inter text-[15px] leading-[1.8] text-body">
                  {active.description}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <p className="font-cormorant text-[28px] text-violet">{active.price}</p>
                  <ProductStatusBadge status={activeStatus} />
                </div>

                {activeStatus === "available" ? (
                  <Link
                    href="/shop"
                    className="group mt-8 flex h-[52px] w-fit items-center gap-2 rounded bg-violet px-8 font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-white transition-transform duration-300 hover:scale-[1.02]"
                  >
                    {active.cta}
                  </Link>
                ) : (
                  <NotifyMeForm
                    key={active.id}
                    label={active.cta}
                    source="wave-collection"
                    className="mt-8"
                  />
                )}
              </m.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
