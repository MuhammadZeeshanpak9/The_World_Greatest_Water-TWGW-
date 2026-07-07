import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";
import NumberedSteps from "@/components/ui/NumberedSteps";
import GiftTiers from "@/components/sections/gift-cards/GiftTiers";
import GiftMessageForm from "@/components/sections/gift-cards/GiftMessageForm";
import { GIFT_STEPS } from "@/data/content";

const WHITE = "#ffffff";
const TINT = "#f0e8f8";

export const metadata = {
  title: "Love Gift",
  description: "Give the gift of elevation — ELEV8 WATER gift cards.",
};

export default function GiftCardsPage() {
  return (
    <main>
      <Navbar />

      <PageHero variant="light" title="LOVE GIFT" subtitle="GIVE THE GIFT OF ELEVATION" />
      <WaveTransition fromColor={TINT} toColor={WHITE} variant={3} />

      <GiftTiers />
      <WaveTransition fromColor={WHITE} toColor={TINT} variant={1} />

      <NumberedSteps heading="How Gift Cards Work" steps={GIFT_STEPS} />
      <WaveTransition fromColor={TINT} toColor={WHITE} variant={1} />

      <GiftMessageForm />

      <Footer />
    </main>
  );
}
