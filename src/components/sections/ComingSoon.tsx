"use client";

import { useState } from "react";
import Image from "next/image";
import { m } from "framer-motion";
import { COMING_SOON } from "@/data/content";
import { GradientPlaceholder } from "@/components/ui/MediaWithFallback";
import NotifyMeForm from "@/components/ui/NotifyMeForm";

function ComingSoonImage({ type, image, hoverImage }: { type: string; image?: string; hoverImage?: string }) {
  const [hovered, setHovered] = useState(false);

  if (!image) return <GradientPlaceholder watermark="Coming Soon" className="rounded-xl" />;

  return (
    <div
      className="relative h-full w-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Image src={image} alt={type} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
      {hoverImage && (
        <m.div
          className="absolute inset-0"
          initial={false}
          animate={{ x: hovered ? "0%" : "100%" }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image src={hoverImage} alt={`${type} — alternate view`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
        </m.div>
      )}
    </div>
  );
}

export default function ComingSoon() {
  return (
    <section className="relative bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-violet/10 px-4 py-1.5 font-inter text-[10px] font-semibold uppercase tracking-[0.4em] text-violet">
          <span className="h-1.5 w-1.5 animate-glow-pulse rounded-full bg-violet" />
          Coming Soon
        </span>
        <h2 className="mt-6 font-cormorant text-[36px] font-semibold text-ink md:text-[56px]">
          WE GOT YOU COVERED!
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {COMING_SOON.map((item, i) => (
            <m.div
              key={item.type}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -6 }}
              className="overflow-hidden rounded-[20px] border border-violet/10 p-5 text-left transition-shadow hover:shadow-[0_20px_50px_rgba(107,47,160,0.12)]"
              style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(10px)" }}
            >
              <div className="relative h-[200px] overflow-hidden rounded-xl">
                <ComingSoonImage type={item.type} image={item.image} hoverImage={item.hoverImage} />
              </div>
              <h3 className="mt-5 font-cormorant text-[24px] text-ink">{item.type}</h3>
              <p className="mt-2 font-inter text-[13px] leading-relaxed text-body">
                {item.description}
              </p>
              <NotifyMeForm
                label="Notify Me"
                source="coming-soon"
                variant="outline"
                className="mt-5"
              />
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
