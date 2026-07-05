import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";
import OpeningQuote from "@/components/sections/our-story/OpeningQuote";
import BrandStory from "@/components/sections/our-story/BrandStory";
import Pillars from "@/components/sections/our-story/Pillars";
import VisionMission from "@/components/sections/our-story/VisionMission";
import PurificationStory from "@/components/sections/our-story/PurificationStory";
import EmotoQuote from "@/components/sections/our-story/EmotoQuote";

const WHITE = "#ffffff";
const TINT = "#f0e8f8";
const DARK = "#0a0a0a";

export const metadata = {
  title: "Our Story — ELEV8 WATER",
};

export default function OurStoryPage() {
  return (
    <main>
      <Navbar />

      <PageHero variant="dark" title="OUR STORY" />
      <WaveTransition fromColor={DARK} toColor={WHITE} variant={2} animated />

      <OpeningQuote />

      <BrandStory />
      <WaveTransition fromColor={WHITE} toColor={TINT} variant={1} />

      <Pillars />
      <WaveTransition fromColor={TINT} toColor={WHITE} variant={3} />

      <VisionMission />
      <WaveTransition fromColor={WHITE} toColor={DARK} variant={2} animated />

      <PurificationStory />
      <WaveTransition fromColor={DARK} toColor={TINT} variant={1} animated />

      <EmotoQuote />

      <Footer />
    </main>
  );
}
