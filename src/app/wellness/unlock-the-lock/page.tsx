import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";
import ServiceOverview from "@/components/sections/wellness/ServiceOverview";
import FeatureGrid from "@/components/sections/wellness/FeatureGrid";
import BookingSection from "@/components/sections/wellness/BookingSection";
import { WELLNESS_SUBPAGES } from "@/data/content";

const DARK = "#0a0a0a";
const DARK_VIOLET = "#1a0a2e";

const data = WELLNESS_SUBPAGES.find((w) => w.slug === "unlock-the-lock")!;

export const metadata = {
  title: "Unlock The Lock",
  description: data.description,
};

export default function WellnessUnlockTheLockPage() {
  return (
    <main>
      <Navbar />

      <PageHero variant="dark" title={data.title} subtitle={data.subtitle} />

      <ServiceOverview
        price={data.price}
        description={data.description}
        video={data.video}
        tone="premium"
      />
      <WaveTransition fromColor={DARK} toColor={DARK_VIOLET} variant={2} />

      <FeatureGrid features={data.features} tone="premium" />
      <WaveTransition fromColor={DARK_VIOLET} toColor={DARK} variant={1} />

      <BookingSection
        heading={data.bookingHeading}
        body={data.bookingBody}
        ctaLabel={data.ctaLabel}
        ctaHref="/contact"
        tone="premium"
        showCalendar={data.showCalendar}
        pricingLabel={data.pricingLabel}
        price1yr={data.price1yr}
        price2yr={data.price2yr}
        pricingNote={data.pricingNote}
      />

      <Footer />
    </main>
  );
}
