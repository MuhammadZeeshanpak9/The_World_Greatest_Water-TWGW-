import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";
import OfferingBlock from "@/components/sections/wellness/OfferingBlock";
import { WELLNESS_SUBPAGES } from "@/data/content";

const WHITE = "#ffffff";
const DARK = "#0a0a0a";

const data = WELLNESS_SUBPAGES.find((w) => w.slug === "mind")!;

export const metadata = {
  title: "Thank You Mind",
  description: data.description,
};

export default function WellnessMindPage() {
  return (
    <main>
      <Navbar />

      <PageHero variant="dark" title={data.title} subtitle={data.subtitle} />
      <WaveTransition fromColor={DARK} toColor={WHITE} variant={2} animated />

      {data.offerings?.map((offering) => (
        <OfferingBlock key={offering.heading} {...offering} />
      ))}

      <div className="bg-white pb-20 md:pb-28">
        <p className="mx-auto max-w-xl px-6 text-center font-cormorant text-[22px] italic text-violet">
          Thank you for choosing to ELEV8 YOU and the world inside YOU.
        </p>
      </div>
      <WaveTransition fromColor={WHITE} toColor={DARK} variant={2} />

      <Footer />
    </main>
  );
}
