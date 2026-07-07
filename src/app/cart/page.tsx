import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";

const TINT = "#f0e8f8";
const WHITE = "#ffffff";

export const metadata = {
  title: "Your Cart",
  description: "Review your ELEV8 WATER order before checkout.",
};

export default function CartPage() {
  return (
    <main>
      <Navbar />

      <PageHero variant="light" title="YOUR CART" />
      <WaveTransition fromColor={TINT} toColor={WHITE} variant={3} />

      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto flex max-w-md flex-col items-center px-6 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-violet/10 text-violet">
            <ShoppingBag size={32} />
          </span>
          <h2 className="mt-8 font-cormorant text-[32px] text-ink">
            Your cart is empty
          </h2>
          <p className="mt-3 font-inter text-[15px] leading-relaxed text-body">
            Looks like you haven&apos;t added anything yet. Explore ELEV8 WATER
            and find something to elevate your life.
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

      <Footer />
    </main>
  );
}
