import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";
import PolicySections from "@/components/ui/PolicySections";
import { TERMS_SECTIONS } from "@/data/content";

const WHITE = "#ffffff";
const TINT = "#f0e8f8";

export const metadata = {
  title: "Terms of Service — ELEV8 WATER",
};

export default function TermsPage() {
  return (
    <main>
      <Navbar />

      <PageHero variant="light" title="TERMS OF SERVICE" />
      <WaveTransition fromColor={TINT} toColor={WHITE} variant={3} />

      <PolicySections lastUpdated="January 1, 2026" sections={TERMS_SECTIONS} />

      <Footer />
    </main>
  );
}
