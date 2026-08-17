import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";
import ForgotPasswordForm from "@/components/sections/auth/ForgotPasswordForm";

const WHITE = "#ffffff";
const TINT = "#f0e8f8";

export const metadata = {
  title: "Forgot Password",
  description: "Reset your ELEV8 WATER account password.",
};

export default function ForgotPasswordPage() {
  return (
    <main>
      <Navbar />

      <PageHero variant="light" title="RESET YOUR PASSWORD" subtitle="WE'LL SEND YOU A LINK" />
      <WaveTransition fromColor={TINT} toColor={WHITE} variant={3} />

      <ForgotPasswordForm />

      <Footer />
    </main>
  );
}
