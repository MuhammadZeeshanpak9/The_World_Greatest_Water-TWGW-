import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";
import CartContents from "@/components/sections/CartContents";

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

      <CartContents />

      <Footer />
    </main>
  );
}
