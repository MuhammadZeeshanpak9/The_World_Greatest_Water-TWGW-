"use client";

import { m } from "framer-motion";

const PARAGRAPHS = [
  "How healthy or wealthy I become is a factor of my mental understanding of my MIND.",
  "THE WORLD'S GREATEST WATER. ELEV8 WATER is the number 1 self-development and wellness brand in the world for soo many obvious reasons.",
  "We are passionate about adding true value to the life of the consumers who choose to elev8 their lives for a greater life experience with a product ELEV8 WATER and it's successful wellness offerings.",
  "Individuals battle and struggle with all types of physical diseases, emotional conditions, lack, poverty and broken spirits mainly because they lack information and the awareness to the POWER OF THE MIND.",
  "MY MIND is all that exists in the HERE and NOW of this beautiful grand design called LIFE.",
  "THE WORLD'S GREATEST WATER. ELEV8 WATER has created powerful, successful and unique approach to mental health and wealth that is 100% guaranteed to provide the consumers with the opportunity to explore their mind to its greatest potential for one single purpose: FOR ME TO EXPERIENCE THE GREATEST VERSION OF MYSELF.",
];

export default function Philosophy() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[800px] px-6 text-center">
        <m.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-cormorant text-[36px] text-violet"
        >
          WELLNESS in the most simple form is a positive THOUGHT of well-being.
        </m.h2>

        <div className="mt-8 flex flex-col gap-5">
          {PARAGRAPHS.map((p, i) => (
            <m.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="font-inter text-base leading-[1.9] text-body"
            >
              {p}
            </m.p>
          ))}
        </div>
      </div>
    </section>
  );
}
