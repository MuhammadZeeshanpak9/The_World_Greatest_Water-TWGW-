import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";
import ShopCatalog from "@/components/sections/shop/ShopCatalog";

const DARK = "#0a0a0a";
const WHITE = "#ffffff";

export const metadata = {
  title: "Shop To ELEV8 — ELEV8 WATER",
};

export default function ShopPage() {
  return (
    <main>
      <Navbar />

      <PageHero
        variant="dark"
        title="SHOP TO ELEV8"
        description="Products created to add value to your life"
      />
      <WaveTransition fromColor={DARK} toColor={WHITE} variant={2} animated />

      <ShopCatalog />

      <Footer />
    </main>
  );
}
