"use client";

import { motion } from "framer-motion";
import { GradientPlaceholder, VideoWithFallback } from "@/components/ui/MediaWithFallback";

type ServiceOverviewProps = {
  price: string;
  description: string;
  video: string;
  tone: "standard" | "premium";
};

export default function ServiceOverview({
  price,
  description,
  video,
  tone,
}: ServiceOverviewProps) {
  const premium = tone === "premium";

  return (
    <section
      className={`relative overflow-hidden py-24 md:py-32 ${
        premium ? "bg-dark-base" : "bg-white"
      }`}
    >
      {premium && (
        <>
          <div
            className="pointer-events-none absolute -left-32 top-0 h-[500px] w-[500px] rounded-full will-change-transform"
            style={{
              background: "rgba(107,47,160,0.3)",
              filter: "blur(110px)",
              animation: "orbDrift1 20s ease-in-out infinite",
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-24 bottom-0 h-[450px] w-[450px] rounded-full will-change-transform"
            style={{
              background: "rgba(78,205,196,0.2)",
              filter: "blur(110px)",
              animation: "orbDrift2 24s ease-in-out infinite",
            }}
            aria-hidden
          />
        </>
      )}

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p
            className={`font-cormorant ${
              premium ? "text-[56px] text-gradient-brand md:text-[72px]" : "text-[52px] text-violet"
            }`}
          >
            {price}
          </p>
          <p
            className={`mt-6 max-w-lg font-inter text-base leading-[1.9] ${
              premium ? "text-white/65" : "text-body"
            }`}
          >
            {description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="relative aspect-video w-full overflow-hidden rounded-2xl"
        >
          <div className="absolute inset-0">
            <GradientPlaceholder watermark="Video coming soon" className="rounded-2xl" />
          </div>
          <div className="absolute inset-0">
            <VideoWithFallback src={video} className="rounded-2xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
