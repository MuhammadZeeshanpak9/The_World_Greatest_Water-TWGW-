import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Product } from "@/types";
import { GradientPlaceholder } from "@/components/ui/MediaWithFallback";
import ProductStatusBadge, { getProductCta } from "./ProductStatusBadge";

export default function ProductDetail({ product }: { product: Product }) {
  const cta = getProductCta(product.status);

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
            <GradientPlaceholder watermark={product.name} className="rounded-2xl" />
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
              <p className="font-inter text-[28px] font-bold text-violet">{product.price}</p>
              {product.perUnit && (
                <span className="font-inter text-[13px] text-muted">({product.perUnit})</span>
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

            <button
              disabled={cta.disabled}
              className="group mt-8 flex h-[52px] items-center justify-center gap-2 rounded-full bg-gradient-brand btn-glow px-8 font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-white transition-transform duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:bg-muted/40 disabled:hover:scale-100"
            >
              {cta.label}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
