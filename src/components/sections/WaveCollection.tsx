"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import Link from "next/link";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { ImageWithFallback } from "@/components/ui/MediaWithFallback";
import NotifyMeForm from "@/components/ui/NotifyMeForm";
import ProductStatusBadge from "@/components/sections/shop/ProductStatusBadge";
import { BOTTLES } from "@/data/content";
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

type VariantAsset = { flavor?: string; image: string };

/** Flavor (where applicable) + image for each Understanding, per product
 * line. Only the flavor/image are specific to each product — the
 * Understanding's name and meaning always come from BOTTLES
 * (src/data/content.ts), so they can never drift from what's shown
 * everywhere else on the site. */
const ELEV8ATED_ICE_ASSETS: Record<string, VariantAsset> = {
  ALL: { flavor: "Lavender", image: "/images/elev8ated-ice/all-lavender-product.png" },
  YOU: { flavor: "Blueberry", image: "/images/elev8ated-ice/you-blueberry-product.png" },
  LOVE: { flavor: "Lime Basil", image: "/images/elev8ated-ice/love-lime-basil-product.png" },
  DESIRE: { flavor: "Orange", image: "/images/elev8ated-ice/desire-orange-product.png" },
  ENERGY: { flavor: "Coconut", image: "/images/elev8ated-ice/energy-coconut-product.png" },
  BELIEVE: { flavor: "Lemon", image: "/images/elev8ated-ice/believe-lemon-product.png" },
  VIBRATION: { flavor: "Blue Apple", image: "/images/elev8ated-ice/vibration-blue-apple-product.png" },
  MINDSET: { flavor: "Strawberry", image: "/images/elev8ated-ice/mindset-strawberry-product.png" },
  GRATITUDE: { flavor: "Cucumber Mint", image: "/images/elev8ated-ice/gratitude-cucumber-mint-product.png" },
  FREQUENCY: { flavor: "Ice Mint", image: "/images/elev8ated-ice/frequency-ice-mint-product.png" },
  THOUGHTS: { flavor: "Mango", image: "/images/elev8ated-ice/thoughts-mango-product.png" },
  CONSCIOUSNESS: { flavor: "Blackberry", image: "/images/elev8ated-ice/consciousness-blackberry-product.png" },
};

// Aluminum Bottles has no flavor concept — each bottle is just the
// Understanding itself, so `flavor` is omitted for every entry.
const ALUMINUM_BOTTLES_ASSETS: Record<string, VariantAsset> = {
  ALL: { image: "/images/aluminum-bottles/all-product.png" },
  YOU: { image: "/images/aluminum-bottles/you-product.png" },
  LOVE: { image: "/images/aluminum-bottles/love-product.png" },
  DESIRE: { image: "/images/aluminum-bottles/desire-product.png" },
  ENERGY: { image: "/images/aluminum-bottles/energy-product.png" },
  BELIEVE: { image: "/images/aluminum-bottles/believe-product.png" },
  VIBRATION: { image: "/images/aluminum-bottles/vibration-product.png" },
  MINDSET: { image: "/images/aluminum-bottles/mindset-product.png" },
  GRATITUDE: { image: "/images/aluminum-bottles/gratitude-product.png" },
  FREQUENCY: { image: "/images/aluminum-bottles/frequency-product.png" },
  THOUGHTS: { image: "/images/aluminum-bottles/thoughts-product.png" },
  CONSCIOUSNESS: { image: "/images/aluminum-bottles/consciousness-product.png" },
};

// ELEV8ATED Refresh: flavor is only known for 8 of the 12 (printed on the
// source art's filename) — BELIEVE/THOUGHTS/LOVE/GRATITUDE have no flavor
// name anywhere in the source material, so `flavor` is left unset for
// those 4 rather than guessed; the card renders the Understanding name
// alone for them (see the `variant.flavor &&` guard below).
const ELEV8ATED_REFRESH_ASSETS: Record<string, VariantAsset> = {
  ALL: { flavor: "Blackberry", image: "/images/elev8-refresh/all-blackberry-product.png" },
  YOU: { flavor: "Blueberry", image: "/images/elev8-refresh/you-blueberry-product.png" },
  LOVE: { image: "/images/elev8-refresh/love-product.png" },
  DESIRE: { flavor: "Orange Passion", image: "/images/elev8-refresh/desire-orange-passion-product.png" },
  ENERGY: { flavor: "Coconut", image: "/images/elev8-refresh/energy-coconut-product.png" },
  BELIEVE: { image: "/images/elev8-refresh/believe-product.png" },
  VIBRATION: { flavor: "Aqua Mint", image: "/images/elev8-refresh/vibration-aqua-mint-product.png" },
  MINDSET: { flavor: "Cherry Burst", image: "/images/elev8-refresh/mindset-cherry-burst-product.png" },
  GRATITUDE: { image: "/images/elev8-refresh/gratitude-product.png" },
  FREQUENCY: { flavor: "Cool Mint", image: "/images/elev8-refresh/frequency-cool-mint-product.png" },
  THOUGHTS: { image: "/images/elev8-refresh/thoughts-product.png" },
  CONSCIOUSNESS: { flavor: "Midnight Berry", image: "/images/elev8-refresh/consciousness-midnight-berry-product.png" },
};

