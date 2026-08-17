import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductDetail from "@/components/sections/shop/ProductDetail";
import { getProducts, getProductBySlug } from "@/lib/products";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return {
    title: product ? product.name : "Product",
    description: product?.description ?? undefined,
    openGraph: product
      ? { title: product.name, description: product.description ?? undefined, type: "website" }
      : undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
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
