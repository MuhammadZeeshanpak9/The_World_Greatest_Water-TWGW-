"use client";

import { m } from "framer-motion";
import { Building2, Globe2, Store } from "lucide-react";

// Real retailer partnerships aren't live yet — these are the 3 categories
// we're actively pursuing, shown honestly as "coming soon" rather than as
// 3 unlabeled placeholder boxes. Once real retailers sign on, replace each
// entry's icon/description with that retailer's own name/logo/location (a
// future map view would also live here once we have a maps API key and
// real retailer address data).
const CATEGORIES = [
  {
    icon: Store,
    name: "Local Shops",
    text: "Boutiques and wellness stores carrying ELEV8 WATER near you",
  },
  {
    icon: Building2,
    name: "Major Retailers",
    text: "National and big-box retail partnerships in the works",
  },
  {
    icon: Globe2,
    name: "International Partners",
    text: "Bringing ELEV8 WATER to retailers beyond the U.S.",
  },
];

export default function RetailerCards() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {CATEGORIES.map((c, i) => (
            <m.div
              key={c.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="flex flex-col items-center rounded-[20px] border border-violet/10 p-8 text-center"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-violet/10 text-violet">
                <c.icon size={26} />
              </span>
              <h3 className="mt-6 font-inter text-[13px] font-semibold uppercase tracking-[0.2em] text-ink">
                {c.name}
              </h3>
              <p className="mt-2 font-inter text-[14px] text-body">{c.text}</p>
              <span className="mt-4 inline-block rounded-full bg-violet/10 px-3 py-1 font-inter text-[10px] font-semibold uppercase tracking-[0.2em] text-violet">
                Coming Soon
              </span>
            </m.div>
          ))}
        </div>
        <p className="mt-10 text-center font-inter text-[14px] text-body">
          Own a store or represent a retailer? Tell us below — we&apos;d love to
          partner with you.
        </p>

        {/* Placeholder map while real retailer locations/API key are pending */}
        <div className="mt-12 overflow-hidden rounded-[20px] border border-violet/10">
          <iframe
            title="ELEV8 WATER retailer map (placeholder — real locations coming soon)"
            src="https://www.google.com/maps?q=United+States&output=embed"
            width="100%"
            height="360"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <p className="mt-3 text-center font-inter text-[12px] text-body/70">
          Retailer locations coming soon — map will update once partner stores are confirmed.
        </p>
      </div>
    </section>
  );
}
