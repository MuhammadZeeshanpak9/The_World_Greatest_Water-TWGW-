"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Product photography is portrait-oriented (bottles shot on a dark
// backdrop, ~4:5) — the card/detail containers that render this
// component are sized to match (aspect-[4/5] or aspect-square), so
// object-cover fills the box edge-to-edge with no empty space. Gift
// card art (~3:2) crops slightly on the sides, which reads fine since
// the set photography is already centered.

export default function ProductImageCarousel({
  images,
  alt,
  className,
}: {
  images: string[];
  alt: string;
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <Image
        src={images[0]}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className={`object-cover ${className ?? ""}`}
      />
    );
  }

  function goTo(e: React.MouseEvent, delta: number) {
    // The carousel is rendered inside a <Link> to the product page in
    // ShopSection.tsx/ProductCard.tsx — without these, clicking an arrow
    // would navigate away instead of just changing the image.
    e.preventDefault();
    e.stopPropagation();
    setIndex((prev) => (prev + delta + images.length) % images.length);
  }

  return (
    <>
      <Image
        src={images[index]}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className={`object-cover ${className ?? ""}`}
      />
      <button
        type="button"
        aria-label="Previous image"
        onClick={(e) => goTo(e, -1)}
        className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-ink shadow-sm transition-colors hover:bg-white"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        type="button"
        aria-label="Next image"
        onClick={(e) => goTo(e, 1)}
        className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-ink shadow-sm transition-colors hover:bg-white"
      >
        <ChevronRight size={16} />
      </button>
    </>
  );
}
