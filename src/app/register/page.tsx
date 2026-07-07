import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";
import RegisterForm from "@/components/sections/auth/RegisterForm";

const WHITE = "#ffffff";
const TINT = "#f0e8f8";

export const metadata = {
  title: "Create Account",
  description: "Create your ELEV8 WATER account and join the movement.",
};

export default function RegisterPage() {
  return (
    <main>
      <Navbar />

      <PageHero variant="light" title="JOIN THE MOVEMENT" subtitle="CREATE YOUR ACCOUNT" />
      <WaveTransition fromColor={TINT} toColor={WHITE} variant={3} />

      <RegisterForm />

      <Footer />
    </main>
  );
}
