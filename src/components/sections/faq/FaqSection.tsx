import { SectionLabel } from "@/components/ui/primitives";
import Accordion from "@/components/ui/Accordion";
import { FAQ_CATEGORIES } from "@/data/content";

export default function FaqSection() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto flex max-w-3xl flex-col gap-16 px-6">
        {FAQ_CATEGORIES.map((cat) => (
          <div key={cat.category}>
            <div className="flex justify-center">
              <SectionLabel underline>{cat.category}</SectionLabel>
            </div>
            <div className="mt-8">
              <Accordion items={cat.items} tone="light" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
