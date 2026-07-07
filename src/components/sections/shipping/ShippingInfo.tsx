"use client";

import { m } from "framer-motion";
import { SHIPPING_INFO } from "@/data/content";

export default function ShippingInfo() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {SHIPPING_INFO.map((info, i) => (
            <m.div
              key={info.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="rounded-[20px] border border-violet/10 p-8 text-center"
            >
              <h3 className="font-inter text-[13px] font-semibold uppercase tracking-[0.2em] text-ink">
                {info.title}
              </h3>
              <p className="mt-3 font-cormorant text-[24px] text-violet">{info.value}</p>
            </m.div>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-2xl text-center">
          <p className="font-inter text-base leading-[1.9] text-body">
            Free shipping on all domestic orders over $75. We proudly deliver ELEV8 WATER and
            wellness products worldwide — shipping rates and delivery windows are calculated at
            checkout based on destination and order weight.
          </p>
        </div>
      </div>
    </section>
  );
}
