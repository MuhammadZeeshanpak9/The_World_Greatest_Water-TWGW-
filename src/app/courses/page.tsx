import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";
import CourseGrid from "@/components/sections/courses/CourseGrid";
import CourseBenefits from "@/components/sections/courses/CourseBenefits";
import { createClient } from "@/lib/supabase/server";
import { getCourses } from "@/lib/courses";

const WHITE = "#ffffff";
const DARK = "#0a0a0a";

export const revalidate = 60;

export const metadata = {
  title: "How To ELEV8 — Courses",
  description: "12 digital wellness courses — one for each of the 12 understandings of SELF.",
};

export default async function CoursesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const courses = await getCourses(user?.id ?? null);

  return (
    <main>
      <Navbar />

      <PageHero variant="dark" title="HOW TO ELEV8" subtitle="12 DIGITAL WELLNESS COURSES" />
      <WaveTransition fromColor={DARK} toColor={WHITE} variant={2} animated />

      <CourseGrid courses={courses} />
      <WaveTransition fromColor={WHITE} toColor={DARK} variant={2} />

      <CourseBenefits />

      <Footer />
    </main>
  );
}
