import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";
import CourseDetail from "@/components/sections/courses/CourseDetail";
import { createClient } from "@/lib/supabase/server";
import {
  getCourseBySlug,
  getCourseLessons,
  getCourseProgressForUser,
  getCourses,
} from "@/lib/courses";

const TINT = "#f0e8f8";
const WHITE = "#ffffff";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const courses = await getCourses(null);
    return courses.map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  return {
    title: course ? course.title : "Course",
    description: course?.teaser ?? undefined,
    openGraph: course
      ? { title: course.title, description: course.teaser ?? undefined, type: "website" }
      : undefined,
  };
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const lessons = await getCourseLessons(slug);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const progress = user
    ? await getCourseProgressForUser(user.id, slug)
    : { enrolled: false, completedAt: null, completedLessonIds: [] };

  const allCourses = await getCourses(null);
  const relatedCourses = allCourses
    .filter((c) => c.slug !== slug)
    .slice(0, 3)
    .map((c) => ({ slug: c.slug, title: c.title }));

  return (
    <main>
      <Navbar />

      <PageHero variant="light" title={course.title} description={course.teaser ?? undefined} />
      <WaveTransition fromColor={TINT} toColor={WHITE} variant={3} />

      <CourseDetail
        course={course}
        lessons={lessons}
        initialEnrolled={progress.enrolled}
        initialCompletedLessonIds={progress.completedLessonIds}
        initialCompletedAt={progress.completedAt}
        relatedCourses={relatedCourses}
      />

      <Footer />
    </main>
  );
}
