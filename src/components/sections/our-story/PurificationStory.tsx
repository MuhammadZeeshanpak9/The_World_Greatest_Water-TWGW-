"use client";

import { motion } from "framer-motion";
import { ImageWithFallback } from "@/components/ui/MediaWithFallback";
import PullQuote from "@/components/ui/PullQuote";

const PARAGRAPHS = [
  "Inside every bottle of THE WORLD'S GREATEST WATER, ELEV8 WATER is a refreshing ultra-pure water, soothing and enjoyable to the body, mind, and soul to enhance the natural connection to life's beautiful experiences.",
  "The ultra purification process focuses on the complete extraction of all impurities that could be achieved in healthy drinking water. We meticulously filter every drop of water down to its most basic form: two parts oxygen and one part hydrogen.",
  "Through multiple science and organic research, the conclusion has exemplified the importance of transforming naturally sourced water into an ultra-pure essential for a refreshing hydrating experience.",
];

const PARAGRAPHS_2 = [
  "THE WORLD'S GREATEST WATER. ELEV8 WATER is a tool for your mind, positively changing how we experience water.",
  "We believe greatness and true potential is within every one of us: the desire to reach for more and do more, the passion for inspiring oneself and others. We are the creators of our reality.",
  "The vision for ELEV8 WATER came with great insight into our awareness of life. Imagined in a dream and manifested to reality.",
];

export default function PurificationStory() {
  return (
    <section className="bg-dark-base py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2">
        <div>
          <div className="flex flex-col gap-5">
            {PARAGRAPHS.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="font-inter text-base leading-[1.9] text-white/65"
              >
                {p}
              </motion.p>
            ))}
          </div>

          <PullQuote
            quote="Let water be a tool in navigating your life."
            tone="dark"
            className="my-10"
          />

          <div className="flex flex-col gap-5">
            {PARAGRAPHS_2.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="font-inter text-base leading-[1.9] text-white/65"
              >
                {p}
              </motion.p>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl"
        >
          <ImageWithFallback
            src={undefined}
            alt="ELEV8 purification"
            watermark="purification.jpg"
          />
        </motion.div>
      </div>
    </section>
  );
}
