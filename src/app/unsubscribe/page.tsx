import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";
import UnsubscribeConfirm from "@/components/sections/newsletter/UnsubscribeConfirm";

const WHITE = "#ffffff";
const TINT = "#f0e8f8";

export const metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ email?: string }> };

export default async function UnsubscribePage({ searchParams }: Props) {
  const { email } = await searchParams;
  if (!email) redirect("/");

  return (
    <main>
      <Navbar />

      <PageHero variant="light" title="UNSUBSCRIBE" subtitle="MANAGE YOUR EMAIL PREFERENCES" />
      <WaveTransition fromColor={TINT} toColor={WHITE} variant={3} />

      <UnsubscribeConfirm email={email} />

      <Footer />
    </main>
  );
}
