"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

export default function OrderConfirmation() {
  const router = useRouter();
  const [orderNumber] = useState<string | null>(() =>
    typeof window === "undefined" ? null : sessionStorage.getItem("elev8_order_number"),
  );

  useEffect(() => {
    if (!orderNumber) {
      router.replace("/");
      return;
    }
    sessionStorage.removeItem("elev8_order_number");
  }, [orderNumber, router]);

  if (!orderNumber) return null;

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto flex max-w-lg flex-col items-center px-6 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-violet text-white">
          <Check size={36} />
        </span>

        <h1 className="mt-8 font-cormorant text-[40px] text-ink md:text-[48px] text-glow-violet">
          Your order has been confirmed!
        </h1>

        <p className="mt-4 font-inter text-[15px] font-semibold uppercase tracking-[0.15em] text-violet">
          Order {orderNumber}
        </p>

        <p className="mt-6 font-inter text-base text-body">Check your email for confirmation</p>
        <p className="mt-2 font-inter text-[14px] text-muted">
          Estimated delivery: 5-7 business days
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/account/orders"
            className="group flex items-center gap-2 rounded-full bg-gradient-brand btn-glow px-8 py-3.5 font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-white transition-transform duration-300 hover:scale-[1.02]"
          >
            My Orders
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/shop"
            className="group flex items-center gap-2 rounded-full bg-gradient-brand  px-8 py-3.5 font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-white btn-glow transition-transform hover:scale-[1.02]"
          >
            Continue Shopping
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
