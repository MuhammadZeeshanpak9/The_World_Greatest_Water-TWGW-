"use client";

import { useState } from "react";
import { SHOP_PRODUCTS } from "@/data/content";
import type { ProductCategory } from "@/types";
import ProductCard from "./ProductCard";

const FILTERS: ("ALL" | ProductCategory)[] = [
  "ALL",
  "Water Bottles",
  "Essence Pods",
  "Smart Bottles",
  "Gift Cards",
];

export default function ShopCatalog() {
  const [selected, setSelected] = useState<"ALL" | ProductCategory>("ALL");

  const visible =
    selected === "ALL"
      ? SHOP_PRODUCTS
      : SHOP_PRODUCTS.filter((p) => p.category === selected);

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div
          className="sticky top-[100px] z-40 -mx-6 flex flex-wrap gap-2 border-b border-violet/10 bg-white/90 px-6 py-4 backdrop-blur-md"
        >
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelected(filter)}
              className={`rounded-full border px-4 py-2 font-inter text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors ${
                selected === filter
                  ? "border-violet bg-violet text-white"
                  : "border-violet/20 text-body hover:border-violet hover:text-violet"
              }`}
            >
              {filter === "ALL" ? "All" : filter}
            </button>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((product, i) => (
            <ProductCard key={product.slug} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
