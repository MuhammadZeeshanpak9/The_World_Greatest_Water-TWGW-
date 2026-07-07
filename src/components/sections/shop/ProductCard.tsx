"use client";

import { m } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/types";
import { GradientPlaceholder } from "@/components/ui/MediaWithFallback";
import ProductStatusBadge, { getProductCta } from "./ProductStatusBadge";

export default function ProductCard({ product, index }: { product: Product; index: number }) {
  const cta = getProductCta(product.status);

  return (
    <m.div
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      className="group flex flex-col overflow-hidden rounded-[16px] glass-card-light p-5 transition-shadow hover:shadow-[0_20px_50px_rgba(107,47,160,0.14)]"
    >
      <Link href={`/shop/${product.slug}`} className="relative h-[240px] overflow-hidden rounded-xl">
        <GradientPlaceholder watermark={product.name} className="rounded-xl" />
        <div className="absolute left-4 top-4">
          <ProductStatusBadge status={product.status} />
        </div>
      </Link>

      <p className="mt-5 font-inter text-[10px] uppercase tracking-[0.2em] text-muted">
        {product.category}
      </p>
      <Link href={`/shop/${product.slug}`}>
        <h3 className="mt-1 font-cormorant text-[22px] leading-tight text-ink hover:text-violet">
          {product.name}
        </h3>
      </Link>
      {product.subtitle && (
        <p className="font-inter text-[13px] text-body">{product.subtitle}</p>
      )}
      <div className="mt-2 flex items-baseline gap-2">
        <p className="font-inter text-[20px] font-bold text-violet">{product.price}</p>
        {product.perUnit && (
          <span className="font-inter text-[12px] text-muted">({product.perUnit})</span>
        )}
      </div>

      <button
        disabled={cta.disabled}
        className="group/btn mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-brand  px-6 py-3 font-inter text-[11px] font-semibold uppercase tracking-[0.15em] text-white btn-glow transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:border-muted/40 disabled:text-muted disabled:hover:bg-transparent"
      >
        {cta.label}
        <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
      </button>
    </m.div>
  );
}
