import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";
import ResetPasswordForm from "@/components/sections/auth/ResetPasswordForm";

const WHITE = "#ffffff";
const TINT = "#f0e8f8";

export const metadata = {
  title: "Reset Password",
  description: "Choose a new password for your ELEV8 WATER account.",
};

export default function ResetPasswordPage() {
  return (
    <main>
      <Navbar />

      <PageHero variant="light" title="CHOOSE A NEW PASSWORD" subtitle="RESET YOUR PASSWORD" />
      <WaveTransition fromColor={TINT} toColor={WHITE} variant={3} />

      <Suspense fallback={<div className="bg-white py-24 md:py-32" />}>
        <ResetPasswordForm />
      </Suspense>

      <Footer />
    </main>
  );
}
