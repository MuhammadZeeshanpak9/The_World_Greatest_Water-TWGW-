"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { DbProduct } from "@/types";
import { GradientPlaceholder } from "@/components/ui/MediaWithFallback";
import { useCart } from "@/context/CartContext";
import NotifyMeForm from "@/components/ui/NotifyMeForm";
import ProductStatusBadge, { getProductCta } from "./ProductStatusBadge";

function formatPrice(price: number) {
  return `$${price.toFixed(2)}`;
}

export default function ProductDetail({ product }: { product: DbProduct }) {
  const cta = getProductCta(product.status);
  const { addToCart } = useCart();

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <Link
          href="/shop"
          className="group inline-flex items-center gap-2 font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-violet"
        >
          <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
          Back to Shop
        </Link>

        <div className="mt-8 grid grid-cols-1 items-start gap-12 md:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-2xl">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <GradientPlaceholder watermark={product.name} className="rounded-2xl" />
            )}
          </div>

          <div>
            <p className="font-inter text-[11px] uppercase tracking-[0.25em] text-muted">
              {product.category}
            </p>
            <h1 className="mt-2 font-cormorant text-[40px] leading-tight text-ink">
              {product.name}
            </h1>
            {product.subtitle && (
              <p className="mt-1 font-inter text-[15px] text-body">{product.subtitle}</p>
            )}

            <div className="mt-5 flex items-baseline gap-3">
              <p className="font-inter text-[28px] font-bold text-violet">
                {formatPrice(product.price)}
              </p>
              {product.per_unit && (
                <span className="font-inter text-[13px] text-muted">({product.per_unit})</span>
              )}
            </div>

            <div className="mt-4">
              <ProductStatusBadge status={product.status} />
            </div>

            {product.description && (
              <p className="mt-6 font-inter text-base leading-[1.9] text-body">
                {product.description}
              </p>
            )}

            {product.status === "available" ? (
              <button
                onClick={() => addToCart(product.id)}
                className="group mt-8 flex h-[52px] items-center justify-center gap-2 rounded-full bg-gradient-brand btn-glow px-8 font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-white transition-transform duration-300 hover:scale-[1.02]"
              >
                {cta.label}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            ) : product.status === "sold-out" ? (
              <NotifyMeForm label={cta.label} source="product-detail-sold-out" className="mt-8" />
            ) : (
              <button
                disabled
                className="mt-8 flex h-[52px] items-center justify-center gap-2 rounded-full bg-muted/40 px-8 font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-white disabled:cursor-not-allowed"
              >
                {cta.label}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
