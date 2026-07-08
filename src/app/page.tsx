import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WaveTransition from "@/components/ui/WaveTransition";
import Hero from "@/components/sections/Hero";
import WaveCollection from "@/components/sections/WaveCollection";
import Wellness from "@/components/sections/Wellness";
import ProductBanner from "@/components/sections/ProductBanner";
import OurStory from "@/components/sections/OurStory";
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

const TwelveBottles = dynamic(() => import("@/components/sections/TwelveBottles"), {
  loading: () => <div className="h-[720px] w-full bg-gradient-hero" aria-hidden />,
});

const DESCRIPTION =
  "Ultra-purified water infused with 528hz binaural frequency. 1 Water. 12 Understanding. ELEV8 your life.";

export const metadata: Metadata = {
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: "THE WORLD'S GREATEST WATER — ELEV8 WATER",
    description: DESCRIPTION,
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "THE WORLD'S GREATEST WATER — ELEV8 WATER",
    description: DESCRIPTION,
  },
};

export default function Home() {
  return (
    <main>
      <Navbar />

      <Hero />

      <WaveCollection />

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
