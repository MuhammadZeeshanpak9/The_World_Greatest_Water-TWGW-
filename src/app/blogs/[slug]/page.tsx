import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";
import BlogDetailContent from "@/components/sections/blogs/BlogDetailContent";
import BlogSidebar from "@/components/sections/blogs/BlogSidebar";
import { BLOG_POSTS } from "@/data/content";

const TINT = "#f0e8f8";
const WHITE = "#ffffff";

const RelatedCarousel = dynamic(() => import("@/components/sections/blogs/RelatedCarousel"), {
  loading: () => <div className="h-[280px] w-full rounded-2xl bg-violet-tint" aria-hidden />,
});

export async function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  return {
    title: post ? post.title : "Blog",
    description: post?.teaser,
    openGraph: post ? { title: post.title, description: post.teaser, type: "article" } : undefined,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <main>
      <Navbar />

      <PageHero
        variant="light"
        title={post.title}
        description={post.teaser}
        titleClassName="text-[40px] md:text-[64px]"
      />
      <WaveTransition fromColor={TINT} toColor={WHITE} variant={3} />

      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 lg:flex-row">
          <BlogDetailContent post={post} />
          <BlogSidebar current={post} />
        </div>

        <div className="mx-auto mt-20 max-w-6xl px-6">
          <RelatedCarousel posts={related} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
