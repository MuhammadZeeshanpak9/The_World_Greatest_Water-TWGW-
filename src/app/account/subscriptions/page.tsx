import { RefreshCw } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";
import EmptyState from "@/components/ui/EmptyState";

const WHITE = "#ffffff";
const TINT = "#f0e8f8";

export const metadata = {
  title: "My Subscriptions",
  description: "Manage your ELEV8 WATER subscription deliveries.",
};

export default function AccountSubscriptionsPage() {
  return (
    <main>
      <Navbar />

      <PageHero variant="light" title="MY SUBSCRIPTIONS" subtitle="MANAGE YOUR DELIVERIES" />
      <WaveTransition fromColor={TINT} toColor={WHITE} variant={3} />

      <EmptyState
        icon={RefreshCw}
        heading="No active subscriptions"
        description="Subscribe to ELEV8 WATER for regular deliveries"
        ctaLabel="SUBSCRIBE NOW"
        ctaHref="/subscription"
      />

      <Footer />
    </main>
  );
}
