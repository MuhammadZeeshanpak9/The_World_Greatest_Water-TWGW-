import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";
import AccountStats from "@/components/sections/account/AccountStats";
import AccountQuickLinks from "@/components/sections/account/AccountQuickLinks";

const WHITE = "#ffffff";
const TINT = "#f0e8f8";

export const metadata = {
  title: "My Account",
  description: "Your ELEV8 WATER account dashboard — orders, subscriptions, and courses.",
};

export default function AccountPage() {
  return (
    <main>
      <Navbar />

      <PageHero variant="light" title="MY ACCOUNT" subtitle="YOUR ELEV8 JOURNEY" />
      <WaveTransition fromColor={TINT} toColor={WHITE} variant={3} />

      <AccountStats />
      <WaveTransition fromColor={WHITE} toColor={TINT} variant={1} />

      <AccountQuickLinks />

      <Footer />
    </main>
  );
}
