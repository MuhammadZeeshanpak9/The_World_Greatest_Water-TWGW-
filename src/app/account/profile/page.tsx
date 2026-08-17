import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";
import ProfileForm from "@/components/sections/account/ProfileForm";

const WHITE = "#ffffff";
const TINT = "#f0e8f8";

export const metadata = {
  title: "My Profile",
  description: "Update your ELEV8 WATER account details.",
};

export default function AccountProfilePage() {
  return (
    <main>
      <Navbar />

      <PageHero variant="light" title="MY PROFILE" subtitle="ACCOUNT DETAILS" />
      <WaveTransition fromColor={TINT} toColor={WHITE} variant={3} />

      <ProfileForm />

      <Footer />
    </main>
  );
}
