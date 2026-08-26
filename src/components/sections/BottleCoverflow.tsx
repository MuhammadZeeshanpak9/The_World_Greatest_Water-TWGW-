"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import type { Bottle } from "@/types";

/** Fallback dot/glow when no per-card color is available. */
const ACCENT = "#b9aee0";

/** Assigned hex -> rgba(...,alpha) for shadows/washes, since bottle.color is a plain hex string. */
function withAlpha(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

type Props = {
  items: Bottle[];
};

/** 3D coverflow carousel for the "12 Inspirational Bottles" section — center card full
 * size, flanking cards recede in scale/opacity/rotateY to create a curved gallery wall. */
export default function BottleCoverflow({ items }: Props) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const touchStartX = useRef(0);
  const reduced = usePrefersReducedMotion();
  const total = items.length;

  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total]);
  const goTo = (i: number) => setIndex(i % total);

  useEffect(() => {
    if (reduced || hovered || total <= 1) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [reduced, hovered, next, total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 45) (diff < 0 ? next : prev)();
  };

  if (total === 0) return null;

  return (
    <div
      className="relative select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Blurred ambient backdrop from the active bottle's image */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[32px]" aria-hidden>
        {items[index]?.image && (
          <Image
            src={items[index].image!}
            alt=""
            fill
            className="object-cover opacity-25 blur-3xl scale-110 transition-opacity duration-1000"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at center, rgba(6,6,8,0.4) 0%, rgba(6,6,8,0.95) 100%)",
          }}
        />
      </div>

      {/* 3D stage */}
      <div
        className="relative mx-auto flex h-[440px] items-center justify-center sm:h-[500px] md:h-[560px]"
        style={{ perspective: "1400px" }}
      >
        {items.map((bottle, i) => {
          const offset = (i - index + total) % total;
          const isCenter = offset === 0;

          let transform = "translateX(0px) scale(0.35) rotateY(0deg)";
          let opacity = 0;
          let zIndex = 0;
          let filter = "brightness(0.4)";

          if (offset === 0) {
            transform = "translateX(0px) scale(1) rotateY(0deg)";
            opacity = 1;
            zIndex = 30;
            filter = "brightness(1)";
          } else if (offset === 1) {
            transform = "translateX(56%) scale(0.82) rotateY(-24deg)";
            opacity = 0.6;
            zIndex = 20;
            filter = "brightness(0.6)";
          } else if (offset === 2) {
            transform = "translateX(98%) scale(0.65) rotateY(-36deg)";
            opacity = 0.32;
            zIndex = 10;
            filter = "brightness(0.4)";
          } else if (offset === total - 1) {
            transform = "translateX(-56%) scale(0.82) rotateY(24deg)";
            opacity = 0.6;
            zIndex = 20;
            filter = "brightness(0.6)";
          } else if (offset === total - 2) {
            transform = "translateX(-98%) scale(0.65) rotateY(36deg)";
            opacity = 0.32;
            zIndex = 10;
            filter = "brightness(0.4)";
          }

          const cardColor = bottle.color || ACCENT;

          return (
            <div
              key={bottle.name}
              onClick={() => !isCenter && goTo(i)}
              className="absolute h-[400px] w-[300px] overflow-hidden rounded-[20px] border border-white/10 bg-[#111015] sm:h-[450px] sm:w-[350px] md:h-[520px] md:w-[400px]"
              style={{
                transform,
                opacity,
                zIndex,
                filter,
                transformOrigin: "center center",
                transition: reduced ? "opacity 300ms ease" : "all 800ms cubic-bezier(0.25,1,0.5,1)",
                boxShadow: isCenter
                  ? "0 25px 60px rgba(0,0,0,0.85)"
                  : "0 15px 35px rgba(0,0,0,0.5)",
                cursor: isCenter ? "default" : "pointer",
              }}
            >
              {bottle.image && (
                <Image
                  src={bottle.image}
                  alt={bottle.name}
                  fill
                  sizes="400px"
                  className="object-contain p-3"
                />
              )}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 25%, rgba(0,0,0,0.68) 60%, rgba(0,0,0,0.95) 100%)",
                }}
              />

              <div
                className="relative flex h-full flex-col justify-between p-5 text-center transition-all duration-500"
                style={{
                  opacity: isCenter ? 1 : 0,
                  transform: isCenter ? "translateY(0)" : "translateY(16px)",
                  pointerEvents: isCenter ? "auto" : "none",
                }}
              >
                <span
                  className="self-end font-inter text-[11px] font-semibold uppercase tracking-[0.15em] drop-shadow-md"
                  style={{ color: cardColor }}
                >
                  {bottle.chakra}
                </span>

                <div className="mt-auto flex flex-col items-center gap-1">
                  <h3 className="font-cormorant text-[26px] font-bold uppercase tracking-[0.04em] text-white drop-shadow-lg">
                    {bottle.name}
                  </h3>
                  <span
                    className="my-1 block h-[2px] w-9 rounded-full"
                    style={{ backgroundColor: cardColor, boxShadow: `0 0 8px ${withAlpha(cardColor, 0.7)}` }}
                  />
                  <p className="max-w-[240px] font-inter text-[12px] italic leading-snug text-white/85 drop-shadow-md">
                    {bottle.blurb.split(".")[0]}.
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Arrows */}
      <button
        aria-label="Previous bottle"
        onClick={prev}
        className="absolute left-1 top-1/2 z-40 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition-colors hover:border-white/40 sm:left-4"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        aria-label="Next bottle"
        onClick={next}
        className="absolute right-1 top-1/2 z-40 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition-colors hover:border-white/40 sm:right-4"
      >
        <ChevronRight size={18} />
      </button>

      {/* Dots */}
      <div className="mt-8 flex items-center justify-center gap-2">
        {items.map((bottle, i) => {
          const dotColor = bottle.color || ACCENT;
          return (
            <button
              key={bottle.name}
              aria-label={`Go to ${bottle.name}`}
              onClick={() => goTo(i)}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === index ? 26 : 6,
                backgroundColor: i === index ? dotColor : "rgba(255,255,255,0.25)",
                boxShadow: i === index ? `0 0 8px ${withAlpha(dotColor, 0.7)}` : "none",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
