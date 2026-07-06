import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";
import OrderConfirmation from "@/components/sections/checkout/OrderConfirmation";

const WHITE = "#ffffff";
const TINT = "#f0e8f8";

export const metadata = {
  title: "Order Confirmed — ELEV8 WATER",
};

export default function CheckoutConfirmationPage() {
  return (
    <main>
      <Navbar />

      <PageHero variant="light" title="ORDER CONFIRMED" subtitle="THANK YOU FOR YOUR PURCHASE" />
      <WaveTransition fromColor={TINT} toColor={WHITE} variant={3} />

      <OrderConfirmation />

      <Footer />
    </main>
  );
}
