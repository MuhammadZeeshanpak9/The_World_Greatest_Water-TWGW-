import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductDetail from "@/components/sections/shop/ProductDetail";
import { SHOP_PRODUCTS } from "@/data/content";

export async function generateStaticParams() {
  return SHOP_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = SHOP_PRODUCTS.find((p) => p.slug === slug);
  return {
    title: product ? product.name : "Product",
    description: product?.description,
    openGraph: product
      ? { title: product.name, description: product.description, type: "website" }
      : undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = SHOP_PRODUCTS.find((p) => p.slug === slug);
  if (!product) notFound();

  return (
    <main>
      <Navbar />
      <div className="pt-20" />
      <ProductDetail product={product} />
      <Footer />
    </main>
  );
}
