import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WaveTransition from "@/components/ui/WaveTransition";
import Hero from "@/components/sections/Hero";
import Wellness from "@/components/sections/Wellness";
import ProductBanner from "@/components/sections/ProductBanner";
import OurStory from "@/components/sections/OurStory";
import TwelveBottles from "@/components/sections/TwelveBottles";
import ShopSection from "@/components/sections/ShopSection";
import ScientificProcess from "@/components/sections/ScientificProcess";
import WhyElev8 from "@/components/sections/WhyElev8";
import ComingSoon from "@/components/sections/ComingSoon";
import Testimonials from "@/components/sections/Testimonials";
import Trending from "@/components/sections/Trending";

// palette shortcuts for wave colors
const WHITE = "#ffffff";
const TINT = "#f0e8f8";
const DARK = "#0a0a0a";
const DARK_VIOLET = "#1a0a2e";

export default function Home() {
  return (
    <main>
      <Navbar />

      <Hero />

      <Wellness />
      <WaveTransition fromColor={WHITE} toColor={TINT} variant={1} />

      <ProductBanner />
      <WaveTransition fromColor={TINT} toColor={WHITE} variant={3} />

      <OurStory />
      <WaveTransition fromColor={WHITE} toColor={DARK} variant={2} animated />

      <TwelveBottles />
      <WaveTransition fromColor={DARK} toColor={WHITE} variant={1} animated />

      <ShopSection />
      <WaveTransition fromColor={WHITE} toColor={TINT} variant={3} />

      <ScientificProcess />
      <WaveTransition fromColor={TINT} toColor={DARK_VIOLET} variant={2} />

      <WhyElev8 />
      <WaveTransition fromColor={DARK_VIOLET} toColor={WHITE} variant={1} animated />

      <ComingSoon />
      <WaveTransition fromColor={WHITE} toColor={TINT} variant={3} />

      <Testimonials />
      <WaveTransition fromColor={TINT} toColor={DARK} variant={2} animated />

      <Trending />

      <Footer />
    </main>
  );
}
