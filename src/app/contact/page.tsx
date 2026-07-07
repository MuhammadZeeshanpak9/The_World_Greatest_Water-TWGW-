import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import WaveTransition from "@/components/ui/WaveTransition";
import ContactForm from "@/components/sections/contact/ContactForm";
import SocialRow from "@/components/sections/contact/SocialRow";

const TINT = "#f0e8f8";
const WHITE = "#ffffff";

export const metadata = {
  title: "Say Hello",
  description: "Get in touch with THE WORLD'S GREATEST WATER team — we'd love to hear from you.",
};

export default function ContactPage() {
  return (
    <main>
      <Navbar />

      <PageHero
        variant="light"
        title="SAY HELLO"
        description="Our exceptional team is always ready to hear from you and provide a great experience, no matter how engaging. We would love to hear from you."
      />
      <WaveTransition fromColor={TINT} toColor={WHITE} variant={3} />

      <ContactForm />
      <SocialRow />

      <Footer />
    </main>
  );
}
