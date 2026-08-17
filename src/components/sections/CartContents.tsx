"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

export default function CartContents() {
  const { items, total, loading, error, updateQuantity, removeFromCart } = useCart();

  if (loading) {
    return (
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-3xl space-y-4 px-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-violet/5" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white py-24 text-center md:py-32">
        <p className="font-inter text-red-600">
          Unable to load your cart right now. Please try again later.
        </p>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto flex max-w-md flex-col items-center px-6 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-violet/10 text-violet">
            <ShoppingBag size={32} />
          </span>
          <h2 className="mt-8 font-cormorant text-[32px] text-ink">Your cart is empty</h2>
          <p className="mt-3 font-inter text-[15px] leading-relaxed text-body">
            Looks like you haven&apos;t added anything yet. Explore ELEV8 WATER and find
            something to elevate your life.
          </p>
          <Link
            href="/shop"
            className="group mt-8 flex items-center gap-2 rounded bg-violet px-8 py-3 font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-white transition-transform duration-300 hover:scale-[1.02]"
          >
            Continue Shopping
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-2xl glass-card-light p-4"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-violet/5">
                {item.product?.image_url && (
                  <Image
                    src={item.product.image_url}
                    alt={item.product.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-cormorant text-[20px] text-ink">
                  {item.product?.name ?? "Product"}
                </p>
                <p className="mt-1 font-inter text-[14px] text-violet">
                  {formatCurrency(item.price_snapshot)}
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-violet/15 px-2 py-1">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  aria-label="Decrease quantity"
                  className="flex h-6 w-6 items-center justify-center text-violet"
                >
                  <Minus size={13} />
                </button>
                <span className="w-5 text-center font-inter text-[13px] text-ink">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  disabled={item.quantity >= 10}
                  aria-label="Increase quantity"
                  className="flex h-6 w-6 items-center justify-center text-violet disabled:opacity-30"
                >
                  <Plus size={13} />
                </button>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                aria-label="Remove item"
                className="text-muted hover:text-red-600"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="rounded-[20px] glass-card-light p-6">
          <h3 className="font-cormorant text-[22px] text-ink">Order Summary</h3>
          <div className="mt-6 flex flex-col gap-3 border-t border-violet/10 pt-6">
            <div className="flex items-center justify-between font-inter text-[13px] text-body">
              <span>Subtotal</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-violet/10 pt-3 font-inter text-[15px] font-semibold text-ink">
              <span>Total</span>
              <span className="text-violet">{formatCurrency(total)}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="group mt-6 flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-gradient-brand btn-glow font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-white transition-transform duration-300 hover:scale-[1.01]"
          >
            Checkout
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