const ESSENCE_PODS_ASSETS: Record<string, VariantAsset> = {
  ALL: { flavor: "Lavender", image: "/images/essence-pods/all-product.png" },
  YOU: { flavor: "Blueberry", image: "/images/essence-pods/you-product.png" },
  LOVE: { flavor: "Lime Basil", image: "/images/essence-pods/love-product.png" },
  DESIRE: { flavor: "Orange", image: "/images/essence-pods/desire-product.png" },
  ENERGY: { flavor: "Coconut", image: "/images/essence-pods/energy-product.png" },
  BELIEVE: { flavor: "Lemon", image: "/images/essence-pods/believe-product.png" },
  VIBRATION: { flavor: "Blue Apple", image: "/images/essence-pods/vibration-product.png" },
  MINDSET: { flavor: "Strawberry", image: "/images/essence-pods/mindset-product.png" },
  GRATITUDE: { flavor: "Cucumber Mint", image: "/images/essence-pods/gratitude-product.png" },
  FREQUENCY: { flavor: "Ice Mint", image: "/images/essence-pods/frequency-product.png" },
  THOUGHTS: { flavor: "Mango", image: "/images/essence-pods/thoughts-product.png" },
  CONSCIOUSNESS: { flavor: "Blackberry", image: "/images/essence-pods/consciousness-product.png" },
};

const FLAVOR_CAPS_ASSETS: Record<string, VariantAsset> = {
  ALL: { flavor: "Lavender", image: "/images/flavour-caps/all-lavender-product.png" },
  YOU: { flavor: "Blueberry", image: "/images/flavour-caps/you-blueberry-product.png" },
  LOVE: { flavor: "Lime Basil", image: "/images/flavour-caps/love-lime-basil-product.png" },
  DESIRE: { flavor: "Orange", image: "/images/flavour-caps/desire-orange-product.png" },
  ENERGY: { flavor: "Coconut", image: "/images/flavour-caps/energy-coconut-product.png" },
  BELIEVE: { flavor: "Lemon", image: "/images/flavour-caps/believe-lemon-product.png" },
  VIBRATION: { flavor: "Blue Apple", image: "/images/flavour-caps/vibration-blue-apple-product.png" },
  MINDSET: { flavor: "Strawberry", image: "/images/flavour-caps/mindset-strawberry-product.png" },
  GRATITUDE: { flavor: "Cucumber Mint", image: "/images/flavour-caps/gratitude-cucumber-mint-product.png" },
  FREQUENCY: { flavor: "Ice Mint", image: "/images/flavour-caps/frequency-ice-mint-product.png" },
  THOUGHTS: { flavor: "Mango", image: "/images/flavour-caps/thoughts-mango-product.png" },
  CONSCIOUSNESS: { flavor: "Blackberry", image: "/images/flavour-caps/consciousness-blackberry-product.png" },
};

// Glass Bottles has no flavor concept — each bottle is just the
// Understanding itself, so `flavor` is omitted for every entry.
const GLASS_BOTTLES_ASSETS: Record<string, VariantAsset> = {
  ALL: { image: "/images/glass-bottles/all-product.png" },
  YOU: { image: "/images/glass-bottles/you-product.png" },
  LOVE: { image: "/images/glass-bottles/love-product.png" },
  DESIRE: { image: "/images/glass-bottles/desire-product.png" },
  ENERGY: { image: "/images/glass-bottles/energy-product.png" },
  BELIEVE: { image: "/images/glass-bottles/believe-product.png" },
  VIBRATION: { image: "/images/glass-bottles/vibration-product.png" },
  MINDSET: { image: "/images/glass-bottles/mindset-product.png" },
  GRATITUDE: { image: "/images/glass-bottles/gratitude-product.png" },
  FREQUENCY: { image: "/images/glass-bottles/frequency-product.png" },
  THOUGHTS: { image: "/images/glass-bottles/thoughts-product.png" },
  CONSCIOUSNESS: { image: "/images/glass-bottles/consciousness-product.png" },
};

