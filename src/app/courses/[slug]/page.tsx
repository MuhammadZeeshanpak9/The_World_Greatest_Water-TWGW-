import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";
import CourseDetail from "@/components/sections/courses/CourseDetail";
import { BLOG_POSTS } from "@/data/content";

const TINT = "#f0e8f8";
const WHITE = "#ffffff";

const COURSES = BLOG_POSTS.filter((p) => p.topic);

export async function generateStaticParams() {
  return COURSES.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = COURSES.find((p) => p.slug === slug);
  return {
    title: post ? post.title : "Course",
    description: post?.teaser,
    openGraph: post ? { title: post.title, description: post.teaser, type: "website" } : undefined,
  };
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params;
  const post = COURSES.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <main>
      <Navbar />

      <PageHero variant="light" title={post.title} />
      <WaveTransition fromColor={TINT} toColor={WHITE} variant={3} />

      <CourseDetail post={post} />

      <Footer />
    </main>
  );
}
