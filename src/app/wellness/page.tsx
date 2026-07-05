import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";
import Philosophy from "@/components/sections/wellness/Philosophy";
import ServiceCards from "@/components/sections/wellness/ServiceCards";
import SignupCta from "@/components/sections/wellness/SignupCta";

const WHITE = "#ffffff";
const TINT = "#f0e8f8";
const DARK = "#0a0a0a";
const DARK_VIOLET = "#1a0a2e";

export const metadata = {
  title: "Wellness — ELEV8 WATER",
};

export default function WellnessPage() {
  return (
    <main>
      <Navbar />

      <PageHero
        variant="dark"
        title="WELLNESS"
        subtitle="With You In Mind"
        youtube={{ url: "https://www.youtube.com/embed/ARExiOc5Ez8" }}
      />
      <WaveTransition fromColor={DARK} toColor={WHITE} variant={2} animated />

      <Philosophy />
      <WaveTransition fromColor={WHITE} toColor={TINT} variant={1} />

      <ServiceCards />
      <WaveTransition fromColor={TINT} toColor={DARK_VIOLET} variant={2} />

      <SignupCta />

      <Footer />
    </main>
  );
}