// Paper Box has no flavor concept — each bottle is just the Understanding itself.
const PAPER_BOX_ASSETS: Record<string, VariantAsset> = {
  ALL: { image: "/images/paper-box/all-product.png" },
  YOU: { image: "/images/paper-box/you-product.png" },
  LOVE: { image: "/images/paper-box/love-product.png" },
  DESIRE: { image: "/images/paper-box/desire-product.png" },
  ENERGY: { image: "/images/paper-box/energy-product.png" },
  BELIEVE: { image: "/images/paper-box/believe-product.png" },
  VIBRATION: { image: "/images/paper-box/vibration-product.png" },
  MINDSET: { image: "/images/paper-box/mindset-product.png" },
  GRATITUDE: { image: "/images/paper-box/gratitude-product.png" },
  FREQUENCY: { image: "/images/paper-box/frequency-product.png" },
  THOUGHTS: { image: "/images/paper-box/thoughts-product.png" },
  CONSCIOUSNESS: { image: "/images/paper-box/consciousness-product.png" },
};

// PET Water Bottles has no flavor concept — each bottle is just the Understanding itself.
const PER_WATER_BOTTLE_ASSETS: Record<string, VariantAsset> = {
  ALL: { image: "/images/per-water-bottle/all-product.png" },
  YOU: { image: "/images/per-water-bottle/you-product.png" },
  LOVE: { image: "/images/per-water-bottle/love-product.png" },
  DESIRE: { image: "/images/per-water-bottle/desire-product.png" },
  ENERGY: { image: "/images/per-water-bottle/energy-product.png" },
  BELIEVE: { image: "/images/per-water-bottle/believe-product.png" },
  VIBRATION: { image: "/images/per-water-bottle/vibration-product.png" },
  MINDSET: { image: "/images/per-water-bottle/mindset-product.png" },
  GRATITUDE: { image: "/images/per-water-bottle/gratitude-product.png" },
  FREQUENCY: { image: "/images/per-water-bottle/frequency-product.png" },
  THOUGHTS: { image: "/images/per-water-bottle/thoughts-product.png" },
  CONSCIOUSNESS: { image: "/images/per-water-bottle/consciousness-product.png" },
};

// Smart Bottles has no flavor concept — each bottle is just the Understanding itself.
const SMART_BOTTLES_ASSETS: Record<string, VariantAsset> = {
  ALL: { image: "/images/smart-bottles/all-product.png" },
  YOU: { image: "/images/smart-bottles/you-product.png" },
  LOVE: { image: "/images/smart-bottles/love-product.png" },
  DESIRE: { image: "/images/smart-bottles/desire-product.png" },
  ENERGY: { image: "/images/smart-bottles/energy-product.png" },
  BELIEVE: { image: "/images/smart-bottles/believe-product.png" },
  VIBRATION: { image: "/images/smart-bottles/vibration-product.png" },
  MINDSET: { image: "/images/smart-bottles/mindset-product.png" },
  GRATITUDE: { image: "/images/smart-bottles/gratitude-product.png" },
  FREQUENCY: { image: "/images/smart-bottles/frequency-product.png" },
  THOUGHTS: { image: "/images/smart-bottles/thoughts-product.png" },
  CONSCIOUSNESS: { image: "/images/smart-bottles/consciousness-product.png" },
};

// Hydration Pump has no flavor concept — each pump is just the Understanding itself.
const HYDRATION_PUMP_ASSETS: Record<string, VariantAsset> = {
  ALL: { image: "/images/hydration-pump/all-product.png" },
  YOU: { image: "/images/hydration-pump/you-product.png" },
  LOVE: { image: "/images/hydration-pump/love-product.png" },
  DESIRE: { image: "/images/hydration-pump/desire-product.png" },
  ENERGY: { image: "/images/hydration-pump/energy-product.png" },
  BELIEVE: { image: "/images/hydration-pump/believe-product.png" },
  VIBRATION: { image: "/images/hydration-pump/vibration-product.png" },
  MINDSET: { image: "/images/hydration-pump/mindset-product.png" },
  GRATITUDE: { image: "/images/hydration-pump/gratitude-product.png" },
  FREQUENCY: { image: "/images/hydration-pump/frequency-product.png" },
  THOUGHTS: { image: "/images/hydration-pump/thoughts-product.png" },
  CONSCIOUSNESS: { image: "/images/hydration-pump/consciousness-product.png" },
};

/** Builds the 12 variant cards for a product line straight from BOTTLES, in
 * BOTTLES' own order (ALL, YOU, LOVE, DESIRE, ENERGY, BELIEVE, VIBRATION,
 * MINDSET, GRATITUDE, FREQUENCY, THOUGHTS, CONSCIOUSNESS) — the same order
 * and the same meaning (shortBlurb) used everywhere else the 12
 * Understandings are shown, so the name/meaning can never drift between
 * product lines. */
