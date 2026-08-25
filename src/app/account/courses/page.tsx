import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";
import AccountCoursesList from "@/components/sections/account/AccountCoursesList";

const WHITE = "#ffffff";
const TINT = "#f0e8f8";

export const metadata = {
  title: "My Courses",
  description: "Your enrolled ELEV8 digital wellness courses.",
};

export default function AccountCoursesPage() {
  return (
    <main>
      <Navbar />

      <PageHero variant="light" title="MY COURSES" subtitle="YOUR LEARNING JOURNEY" />
      <WaveTransition fromColor={TINT} toColor={WHITE} variant={3} />

      <AccountCoursesList />

      <Footer />
    </main>
  );
}
