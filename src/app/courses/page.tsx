import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";
import CourseGrid from "@/components/sections/courses/CourseGrid";
import CourseBenefits from "@/components/sections/courses/CourseBenefits";

const WHITE = "#ffffff";
const DARK = "#0a0a0a";

export const metadata = {
  title: "How To ELEV8 — Courses — ELEV8 WATER",
};

export default function CoursesPage() {
  return (
    <main>
      <Navbar />

      <PageHero variant="dark" title="HOW TO ELEV8" subtitle="12 DIGITAL WELLNESS COURSES" />
      <WaveTransition fromColor={DARK} toColor={WHITE} variant={2} animated />

      <CourseGrid />
      <WaveTransition fromColor={WHITE} toColor={DARK} variant={2} />

      <CourseBenefits />

      <Footer />
    </main>
  );
}
