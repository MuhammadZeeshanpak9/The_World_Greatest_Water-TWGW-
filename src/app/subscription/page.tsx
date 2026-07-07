import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";
import NumberedSteps from "@/components/ui/NumberedSteps";
import PlanComparison from "@/components/sections/subscription/PlanComparison";
import FaqStrip from "@/components/sections/subscription/FaqStrip";
import { SUBSCRIPTION_STEPS } from "@/data/content";

const WHITE = "#ffffff";
const TINT = "#f0e8f8";
const DARK = "#0a0a0a";

export const metadata = {
  title: "Subscribe To ELEV8",
  description: "Weekly or monthly ELEV8 WATER delivery — choose your plan.",
};

export default function SubscriptionPage() {
  return (
    <main>
      <Navbar />

      <PageHero variant="light" title="SUBSCRIBE TO ELEV8" subtitle="WEEKLY OR MONTHLY DELIVERY" />
      <WaveTransition fromColor={TINT} toColor={WHITE} variant={3} />

      <PlanComparison />
      <WaveTransition fromColor={WHITE} toColor={TINT} variant={1} />

      <NumberedSteps heading="How It Works" steps={SUBSCRIPTION_STEPS} />
      <WaveTransition fromColor={TINT} toColor={DARK} variant={2} />

      <FaqStrip />

      <Footer />
    </main>
  );
}
