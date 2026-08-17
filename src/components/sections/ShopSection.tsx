"use client";

import { m } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { DbProduct } from "@/types";
import { GradientPlaceholder } from "@/components/ui/MediaWithFallback";
import { useCart } from "@/context/CartContext";
import NotifyMeForm from "@/components/ui/NotifyMeForm";
import { getProductCta } from "@/components/sections/shop/ProductStatusBadge";

export default function ShopSection({ products }: { products: DbProduct[] }) {
  const featured = products.slice(0, 3);
  const { addToCart } = useCart();

  if (featured.length === 0) return null;

  return (
    <section id="shop" className="relative bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:items-end md:gap-0">
          <h2 className="text-center font-cormorant text-[32px] font-semibold text-ink md:text-left md:text-[48px]">
            SHOP TO ELEV8
          </h2>
          <Link
            href="/shop"
            className="group flex items-center justify-center gap-1 font-inter text-[12px] font-medium uppercase tracking-[0.15em] text-violet"
          >
            View all
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product, i) => {
            const cta = getProductCta(product.status);
            return (
              <m.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                whileHover={{ y: -6 }}
                className="group flex flex-col overflow-hidden rounded-[16px] glass-card-light p-5 transition-shadow hover:shadow-[0_20px_50px_rgba(107,47,160,0.14)]"
              >
                <Link
                  href={`/shop/${product.slug}`}
                  className="relative h-[280px] overflow-hidden rounded-xl"
                >
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <GradientPlaceholder watermark="ELEV8 WATER" className="rounded-xl" />
                  )}
                  {product.status === "sold-out" && (
                    <span className="absolute left-4 top-4 rounded-full border border-violet px-3 py-1 font-inter text-[10px] font-semibold uppercase tracking-[0.15em] text-violet">
                      Sold Out
                    </span>
                  )}
                </Link>

                <Link href={`/shop/${product.slug}`}>
                  <h3 className="mt-5 font-cormorant text-[24px] leading-tight text-ink">
                    {product.name}
                  </h3>
                </Link>
                <p className="mt-2 font-inter text-[22px] font-bold text-violet">
                  ${product.price.toFixed(2)}
                </p>

                {product.status === "available" ? (
                  <button
                    onClick={() => addToCart(product.id)}
                    className="group/btn mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-brand px-6 py-3 font-inter text-[11px] font-semibold uppercase tracking-[0.15em] text-white btn-glow"
                  >
                    {cta.label}
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover/btn:translate-x-1"
                    />
                  </button>
                ) : product.status === "sold-out" ? (
                  <NotifyMeForm label={cta.label} source="homepage-shop" className="mt-5" />
                ) : (
                  <Link
                    href={`/shop/${product.slug}`}
                    className="group/btn mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-brand px-6 py-3 font-inter text-[11px] font-semibold uppercase tracking-[0.15em] text-white btn-glow"
                  >
                    {cta.label}
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover/btn:translate-x-1"
                    />
                  </Link>
                )}
              </m.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
