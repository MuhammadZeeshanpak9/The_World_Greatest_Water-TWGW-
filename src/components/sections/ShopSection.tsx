"use client";

import { m } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SHOP_PRODUCTS } from "@/data/content";
import { GradientPlaceholder } from "@/components/ui/MediaWithFallback";

const FEATURED = SHOP_PRODUCTS.slice(0, 3);

export default function ShopSection() {
  return (
    <section id="shop" className="relative bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between">
          <h2 className="font-cormorant text-[36px] font-semibold text-ink md:text-[48px]">
            SHOP TO ELEV8
          </h2>
          <Link
            href="/shop"
            className="group flex items-center gap-1 font-inter text-[12px] font-medium uppercase tracking-[0.15em] text-violet"
          >
            View all
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED.map((product, i) => (
            <m.div
              key={product.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              whileHover={{ y: -6 }}
              className="group flex flex-col overflow-hidden rounded-[16px] transition-shadow hover:shadow-[0_20px_50px_rgba(107,47,160,0.14)] glass-card-light p-5"
            >
              <div className="relative h-[280px] overflow-hidden rounded-xl">
                <GradientPlaceholder watermark="ELEV8 WATER" className="rounded-xl" />
                {product.status === "sold-out" && (
                  <span className="absolute left-4 top-4 rounded-full border border-violet px-3 py-1 font-inter text-[10px] font-semibold uppercase tracking-[0.15em] text-violet">
                    Sold Out
                  </span>
                )}
              </div>

              <h3 className="mt-5 font-cormorant text-[24px] leading-tight text-ink">
                {product.name}
              </h3>
              <p className="mt-2 font-inter text-[22px] font-bold text-violet">
                {product.price}
              </p>

              <Link
                href={`/shop/${product.slug}`}
                className="group/btn mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-brand px-6 py-3 font-inter text-[11px] font-semibold uppercase tracking-[0.15em] text-white btn-glow"
              >
                {product.cta}
                <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
