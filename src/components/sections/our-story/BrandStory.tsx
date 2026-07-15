"use client";

import { m } from "framer-motion";
import { ImageWithFallback } from "@/components/ui/MediaWithFallback";

const PARAGRAPHS = [
  "ELEV8 derived from the word ELEVATE meaning to raise or lift up to a higher level.",
  "THE WORLD'S GREATEST WATER. ELEV8 WATER is the number 1 self-development and wellness brand in the world like NO other brand globally.",
  "Our ultra-purified water and brand ideas are specifically created to provide important self awareness information through thoughtfully created contents and enlightened techniques guaranteed to positively enhance the personal life experiences of the consumers who choose to ELEV8 their lives with a product ELEV8 WATER.",
  "Information is Power.",
  "Information is \"Mental\" MIND.",
  "Power is \"Physical\" REALITY.",
  "We are a community inspired by the vision to ELEV8 the consciousness of humanity with the greatest ultra-pure water striped from all chemical additive, infused with binaural frequency 528 hz ❤️ perfect for hydration and soothing to your taste buds.",
  "In times like this, self development and mental awareness will enhance the quality of life for ALL and promote the spread of love and happiness with all consciousness, bringing joy to homes and families worldwide.",
  "LOVE & GRATITUDE ♡",
];

export default function BrandStory() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2">
        <m.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl"
        >
          <ImageWithFallback
            src={undefined}
            alt="ELEV8 bottles"
            watermark="our-story-bottles.jpg"
          />
        </m.div>

        <div>
          <m.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-cormorant text-[36px] font-bold text-gradient-brand"
          >
            1 WATER. 12 UNDERSTANDING
          </m.h2>

          <div className="mt-6 flex flex-col gap-5">
            {PARAGRAPHS.map((p, i) => (
              <m.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="font-inter text-base leading-[1.9] text-body"
              >
                {p}
              </m.p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
