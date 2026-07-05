"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { BlogPost } from "@/types";
import { GradientPlaceholder } from "@/components/ui/MediaWithFallback";

export default function RelatedCarousel({ posts }: { posts: BlogPost[] }) {
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

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    const onReInit = () => {
      setSnaps(emblaApi.scrollSnapList());
      setSelected(emblaApi.selectedScrollSnap());
    };
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onReInit);
    const raf = requestAnimationFrame(onReInit);
    return () => {
      cancelAnimationFrame(raf);
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onReInit);
    };
  }, [emblaApi]);

  return (
    <div className="mt-4">
      <h3 className="font-cormorant text-[28px] text-ink">More Understandings</h3>

      <div className="relative mt-6">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blogs/${post.slug}`}
                className="min-w-0 flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_31%]"
              >
                <div className="rounded-[16px] border border-violet/10 p-4 transition-shadow hover:shadow-[0_16px_40px_rgba(107,47,160,0.12)]">
                  <div className="relative h-[140px] overflow-hidden rounded-xl">
                    <GradientPlaceholder watermark={post.topic ?? "ELEV8"} className="rounded-xl" />
                  </div>
                  <h4 className="mt-4 font-cormorant text-[20px] text-ink">{post.title}</h4>
                  <p className="mt-1 font-inter text-[13px] text-body">{post.teaser}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            aria-label="Previous"
            onClick={scrollPrev}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-violet/15 text-violet transition-colors hover:bg-violet hover:text-white"
          >
            <ArrowLeft size={15} />
          </button>
          <button
            aria-label="Next"
            onClick={scrollNext}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-violet/15 text-violet transition-colors hover:bg-violet hover:text-white"
          >
            <ArrowRight size={15} />
          </button>
          <div className="ml-2 flex items-center gap-1.5">
            {snaps.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === selected ? "w-5 bg-violet" : "w-1.5 bg-violet/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
