"use client";

import { useMemo, useState } from "react";
import { m } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { GradientPlaceholder } from "@/components/ui/MediaWithFallback";
import type { CourseSummary } from "@/lib/courses";

export default function CourseGrid({ courses }: { courses: CourseSummary[] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return courses;
    const q = search.trim().toLowerCase();
    return courses.filter((c) => c.title.toLowerCase().includes(q));
  }, [courses, search]);

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center font-cormorant text-[40px] text-ink md:text-[52px] text-glow-violet">
          12 Courses. 12 Understandings.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center font-inter text-base text-body">
          Each course is a comprehensive, value-packed journey into one of the 12 most important
          understandings of SELF
        </p>

        <div className="relative mx-auto mt-10 max-w-md">
          <Search
            size={16}
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses…"
            className="w-full rounded-full border border-violet/15 bg-white py-3 pr-4 pl-11 font-inter text-[14px] text-ink placeholder:text-muted focus:border-violet focus:outline-none"
          />
        </div>

        {filtered.length === 0 ? (
          <p className="mt-16 text-center font-inter text-body">No courses found.</p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course, i) => {
              const isComplete = !!course.completedAt;
              const progressPct =
                course.lessonCount > 0
                  ? Math.round((course.completedLessons / course.lessonCount) * 100)
                  : 0;

              return (
                <m.div
                  key={course.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="flex flex-col overflow-hidden rounded-2xl glass-card-light p-5"
                >
                  <Link
                    href={`/courses/${course.slug}`}
                    className="relative h-[160px] overflow-hidden rounded-xl"
                  >
                    <GradientPlaceholder
                      watermark={course.topic ?? "ELEV8"}
                      className="rounded-xl"
                    />
                  </Link>

                  <Link href={`/courses/${course.slug}`}>
                    <h3 className="mt-5 font-cormorant text-[22px] leading-tight text-ink hover:text-violet">
                      {course.title}
                    </h3>
                  </Link>
                  {course.teaser && (
                    <p className="mt-2 font-inter text-[13px] text-body">{course.teaser}</p>
                  )}

                  <p className="mt-3 font-inter text-[12px] tracking-[0.15em] text-muted uppercase">
                    {course.lessonCount} lesson{course.lessonCount === 1 ? "" : "s"}
                  </p>

                  {course.enrolled && (
                    <div className="mt-3">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-violet/10">
                        <div
                          className="h-full rounded-full bg-violet"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                      <p className="mt-1 font-inter text-[11px] text-muted">
                        {course.completedLessons} of {course.lessonCount} lessons
                      </p>
                    </div>
                  )}

                  {isComplete && (
                    <span className="mt-3 inline-block w-fit rounded-full bg-teal/15 px-3 py-1 font-inter text-[10px] font-semibold tracking-[0.15em] text-teal uppercase">
                      I AM Complete ✓
                    </span>
                  )}

                  <Link
                    href={`/courses/${course.slug}`}
                    className="group/btn mt-5 flex h-[46px] items-center justify-center gap-2 rounded-full bg-gradient-brand px-6 font-inter text-[11px] font-semibold tracking-[0.15em] text-white uppercase btn-glow transition-transform hover:scale-[1.02]"
                  >
                    {isComplete
                      ? "Review Course"
                      : course.enrolled
                        ? "Continue Learning"
                        : "Enroll Free"}
                    <ArrowRight
                      size={13}
                      className="transition-transform group-hover/btn:translate-x-1"
                    />
                  </Link>
                </m.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
