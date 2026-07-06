import { BookOpen } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";
import EmptyState from "@/components/ui/EmptyState";

const WHITE = "#ffffff";
const TINT = "#f0e8f8";

export const metadata = {
  title: "My Courses — ELEV8 WATER",
};

export default function AccountCoursesPage() {
  return (
    <main>
      <Navbar />

      <PageHero variant="light" title="MY COURSES" subtitle="YOUR LEARNING JOURNEY" />
      <WaveTransition fromColor={TINT} toColor={WHITE} variant={3} />

      <EmptyState
        icon={BookOpen}
        heading="No courses enrolled"
        description="Enroll in our 12 digital wellness courses"
        ctaLabel="EXPLORE COURSES"
        ctaHref="/courses"
      />

      <Footer />
    </main>
  );
}