function buildVariants(assets: Record<string, VariantAsset>): WaveVariant[] {
  return BOTTLES.map((bottle) => {
    const asset = assets[bottle.name];
    return {
      name: bottle.name,
      flavor: asset?.flavor ?? "",
      description: bottle.shortBlurb,
      image: asset?.image ?? "",
    };
  });
}

// Kept in alphabetical order by `tab` — add new categories in their alphabetical slot.
const WAVE_COLLECTION: WaveCategory[] = [
  {
    id: "aluminum-bottles",
    tab: "ALUMINUM BOTTLES",
    name: "ELEV8 Aluminum Bottles",
    tagline: "1 Water. 12 Understandings.",
    description:
      "Premium aluminum bottles — sustainable, sleek and built for the elevated lifestyle. The same ultra-purified ELEV8 Water in a bold, eco-conscious format, one for each of the 12 self-development understandings.",
    price: "Coming Soon",
    status: "coming-soon",
    cta: "NOTIFY ME →",
    images: ["", ""],
    // Generated from BOTTLES below, not hand-typed — keeps the Understanding
    // order and meaning identical to every other place the 12
    // Understandings appear on the site.
    variants: buildVariants(ALUMINUM_BOTTLES_ASSETS),
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
    variants: buildVariants(ELEV8ATED_ICE_ASSETS),
  },
  {
    id: "elev8ated-refresh",
    tab: "ELEV8ATED REFRESH",
    name: "ELEV8ATED Refresh",
    tagline: "1 Water. 12 Understandings.",
    description:
      "A fast, on-the-go way to ELEV8 — the same ultra-purified, 528hz frequency-infused water in a refreshing new format built for your everyday reset, one for each of the 12 self-development understandings.",
    price: "Coming Soon",
    status: "coming-soon",
    cta: "NOTIFY ME →",
    images: ["", ""],
    variants: buildVariants(ELEV8ATED_REFRESH_ASSETS),
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
    variants: buildVariants(ESSENCE_PODS_ASSETS),
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
    variants: buildVariants(FLAVOR_CAPS_ASSETS),
  },
  {
    id: "glass-bottles",
    tab: "GLASS BOTTLES",
    name: "ELEV8 Glass Bottles",
    tagline: "1 Water. 12 Understandings.",
    description:
      "Premium glass bottles for those who demand the purest experience. Earth-friendly, beautifully designed and filled with the world's greatest ultra-purified water, one for each of the 12 self-development understandings.",
    price: "Coming Soon",
    status: "coming-soon",
    cta: "NOTIFY ME →",
    images: ["", ""],
    variants: buildVariants(GLASS_BOTTLES_ASSETS),
  },
  {
    id: "hydration-pump",
    tab: "HYDRATION PUMP",
    name: "ELEV8 Hydration Pump",
    tagline: "1 Water. 12 Understandings.",
    description:
      "An on-site ELEV8 dispensing station — ultra-purified, 528hz frequency-infused water on tap, one for each of the 12 self-development understandings.",
    price: "Coming Soon",
    status: "coming-soon",
    cta: "NOTIFY ME →",
    images: ["", ""],
    variants: buildVariants(HYDRATION_PUMP_ASSETS),
  },
  {
    id: "paper-box",
    tab: "PAPER BOX",
    name: "ELEV8 Paper Box Bottles",
    tagline: "1 Water. 12 Understandings.",
    description:
      "Biodegradable paper box packaging with your ultra-purified water — a sustainable alternative to our PET BPA-free bottles, one for each of the 12 self-development understandings.",
    price: "Coming Soon",
    status: "coming-soon",
    cta: "NOTIFY ME →",
    images: ["", ""],
    variants: buildVariants(PAPER_BOX_ASSETS),
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
    variants: buildVariants(PER_WATER_BOTTLE_ASSETS),
  },
  {
    id: "smart-bottle",
    tab: "SMART BOTTLE",
    name: "ELEV8 Smart Bottle",
    tagline: "1 Water. 12 Understandings.",
    description:
      "The future of hydration. Smart hydration tracking, pH balance monitoring, temperature sensor and Bluetooth connectivity — all in one premium futuristic design, one for each of the 12 self-development understandings.",
    price: "Coming Soon",
    status: "coming-soon",
    cta: "NOTIFY ME →",
    images: ["", ""],
    variants: buildVariants(SMART_BOTTLES_ASSETS),
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
                              alt={variant.flavor ? `ELEV8 ${variant.name} — ${variant.flavor}` : `ELEV8 ${variant.name}`}
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
                            {variant.flavor && (
                              <>
                                <span className="mx-1.5 text-violet/30">·</span>
                                <span className="font-normal normal-case tracking-normal text-body">
                                  {variant.flavor}
                                </span>
                              </>
                            )}
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
