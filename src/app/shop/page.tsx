import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";
import ShopCatalog from "@/components/sections/shop/ShopCatalog";
import { getProducts } from "@/lib/products";

const DARK = "#0a0a0a";
const WHITE = "#ffffff";

export const revalidate = 60;

export const metadata = {
  title: "Shop To ELEV8",
  description: "Products created to add value to your life.",
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <main>
      <Navbar />

      <PageHero
        variant="dark"
        title="SHOP TO ELEV8"
        description="Products created to add value to your life"
      />
      <WaveTransition fromColor={DARK} toColor={WHITE} variant={2} animated />

      {products.length === 0 ? (
        <div className="bg-white py-24 text-center md:py-32">
          <p className="font-inter text-body">Our shop is being restocked — check back soon.</p>
        </div>
      ) : (
        <ShopCatalog products={products} />
      )}

      <Footer />
    </main>
  );
}
