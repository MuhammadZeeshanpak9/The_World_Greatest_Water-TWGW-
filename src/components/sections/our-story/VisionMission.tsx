"use client";

import { m } from "framer-motion";

export default function VisionMission() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-14 px-6 text-center">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-cormorant text-[42px] text-violet">Our Vision</h2>
          <p className="mt-4 font-inter text-base leading-[1.9] text-body">
            To create a brand that will positively impact the world and every
            individual to aspire for more enjoyable life experiences in this
            beautiful GRAND DESIGN called LIFE.
          </p>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          <h2 className="font-cormorant text-[42px] text-violet">Our Mission</h2>
          <p className="mt-4 font-inter text-base leading-[1.9] text-body">
            To ELEV8 YOUR LIFE.
          </p>
        </m.div>
      </div>
    </section>
  );
}
