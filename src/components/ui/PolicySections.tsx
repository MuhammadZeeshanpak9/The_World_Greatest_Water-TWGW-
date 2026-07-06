import type { PolicySection } from "@/types";

type PolicySectionsProps = {
  lastUpdated: string;
  sections: PolicySection[];
};

export default function PolicySections({ lastUpdated, sections }: PolicySectionsProps) {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[760px] px-6">
        <p className="font-inter text-[13px] uppercase tracking-[0.2em] text-muted">
          Last updated: {lastUpdated}
        </p>

        <div className="mt-10 flex flex-col gap-10">
          {sections.map((s) => (
            <div key={s.heading}>
              <h2 className="font-cormorant text-[28px] text-ink">{s.heading}</h2>
              <p className="mt-3 font-inter text-base leading-[1.9] text-body">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
