import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";
import IntelligentCollectionCarousel from "@/components/sections/intelligent-collection/IntelligentCollectionCarousel";
import NotifyMeForm from "@/components/ui/NotifyMeForm";
import { SITE_TAGLINE } from "@/data/content";

const DARK = "#0a0a0a";
const WHITE = "#ffffff";

export const metadata = {
  title: "Intelligent Collection",
  description: "The ELEV8 Intelligent Collection — one for each of the 12 understandings of SELF.",
};

export default function IntelligentCollectionPage() {
  return (
    <main>
      <Navbar />

      <PageHero
        variant="dark"
        eyebrow="ELEV8 INTELLIGENT COLLECTION"
        title="INTELLIGENT COLLECTION"
        subtitle={SITE_TAGLINE}
      />
      <WaveTransition fromColor={DARK} toColor={WHITE} variant={2} animated />

      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <p className="mx-auto max-w-xl text-center font-inter text-base text-body">
            Details coming soon — one for each of the 12 self-development understandings.
          </p>
          <div className="mt-10">
            <IntelligentCollectionCarousel />
          </div>

          <div className="mt-14 flex flex-col items-center gap-3 text-center">
            <p className="font-inter text-[13px] text-body">
              Be the first to know when the Intelligent Collection launches.
            </p>
            <NotifyMeForm source="intelligent-collection" />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
