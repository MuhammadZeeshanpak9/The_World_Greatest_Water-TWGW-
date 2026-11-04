"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "@/components/ui/MediaWithFallback";
import { BOTTLES } from "@/data/content";

// Packaging images not yet supplied by the client for any of the 12
// Understandings — every slide falls back to the existing gradient
// placeholder until real images are provided. Add a real path here (one
// line, no other code changes) as each image becomes available.
const INTELLIGENT_COLLECTION_IMAGES: Record<string, string> = {
  ALL: "",
  YOU: "",
  LOVE: "",
  DESIRE: "",
  ENERGY: "",
  BELIEVE: "",
  VIBRATION: "",
  MINDSET: "",
  GRATITUDE: "",
  FREQUENCY: "",
  THOUGHTS: "",
  CONSCIOUSNESS: "",
};

const SLIDE_DURATION = 6000;
const TRANSITION_DURATION = 500;

export default function IntelligentCollectionCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || index === currentIndex) return;
      setIsTransitioning(true);
      setProgress(0);
      setTimeout(() => {
        setCurrentIndex(index);
        setTimeout(() => setIsTransitioning(false), 50);
      }, TRANSITION_DURATION / 2);
    },
    [isTransitioning, currentIndex],
  );

  const goNext = useCallback(() => {
    goToSlide((currentIndex + 1) % BOTTLES.length);
  }, [currentIndex, goToSlide]);

  const goPrev = useCallback(() => {
    goToSlide((currentIndex - 1 + BOTTLES.length) % BOTTLES.length);
  }, [currentIndex, goToSlide]);

  useEffect(() => {
    if (isPaused) return;
    progressRef.current = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 100 / (SLIDE_DURATION / 50)));
    }, 50);
    intervalRef.current = setInterval(goNext, SLIDE_DURATION);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [currentIndex, isPaused, goNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 60) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  const slide = BOTTLES[currentIndex];
  const image = INTELLIGENT_COLLECTION_IMAGES[slide.name] || undefined;

  return (
    <div
      className="relative overflow-hidden rounded-[28px] border border-violet/10 bg-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background accent wash */}
      <div
        className="pointer-events-none absolute inset-0 transition-colors duration-700"
        style={{
          background: `radial-gradient(ellipse at 70% 50%, ${slide.color}18 0%, transparent 70%)`,
        }}
        aria-hidden
      />

      <div className="relative flex flex-col lg:flex-row lg:items-center">
        {/* Left — text content */}
        <div className="order-2 flex-1 px-6 py-10 md:px-12 md:py-14 lg:order-1 lg:w-1/2">
          <div
            className={`transition-all duration-300 ${
              isTransitioning ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="h-px w-8" style={{ backgroundColor: slide.color }} />
              <span className="font-inter text-[12px] font-semibold tracking-[0.25em] text-muted">
                {String(currentIndex + 1).padStart(2, "0")} / {String(BOTTLES.length).padStart(2, "0")}
              </span>
            </div>

            <h2 className="mt-5 font-cormorant text-[40px] leading-[1.05] text-ink md:text-[56px]">
              {slide.name}
            </h2>
            <p
              className="mt-2 font-inter text-[12px] font-semibold uppercase tracking-[0.25em]"
              style={{ color: slide.color }}
            >
              {slide.chakra}
            </p>
            <p className="mt-6 max-w-md font-inter text-[15px] leading-[1.8] text-body">
              {slide.shortBlurb}
            </p>
          </div>

          {/* Navigation arrows — large, high-contrast, easy to spot/click */}
          <div className="mt-9 flex items-center gap-4">
            <button
              onClick={goPrev}
              aria-label="Previous understanding"
              className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-violet text-violet shadow-[0_4px_16px_rgba(107,47,160,0.15)] transition-all duration-200 hover:scale-110 hover:bg-violet hover:text-white active:scale-95"
            >
              <ChevronLeft size={26} strokeWidth={2.5} />
            </button>
            <button
              onClick={goNext}
              aria-label="Next understanding"
              className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-violet text-violet shadow-[0_4px_16px_rgba(107,47,160,0.15)] transition-all duration-200 hover:scale-110 hover:bg-violet hover:text-white active:scale-95"
            >
              <ChevronRight size={26} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Right — image */}
        <div className="relative order-1 w-full px-6 pt-10 md:px-12 md:pt-14 lg:order-2 lg:w-1/2 lg:p-14">
          <div
            className={`relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-violet/[0.04] transition-all duration-300 ${
              isTransitioning ? "scale-[0.97] opacity-0" : "scale-100 opacity-100"
            }`}
          >
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <ImageWithFallback
                src={image}
                alt={`ELEV8 Intelligent Collection — ${slide.name}`}
                watermark={slide.name}
                rounded="rounded-none"
                className="object-contain"
                sizes="(max-width: 1024px) 80vw, 480px"
              />
            </div>
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: `linear-gradient(135deg, ${slide.color}22 0%, transparent 50%)` }}
            />
          </div>

          {/* Decorative frame corners */}
          <span
            className="pointer-events-none absolute left-2 top-2 h-10 w-10 border-l-2 border-t-2 md:left-8 md:top-8"
            style={{ borderColor: slide.color }}
            aria-hidden
          />
          <span
            className="pointer-events-none absolute bottom-2 right-2 h-10 w-10 border-b-2 border-r-2 md:bottom-8 md:right-8"
            style={{ borderColor: slide.color }}
            aria-hidden
          />
        </div>
      </div>

      {/* Progress indicators */}
      <div className="relative flex gap-1 overflow-x-auto border-t border-violet/10 px-4 py-4 md:gap-2 md:px-8">
        {BOTTLES.map((b, i) => (
          <button
            key={b.name}
            onClick={() => goToSlide(i)}
            aria-label={`Go to ${b.name}`}
            className="flex min-w-[64px] flex-1 flex-col items-start gap-1.5 pt-0"
          >
            <div className="h-[3px] w-full overflow-hidden rounded-full bg-violet/10">
              <div
                className="h-full rounded-full transition-[width] duration-100"
                style={{
                  width: i === currentIndex ? `${progress}%` : i < currentIndex ? "100%" : "0%",
                  backgroundColor: i === currentIndex ? slide.color : "#6b2fa0",
                }}
              />
            </div>
            <span
              className={`font-inter text-[9px] font-medium uppercase tracking-[0.1em] transition-colors ${
                i === currentIndex ? "text-ink" : "text-muted"
              }`}
            >
              {b.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
