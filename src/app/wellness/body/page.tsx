import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";
import ServiceOverview from "@/components/sections/wellness/ServiceOverview";
import FeatureGrid from "@/components/sections/wellness/FeatureGrid";
import BookingSection from "@/components/sections/wellness/BookingSection";
import { WELLNESS_SUBPAGES } from "@/data/content";

const WHITE = "#ffffff";
const TINT = "#f0e8f8";
const DARK = "#0a0a0a";

const data = WELLNESS_SUBPAGES.find((w) => w.slug === "body")!;

export const metadata = {
  title: "Thank You Body",
  description: data.description,
};

export default function WellnessBodyPage() {
  return (
    <main>
      <Navbar />

      <PageHero variant="dark" title={data.title} subtitle={data.subtitle} />
      <WaveTransition fromColor={DARK} toColor={WHITE} variant={2} animated />

      <ServiceOverview
        price={data.price}
        description={data.description}
        video={data.video}
        tone="standard"
      />
      <WaveTransition fromColor={WHITE} toColor={TINT} variant={1} />

      <FeatureGrid features={data.features} tone="standard" />
      <WaveTransition fromColor={TINT} toColor={DARK} variant={2} />

      <BookingSection
        heading={data.bookingHeading}
        body={data.bookingBody}
        ctaLabel={data.ctaLabel}
        ctaHref="/contact"
        tone="standard"
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
