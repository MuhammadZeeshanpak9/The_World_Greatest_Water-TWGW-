"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

type Course = {
  slug: string;
  title: string;
  lessonCount: number;
  enrolled: boolean;
  completedLessons: number;
  completedAt: string | null;
};

export default function AccountCoursesList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/courses");
        if (!res.ok) throw new Error("Failed to load courses");
        const json = await res.json();
        if (!cancelled) setCourses((json.courses ?? []).filter((c: Course) => c.enrolled));
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-4xl space-y-4 px-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-violet/5" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white py-24 text-center md:py-32">
        <p className="font-inter text-red-600">
          Unable to load your courses right now. Please try again later.
        </p>
      </section>
    );
  }

  if (courses.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        heading="No courses enrolled yet"
        description="Enroll in our 12 digital wellness courses"
        ctaLabel="EXPLORE COURSES"
        ctaHref="/courses"
      />
    );
  }

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-4xl space-y-4 px-6">
        {courses.map((course) => {
          const isComplete = !!course.completedAt;
          const progressPct =
            course.lessonCount > 0
              ? Math.round((course.completedLessons / course.lessonCount) * 100)
              : 0;

          return (
            <div
              key={course.slug}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl glass-card-light p-6"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <p className="font-cormorant text-[22px] text-ink">{course.title}</p>
                  {isComplete && (
                    <span className="rounded-full bg-teal/15 px-3 py-1 font-inter text-[10px] font-semibold tracking-[0.15em] text-teal uppercase">
                      I AM Complete ✓
                    </span>
                  )}
                </div>
                <div className="mt-3 max-w-sm">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-violet/10">
                    <div
                      className="h-full rounded-full bg-violet"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <p className="mt-1 font-inter text-[12px] text-muted">
                    {course.completedLessons} of {course.lessonCount} lessons
                  </p>
                </div>
              </div>
              <Link
                href={`/courses/${course.slug}`}
                className="group flex shrink-0 items-center gap-2 rounded-full bg-gradient-brand px-6 py-3 font-inter text-[11px] font-semibold tracking-[0.15em] text-white uppercase btn-glow transition-transform hover:scale-[1.02]"
              >
                Continue Learning
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
