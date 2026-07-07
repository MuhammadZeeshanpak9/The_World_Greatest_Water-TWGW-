import { Box } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";
import EmptyState from "@/components/ui/EmptyState";

const WHITE = "#ffffff";
const TINT = "#f0e8f8";

export const metadata = {
  title: "My Orders",
  description: "Your ELEV8 WATER order history.",
};

export default function AccountOrdersPage() {
  return (
    <main>
      <Navbar />

      <PageHero variant="light" title="MY ORDERS" subtitle="ORDER HISTORY" />
      <WaveTransition fromColor={TINT} toColor={WHITE} variant={3} />

      <EmptyState
        icon={Box}
        heading="No orders yet"
        description="Your order history will appear here once you make your first purchase"
        ctaLabel="SHOP NOW"
        ctaHref="/shop"
      />

      <Footer />
    </main>
  );
}
