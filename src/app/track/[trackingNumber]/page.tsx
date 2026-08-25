import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";
import TrackingResult from "@/components/sections/tracking/TrackingResult";

const WHITE = "#ffffff";
const TINT = "#f0e8f8";

export const metadata = {
  title: "Track Your Order",
  description: "Track your ELEV8 WATER order shipment.",
};

type Props = { params: Promise<{ trackingNumber: string }> };

export default async function TrackOrderPage({ params }: Props) {
  const { trackingNumber } = await params;

  return (
    <main>
      <Navbar />

      <PageHero variant="light" title="TRACK YOUR ORDER" subtitle={trackingNumber} />
      <WaveTransition fromColor={TINT} toColor={WHITE} variant={3} />

      <TrackingResult trackingNumber={trackingNumber} />

      <Footer />
    </main>
  );
}
