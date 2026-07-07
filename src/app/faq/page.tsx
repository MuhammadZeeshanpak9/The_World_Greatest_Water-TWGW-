import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";
import FaqSection from "@/components/sections/faq/FaqSection";

const WHITE = "#ffffff";
const TINT = "#f0e8f8";

export const metadata = {
  title: "Know More — FAQ",
  description: "Frequently asked questions about ELEV8 WATER.",
};

export default function FaqPage() {
  return (
    <main>
      <Navbar />

      <PageHero variant="light" title="KNOW MORE" subtitle="FREQUENTLY ASKED QUESTIONS" />
      <WaveTransition fromColor={TINT} toColor={WHITE} variant={3} />

      <FaqSection />

      <Footer />
    </main>
  );
}
