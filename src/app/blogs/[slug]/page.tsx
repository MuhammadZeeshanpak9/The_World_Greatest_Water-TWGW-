import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";
import BlogDetailContent from "@/components/sections/blogs/BlogDetailContent";
import BlogSidebar from "@/components/sections/blogs/BlogSidebar";
import { getPublishedBlogPosts, getPublishedBlogPostBySlug } from "@/lib/blogs";

const TINT = "#f0e8f8";
const WHITE = "#ffffff";

const RelatedCarousel = dynamic(() => import("@/components/sections/blogs/RelatedCarousel"), {
  loading: () => <div className="h-[280px] w-full rounded-2xl bg-violet-tint" aria-hidden />,
});

export const revalidate = 300;

export async function generateStaticParams() {
  try {
    const posts = await getPublishedBlogPosts();
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);
  return {
    title: post ? post.title : "Blog",
    description: post?.teaser ?? undefined,
    openGraph: post
      ? { title: post.title, description: post.teaser ?? undefined, type: "article" }
      : undefined,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);
  if (!post) notFound();

  const allPosts = await getPublishedBlogPosts();
  const related = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <main>
      <Navbar />

      <PageHero
        variant="light"
        title={post.title}
        description={post.teaser ?? undefined}
        titleClassName="text-[40px] md:text-[64px]"
      />
      <WaveTransition fromColor={TINT} toColor={WHITE} variant={3} />

      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 lg:flex-row">
          <BlogDetailContent post={post} />
          <BlogSidebar current={post} posts={allPosts} />
        </div>

        <div className="mx-auto mt-20 max-w-6xl px-6">
          <RelatedCarousel posts={related} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
