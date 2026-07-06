"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

export default function OrderConfirmation() {
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const digits = Math.floor(100000 + Math.random() * 900000);
      setOrderNumber(`#ELEV8-${digits}`);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto flex max-w-lg flex-col items-center px-6 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-violet text-white">
          <Check size={36} />
        </span>

        <h1 className="mt-8 font-cormorant text-[40px] text-ink md:text-[48px]">
          Your order has been confirmed!
        </h1>

        {orderNumber && (
          <p className="mt-4 font-inter text-[15px] font-semibold uppercase tracking-[0.15em] text-violet">
            Order {orderNumber}
          </p>
        )}

        <p className="mt-6 font-inter text-base text-body">
          A confirmation email will be sent to your email address
        </p>
        <p className="mt-2 font-inter text-[14px] text-muted">
          Estimated delivery: 5-7 business days
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/shop"
            className="group flex items-center gap-2 rounded bg-violet px-8 py-3.5 font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-white transition-transform duration-300 hover:scale-[1.02]"
          >
            Continue Shopping
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/account"
            className="group flex items-center gap-2 rounded border border-violet px-8 py-3.5 font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-violet transition-colors hover:bg-violet hover:text-white"
          >
            My Account
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
