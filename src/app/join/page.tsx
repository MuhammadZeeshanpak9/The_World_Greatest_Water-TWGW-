import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";
import RetailerCards from "@/components/sections/join/RetailerCards";
import InquiryForm from "@/components/sections/join/InquiryForm";

const TINT = "#f0e8f8";
const WHITE = "#ffffff";

export const metadata = {
  title: "Join To ELEV8 — ELEV8 WATER",
};

export default function JoinPage() {
  return (
    <main>
      <Navbar />

      <PageHero
        variant="light"
        title="JOIN TO ELEV8"
        description="Available at these retailers"
      />
      <WaveTransition fromColor={TINT} toColor={WHITE} variant={3} />

      <RetailerCards />
      <WaveTransition fromColor={WHITE} toColor={TINT} variant={1} />

      <InquiryForm />

      <Footer />
    </main>
  );
}
