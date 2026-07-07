"use client";

import { m } from "framer-motion";

const PILLARS = [
  {
    name: "The Imagination",
    text: "To create a universal product from the profound spiritual and physical understanding of SELF. YOU. to visibly improve the quality of life for YOU. MYSELF.",
  },
  {
    name: "The Desire (Our Brand)",
    text: "The desire and the intention of our brand The World's Greatest Water is to add true value to your life with a product ELEV8 WATER. We are committed to providing the individual a medium to develop the true understanding of SELF. YOU.",
  },
  {
    name: "The Believe",
    text: "There will never be another 'THE WORLD'S GREATEST WATER'. This is our affirmation and TRUTH creating the desire for us to constantly be the greatest in the industry.",
  },
];

export default function Pillars() {
  return (
    <section className="bg-violet-tint py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 md:grid-cols-3">
        {PILLARS.map((p, i) => (
          <m.div
            key={p.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="rounded-[20px] glass-card-light p-8"
          >
            <h3 className="font-inter text-[13px] font-semibold uppercase tracking-[0.25em] text-violet">
              {p.name}
            </h3>
            <p className="mt-5 font-inter text-[15px] leading-[1.85] text-body">
              {p.text}
            </p>
          </m.div>
        ))}
      </div>
    </section>
  );
}
