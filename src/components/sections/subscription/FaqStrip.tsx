import Accordion from "@/components/ui/Accordion";
import { SUBSCRIPTION_FAQ } from "@/data/content";

export default function FaqStrip() {
  return (
    <section className="bg-gradient-hero py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-center font-cormorant text-[36px] text-white md:text-[48px]">
          Common Questions
        </h2>
        <div className="mt-12">
          <Accordion items={SUBSCRIPTION_FAQ} tone="dark" />
        </div>
      </div>
    </section>
  );
}
