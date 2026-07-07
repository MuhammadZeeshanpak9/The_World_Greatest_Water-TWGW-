import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";
import ShippingInfo from "@/components/sections/shipping/ShippingInfo";

const WHITE = "#ffffff";
const TINT = "#f0e8f8";

export const metadata = {
  title: "Shipping & Delivery",
  description: "Shipping rates, delivery windows, and friendly assist for ELEV8 WATER orders.",
};

export default function ShippingPage() {
  return (
    <main>
      <Navbar />

      <PageHero variant="light" title="SHIPPING & DELIVERY" subtitle="FRIENDLY ASSIST" />
      <WaveTransition fromColor={TINT} toColor={WHITE} variant={3} />

      <ShippingInfo />

      <Footer />
    </main>
  );
}
