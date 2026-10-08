"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import type { DbProduct } from "@/types";
import ProductCard from "./ProductCard";

export default function ShopCatalog({ products }: { products: DbProduct[] }) {
  const [selected, setSelected] = useState("ALL");

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products],
  );

  const visible =
    selected === "ALL" ? products : products.filter((p) => p.category === selected);

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="sticky top-[100px] z-40 -mx-6 flex flex-wrap gap-2 border-b border-violet/10 bg-white/90 px-6 py-4 backdrop-blur-md">
          <button
            onClick={() => setSelected("ALL")}
            className={`rounded-full border px-4 py-2 font-inter text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors ${
              selected === "ALL"
                ? "border-violet bg-violet text-white"
                : "border-violet/20 text-body hover:border-violet hover:text-violet"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelected(cat)}
              className={`rounded-full border px-4 py-2 font-inter text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors ${
                selected === cat
                  ? "border-violet bg-violet text-white"
                  : "border-violet/20 text-body hover:border-violet hover:text-violet"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-violet/10 bg-violet/5 px-6 py-4">
          <p className="font-inter text-[13px] text-body">
            Looking for bulk pricing? We can help with larger orders.
          </p>
          <Link
            href={`/contact?subject=${encodeURIComponent("Bulk order inquiry")}`}
            className="group flex shrink-0 items-center gap-2 rounded-full border border-violet/30 px-5 py-2 font-inter text-[11px] font-semibold uppercase tracking-[0.15em] text-violet transition-colors hover:border-violet hover:bg-violet/10"
          >
            <MessageCircle size={14} />
            Inquire For Bulk Orders
          </Link>
        </div>

        {visible.length === 0 ? (
          <p className="mt-16 text-center font-inter text-body">No products found.</p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((product, i) => (
              <ProductCard key={product.slug} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
