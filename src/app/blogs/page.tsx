import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";
import BlogGrid from "@/components/sections/blogs/BlogGrid";
import { getPublishedBlogPosts } from "@/lib/blogs";

const DARK = "#0a0a0a";
const WHITE = "#ffffff";

export const revalidate = 300;

export const metadata = {
  title: "Blogs",
  description: "How to ELEV8 — 12 understandings for elevating every part of your life.",
};

export default async function BlogsPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <main>
      <Navbar />

      <PageHero variant="dark" title="BLOGS" subtitle="How to ELEV8 Your Life" />
      <WaveTransition fromColor={DARK} toColor={WHITE} variant={2} animated />

      <BlogGrid posts={posts} />

      <Footer />
    </main>
  );
}
