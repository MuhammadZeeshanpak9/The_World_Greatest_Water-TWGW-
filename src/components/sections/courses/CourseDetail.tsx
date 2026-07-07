import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { BlogPost } from "@/types";
import ProductStatusBadge from "@/components/sections/shop/ProductStatusBadge";

function learningOutcomes(topic: string) {
  return [
    `The real meaning behind ${topic} and why it matters`,
    `Daily practices to bring ${topic} into your life`,
    "Guided reflection prompts to deepen your understanding",
    `How ${topic} connects to the other 11 ELEV8 understandings`,
  ];
}

export default function CourseDetail({ post }: { post: BlogPost }) {
  const outcomes = learningOutcomes(post.topic ?? "this understanding");

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[760px] px-6">
        <Link
          href="/courses"
          className="group inline-flex items-center gap-2 font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-violet"
        >
          <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
          Back to Courses
        </Link>

        <h1 className="mt-6 font-cormorant text-[40px] leading-tight text-ink md:text-[52px] text-glow-violet">
          {post.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <p className="font-inter text-[22px] font-bold text-violet">$47.77</p>
          <ProductStatusBadge status="coming-soon" />
        </div>

        <p className="mt-6 font-inter text-base leading-[1.9] text-body">{post.teaser}</p>

        <h2 className="mt-12 font-inter text-[13px] font-semibold uppercase tracking-[0.25em] text-ink">
          What You&apos;ll Learn
        </h2>
        <ul className="mt-5 flex flex-col gap-3">
          {outcomes.map((o) => (
            <li key={o} className="flex items-start gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet" />
              <span className="font-inter text-[15px] leading-relaxed text-body">{o}</span>
            </li>
          ))}
        </ul>

        <button
          disabled
          className="mt-10 flex h-[52px] items-center justify-center gap-2 rounded-full bg-gradient-brand btn-glow px-8 font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-white disabled:cursor-not-allowed disabled:bg-muted/40"
        >
          Enroll Now
          <ArrowRight size={16} />
        </button>
        <p className="mt-4 font-inter text-[13px] italic text-muted">
          Full course content coming soon
        </p>
      </div>
    </section>
  );
}
