import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import OfferingBlock from "@/components/sections/wellness/OfferingBlock";
import DynamicCalBookingEmbed from "@/components/wellness/DynamicCalBookingEmbed";
import WellnessViewTracker from "@/components/analytics/WellnessViewTracker";
import { WELLNESS_SUBPAGES } from "@/data/content";

const data = WELLNESS_SUBPAGES.find((w) => w.slug === "unlock-the-lock")!;

/** Top tier — gold, the most premium offering (GO WITHIN). */
const TIER_COLOR = "#c9a84c";

export const metadata = {
  title: "Unlock The Lock",
  description: data.description,
};

export default function WellnessUnlockTheLockPage() {
  return (
    <main style={{ "--color-gold": TIER_COLOR, "--tier-accent": TIER_COLOR } as React.CSSProperties}>
      <WellnessViewTracker wellnessType="unlock-the-lock" />
      <Navbar />

      <PageHero variant="dark" title={data.title} subtitle={data.subtitle} />

      {data.offerings?.map((offering) => (
        <OfferingBlock key={offering.heading} {...offering} />
      ))}

      <div className="bg-dark-base pb-20 md:pb-28">
        <span className="mx-auto block h-px w-14 bg-gold" />
        <p className="mx-auto mt-8 max-w-xl px-6 text-center font-cormorant text-[22px] font-light italic text-gold">
          Thank you for choosing to ELEV8 YOU and the world inside YOU.
        </p>
      </div>

      <section className="bg-[#0a0a0a] py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <DynamicCalBookingEmbed
            calLink={process.env.NEXT_PUBLIC_CALCOM_UNLOCK_LINK ?? ""}
            title="Book Your Unlock The Lock Session"
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}
