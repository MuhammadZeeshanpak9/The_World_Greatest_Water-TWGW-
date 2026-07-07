import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";
import BenefitCards from "@/components/sections/creators/BenefitCards";
import ApplyForm from "@/components/sections/creators/ApplyForm";

const DARK = "#0a0a0a";
const WHITE = "#ffffff";
const TINT = "#f0e8f8";

export const metadata = {
  title: "Creators",
  description: "Join the ELEV8 movement — become an affiliate, partner with the brand, and grow together.",
};

export default function CreatorsPage() {
  return (
    <main>
      <Navbar />

      <PageHero variant="dark" title="CREATORS" subtitle="Join the ELEV8 Movement" />
      <WaveTransition fromColor={DARK} toColor={WHITE} variant={2} animated />

      <BenefitCards />
      <WaveTransition fromColor={WHITE} toColor={TINT} variant={1} />

      <ApplyForm />

      <Footer />
    </main>
  );
}
