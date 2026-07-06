import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";
import CheckoutFlow from "@/components/sections/checkout/CheckoutFlow";

const WHITE = "#ffffff";
const TINT = "#f0e8f8";

export const metadata = {
  title: "Checkout — ELEV8 WATER",
};

export default function CheckoutPage() {
  return (
    <main>
      <Navbar />

      <PageHero variant="light" title="CHECKOUT" subtitle="COMPLETE YOUR ORDER" />
      <WaveTransition fromColor={TINT} toColor={WHITE} variant={3} />

      <CheckoutFlow />

      <Footer />
    </main>
  );
}
