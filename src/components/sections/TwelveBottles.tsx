"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BOTTLES } from "@/data/content";
import { GradientPlaceholder } from "@/components/ui/MediaWithFallback";
import SectionParticles from "./SectionParticles";

const HEADING = "EXPLORE OUR 12 INSPIRATIONAL BOTTLES".split("");

export default function TwelveBottles() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    slidesToScroll: 1,
    loop: false,
  });
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi],
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    const onReInit = () => {
      setSnaps(emblaApi.scrollSnapList());
      setSelected(emblaApi.selectedScrollSnap());
    };
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onReInit);
    // Defer initial read out of the effect body to avoid synchronous
    // setState-in-effect (cascading renders).
    const raf = requestAnimationFrame(onReInit);
    return () => {
      cancelAnimationFrame(raf);
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onReInit);
    };
  }, [emblaApi]);

  return (
    <section className="relative overflow-hidden bg-dark-base py-24 md:py-32">
      <SectionParticles count={40} />

      {/* giant faint 12 */}
      <span
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-cormorant font-bold leading-none text-violet/[0.03]"
        style={{ fontSize: "40vw" }}
        aria-hidden
      >
        12
      </span>

      <div className="relative mx-auto max-w-7xl px-6">
        <h2 className="mx-auto max-w-4xl text-center font-cormorant text-[36px] font-semibold leading-tight text-white md:text-[56px]">
          {HEADING.map((c, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.02 }}
            >
              {c === " " ? " " : c}
            </motion.span>
          ))}
        </h2>
        <p className="mt-4 text-center font-inter text-[13px] uppercase tracking-[0.4em] text-teal">
          Created To Add Value To Your Life
        </p>

        {/* Carousel */}
        <div className="relative mt-14">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {BOTTLES.map((bottle) => (
                <div
                  key={bottle.name}
                  className="min-w-0 flex-[0_0_80%] sm:flex-[0_0_45%] lg:flex-[0_0_28%]"
                >
                  <div
                    className="group h-full rounded-[20px] border border-white/10 p-7 transition-all duration-300 hover:-translate-y-1.5"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      backdropFilter: "blur(20px)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = bottle.color;
                      e.currentTarget.style.boxShadow = `0 0 30px ${bottle.color}55`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div className="relative h-[220px] overflow-hidden rounded-2xl">
                      <GradientPlaceholder watermark={bottle.name} className="rounded-2xl" />
                    </div>
                    <div className="mt-5 flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: bottle.color }}
                      />
                      <span className="font-inter text-[10px] uppercase tracking-[0.25em] text-white/40">
                        {bottle.chakra}
                      </span>
                    </div>
                    <h3 className="mt-2 font-cormorant text-[26px] text-white">
                      {bottle.name}
                    </h3>
                    <p className="mt-1 font-inter text-[13px] text-white/50">
                      {bottle.blurb}
                    </p>
                    <a
                      href="#"
                      className="mt-5 inline-flex items-center gap-1 font-inter text-[11px] uppercase tracking-[0.15em] text-white/50 transition-colors"
                      style={{ color: undefined }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = bottle.color)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "")}
                    >
                      Know More
                      <ArrowRight size={13} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Arrows */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              aria-label="Previous"
              onClick={scrollPrev}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-violet hover:bg-violet/20"
              style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)" }}
            >
              <ArrowLeft size={18} />
            </button>
            <button
              aria-label="Next"
              onClick={scrollNext}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-violet hover:bg-violet/20"
              style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)" }}
            >
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Dots */}
          <div className="mt-5 flex items-center justify-center gap-2">
            {snaps.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => scrollTo(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === selected ? "w-6 bg-violet" : "w-1.5 bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
