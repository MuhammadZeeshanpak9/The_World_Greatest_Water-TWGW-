import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";
import BlogGrid from "@/components/sections/blogs/BlogGrid";

const DARK = "#0a0a0a";
const WHITE = "#ffffff";

export const metadata = {
  title: "Blogs — ELEV8 WATER",
};

export default function BlogsPage() {
  return (
    <main>
      <Navbar />

      <PageHero variant="dark" title="BLOGS" subtitle="How to ELEV8 Your Life" />
      <WaveTransition fromColor={DARK} toColor={WHITE} variant={2} animated />

      <BlogGrid />

      <Footer />
    </main>
  );
}
