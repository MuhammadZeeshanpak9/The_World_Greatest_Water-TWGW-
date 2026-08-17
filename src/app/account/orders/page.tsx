import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";
import AccountOrdersList from "@/components/sections/account/AccountOrdersList";

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

      <AccountOrdersList />

      <Footer />
    </main>
  );
}
