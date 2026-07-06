const STEPS = [
  { num: 1, label: "CONTACT" },
  { num: 2, label: "SHIPPING" },
  { num: 3, label: "PAYMENT" },
] as const;

export default function StepIndicator({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div className="mx-auto mb-16 flex max-w-md items-start">
      {STEPS.map((s, i) => (
        <div key={s.num} className="flex flex-1 items-center last:flex-none">
          <div className="flex flex-col items-center">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full font-inter text-[15px] font-semibold transition-colors ${
                step >= s.num ? "bg-violet text-white" : "bg-violet/10 text-muted"
              }`}
            >
              {s.num}
            </span>
            <span
              className={`mt-2 whitespace-nowrap font-inter text-[10px] font-semibold uppercase tracking-[0.15em] ${
                step >= s.num ? "text-violet" : "text-muted"
              }`}
            >
              {s.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <span
              className={`mx-3 mt-[-20px] h-px flex-1 transition-colors ${
                step > s.num ? "bg-violet" : "bg-violet/15"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
