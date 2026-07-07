import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";
import PolicySections from "@/components/ui/PolicySections";
import { PRIVACY_POLICY_SECTIONS } from "@/data/content";

const WHITE = "#ffffff";
const TINT = "#f0e8f8";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for THE WORLD'S GREATEST WATER.",
};

export default function PrivacyPolicyPage() {
  return (
    <main>
      <Navbar />

      <PageHero variant="light" title="PRIVACY POLICY" />
      <WaveTransition fromColor={TINT} toColor={WHITE} variant={3} />

      <PolicySections lastUpdated="January 1, 2026" sections={PRIVACY_POLICY_SECTIONS} />

      <Footer />
    </main>
  );
}
