"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type BaseProps = {
  src?: string;
  alt: string;
  className?: string;
  watermark?: string;
  rounded?: string; // tailwind rounding class
  /** Set for above-the-fold images (hero, first-viewport content) — disables lazy loading. */
  priority?: boolean;
  /** Defaults to a generic violet blur swatch when a real image has no blurDataURL of its own. */
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  sizes?: string;
};

/** Generic 8x8 violet blur swatch, used as the default `blurDataURL` below. */
const DEFAULT_BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiM2YjJmYTAiIGZpbGwtb3BhY2l0eT0iMC4xOCIvPjwvc3ZnPg==";

/**
 * Renders a real asset if `src` is provided, otherwise a violet-gradient
 * placeholder (per spec: rgba(107,47,160,0.15)). Lets real images/video drop
 * into /public later with zero code changes.
 */
export function ImageWithFallback({
  src,
  alt,
  className = "",
  watermark,
  rounded = "rounded-2xl",
  priority = false,
  placeholder = "blur",
  blurDataURL = DEFAULT_BLUR_DATA_URL,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: BaseProps) {
  if (src) {
    // Default to object-cover, but let a caller-supplied className override
    // it (e.g. object-contain for a product shot that must show in full,
    // not get cropped to fill the box) — both classes set `object-fit`, so
    // appending object-cover unconditionally after the caller's class was
    // silently winning over an intended object-contain.
    const objectFit = /\bobject-(cover|contain|fill|none|scale-down)\b/.test(className)
      ? ""
      : "object-cover";
    return <FadeInImage src={src} alt={alt} objectFit={objectFit} rounded={rounded} className={className} priority={priority} placeholder={placeholder} blurDataURL={blurDataURL} sizes={sizes} />;
  }
  return <GradientPlaceholder watermark={watermark} className={`${rounded} ${className}`} />;
}

/** Softens the final blur-placeholder-to-photo swap into a short transition
 * instead of an instant pop — on a slow mobile connection the blur
 * placeholder can be visible for a few seconds, and an abrupt pop once the
 * real image arrives reads as a glitch/flash. */
function FadeInImage({
  src,
  alt,
  objectFit,
  rounded,
  className,
  priority,
  placeholder,
  blurDataURL,
  sizes,
}: {
  src: string;
  alt: string;
  objectFit: string;
  rounded: string;
  className: string;
  priority: boolean;
  placeholder: "blur" | "empty";
  blurDataURL: string;
  sizes: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      loading={priority ? undefined : "lazy"}
      placeholder={placeholder}
      blurDataURL={placeholder === "blur" ? blurDataURL : undefined}
      sizes={sizes}
      onLoad={() => setLoaded(true)}
      // Next's own blur-up placeholder renders as this element's background
      // immediately (so the box is never empty); this transition only
      // softens the final swap from blur to the fully-loaded photo once
      // `onLoad` fires, instead of an instant pop.
      className={`${objectFit} ${rounded} ${className} transition-[filter] duration-500 ${loaded ? "" : "blur-[2px]"}`}
    />
  );
}

export function GradientPlaceholder({
  watermark,
  className = "rounded-2xl",
}: {
  watermark?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center ${className}`}
      style={{
        background:
          "linear-gradient(135deg, rgba(107,47,160,0.18) 0%, rgba(78,205,196,0.12) 100%)",
      }}
    >
      {watermark && (
        <span className="select-none font-inter text-[10px] font-medium uppercase tracking-[0.35em] text-violet/50">
          {watermark}
        </span>
      )}
    </div>
  );
}

type VideoProps = {
  src?: string;
  poster?: string;
  className?: string;
  fallbackClassName?: string;
  /** Playback speed multiplier — < 1 plays slower/smoother (default 0.75). */
  speed?: number;
};

/**
 * Autoplaying background video with graceful gradient-hero fallback.
 * Fully preloads (preload="auto") and applies a reduced playbackRate so
 * looping reads as smooth/cinematic rather than laggy.
 */
export function VideoWithFallback({
  src,
  poster,
  className = "",
  fallbackClassName = "bg-gradient-hero",
  speed = 0.75,
}: VideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = speed;
    const onLoaded = () => {
      video.playbackRate = speed;
    };
    video.addEventListener("loadedmetadata", onLoaded);
    return () => video.removeEventListener("loadedmetadata", onLoaded);
  }, [speed]);

  if (!src) {
    return <div className={`h-full w-full ${fallbackClassName}`} />;
  }
  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={poster}
      className={`h-full w-full object-cover ${className}`}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
