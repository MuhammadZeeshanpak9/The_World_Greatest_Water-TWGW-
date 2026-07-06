import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";
import LoginForm from "@/components/sections/auth/LoginForm";

const WHITE = "#ffffff";
const TINT = "#f0e8f8";

export const metadata = {
  title: "Sign In — ELEV8 WATER",
};

export default function LoginPage() {
  return (
    <main>
      <Navbar />

      <PageHero variant="light" title="WELCOME BACK" subtitle="SIGN IN TO YOUR ACCOUNT" />
      <WaveTransition fromColor={TINT} toColor={WHITE} variant={3} />

      <LoginForm />

      <Footer />
    </main>
  );
}
