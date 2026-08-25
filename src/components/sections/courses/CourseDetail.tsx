"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "@/context/SessionContext";
import { trackCourseView, trackLead } from "@/lib/analytics";
import type { DbBlogPost } from "@/types";
import type { CourseLesson } from "@/lib/courses";

function toYouTubeEmbedUrl(url: string): string {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    }
    const videoId = u.searchParams.get("v");
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    return url;
  } catch {
    return url;
  }
}

function LessonVideo({ videoUrl }: { videoUrl: string | null }) {
  if (!videoUrl) return null;

  const isYouTube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");

  if (isYouTube) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-xl">
        <iframe
          src={toYouTubeEmbedUrl(videoUrl)}
          title="Lesson video"
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <video controls className="w-full rounded-xl">
      <source src={videoUrl} />
      Your browser does not support the video tag.
    </video>
  );
}

type Props = {
  course: DbBlogPost;
  lessons: CourseLesson[];
  initialEnrolled: boolean;
  initialCompletedLessonIds: string[];
  initialCompletedAt: string | null;
  relatedCourses: { slug: string; title: string }[];
};

export default function CourseDetail({
  course,
  lessons,
  initialEnrolled,
  initialCompletedLessonIds,
  initialCompletedAt,
  relatedCourses,
}: Props) {
  const { user } = useSession();
  const router = useRouter();
  const [enrolled, setEnrolled] = useState(initialEnrolled);
  const [enrolling, setEnrolling] = useState(false);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(
    () => new Set(initialCompletedLessonIds),
  );
  const [completedAt, setCompletedAt] = useState(initialCompletedAt);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(lessons[0]?.id ?? null);
  const [updatingLessonId, setUpdatingLessonId] = useState<string | null>(null);

  const [stripeEnabled, setStripeEnabled] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [pendingPaymentIntentId, setPendingPaymentIntentId] = useState<string | null>(() =>
    typeof window !== "undefined"
      ? localStorage.getItem(`elev8_course_payment_${course.slug}`)
      : null,
  );

  useEffect(() => {
    trackCourseView(course.slug);
  }, [course.slug]);

  useEffect(() => {
    fetch("/api/payments/status")
      .then((res) => res.json())
      .then((json) => setStripeEnabled(!!json.stripe))
      .catch(() => setStripeEnabled(false));
  }, []);

  const activeLesson = lessons.find((l) => l.id === activeLessonId) ?? lessons[0];
  const progressPct =
    lessons.length > 0 ? Math.round((completedLessonIds.size / lessons.length) * 100) : 0;
  const isComplete = !!completedAt;

  async function handleEnroll() {
    if (!user) {
      router.push(`/login?redirect=/courses/${course.slug}`);
      return;
    }

    setEnrolling(true);
    try {
      const res = await fetch(`/api/courses/${course.slug}/enroll`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Unable to enroll");

      if (json.requiresPayment) {
        // TODO: mount @stripe/react-stripe-js's <Elements> + <PaymentElement> here once real
        // Stripe keys are live. loadStripe(NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) → <Elements
        // options={{clientSecret: json.clientSecret}}> → stripe.confirmPayment() on submit →
        // on success, POST /api/courses/[slug]/verify-payment with { paymentIntentId }. Until
        // then, the payment intent is created and its id persisted so "Verify Enrollment" can
        // recover if the customer navigates away mid-payment.
        localStorage.setItem(`elev8_course_payment_${course.slug}`, json.paymentIntentId);
        setPendingPaymentIntentId(json.paymentIntentId);
        setEnrolling(false);
        return;
      }

      setEnrolled(true);
      trackLead("course-enrollment");
      toast.success("You're enrolled!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to enroll");
      setEnrolling(false);
    }
  }

  async function handleVerifyEnrollment() {
    if (!pendingPaymentIntentId) return;
    setVerifying(true);
    try {
      const res = await fetch(`/api/courses/${course.slug}/verify-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentIntentId: pendingPaymentIntentId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Unable to verify enrollment");

      if (json.enrolled) {
        localStorage.removeItem(`elev8_course_payment_${course.slug}`);
        setPendingPaymentIntentId(null);
        setEnrolled(true);
        trackLead("course-enrollment");
        toast.success("Enrollment verified!");
      } else {
        toast.error("Payment hasn't completed yet. Please try again shortly.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to verify enrollment");
    } finally {
      setVerifying(false);
    }
  }

  async function handleToggleLesson(lessonId: string, currentlyCompleted: boolean) {
    setUpdatingLessonId(lessonId);
    try {
      const res = await fetch(`/api/courses/${course.slug}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, completed: !currentlyCompleted }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Unable to update progress");

      setCompletedLessonIds((prev) => {
        const next = new Set(prev);
        if (currentlyCompleted) next.delete(lessonId);
        else next.add(lessonId);
        return next;
      });
      if (json.completed && !completedAt) {
        setCompletedAt(new Date().toISOString());
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to update progress");
    } finally {
      setUpdatingLessonId(null);
    }
  }

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <Link
          href="/courses"
          className="group inline-flex items-center gap-2 font-inter text-[12px] font-semibold tracking-[0.15em] text-violet uppercase"
        >
          <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
          Back to Courses
        </Link>

        <h1 className="mt-6 font-cormorant text-[40px] leading-tight text-ink md:text-[52px] text-glow-violet">
          {course.title}
        </h1>
        {course.teaser && (
          <p className="mt-4 font-inter text-base leading-[1.9] text-body">{course.teaser}</p>
        )}

        <p className="mt-4 font-inter text-[13px] tracking-[0.15em] text-muted uppercase">
          {lessons.length} lesson{lessons.length === 1 ? "" : "s"}
        </p>

        {!enrolled ? (
          <>
            {pendingPaymentIntentId ? (
              <>
                <button
                  onClick={handleVerifyEnrollment}
                  disabled={verifying}
                  className="group mt-8 flex h-[52px] items-center justify-center gap-2 rounded-full bg-gradient-brand btn-glow px-8 font-inter text-[12px] font-semibold tracking-[0.15em] text-white uppercase transition-transform duration-300 hover:scale-[1.02] disabled:opacity-60"
                >
                  {verifying ? "Verifying…" : "Verify Enrollment"}
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
                <p className="mt-4 font-inter text-[13px] text-muted italic">
                  Payment received but enrollment pending — click here to verify.
                </p>
              </>
            ) : (
              <>
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="group mt-8 flex h-[52px] items-center justify-center gap-2 rounded-full bg-gradient-brand btn-glow px-8 font-inter text-[12px] font-semibold tracking-[0.15em] text-white uppercase transition-transform duration-300 hover:scale-[1.02] disabled:opacity-60"
                >
                  {enrolling ? "Enrolling…" : stripeEnabled ? "Enroll — $47.77" : "Enroll Free"}
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
                <p className="mt-4 font-inter text-[13px] text-muted italic">
                  {stripeEnabled ? "Secure checkout. I AM ready." : "Free for now. I AM ready."}
                </p>
              </>
            )}
          </>
        ) : (
          <div className="mt-10">
            {isComplete && (
              <div className="mb-8 rounded-2xl bg-violet/5 p-6 text-center">
                <p className="font-cormorant text-2xl text-violet">I AM COMPLETE</p>
                <p className="mt-1 font-inter text-[13px] text-body">
                  You&apos;ve completed this course. The understanding is now yours.
                </p>
              </div>
            )}

            <div className="mb-6">
              <div className="h-2 w-full overflow-hidden rounded-full bg-violet/10">
                <div
                  className="h-full rounded-full bg-violet transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <p className="mt-2 font-inter text-[12px] text-muted">
                {completedLessonIds.size} of {lessons.length} lessons complete ({progressPct}%)
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
              <div>
                {activeLesson && (
                  <>
                    <h2 className="font-cormorant text-2xl text-ink">{activeLesson.title}</h2>
                    <div className="mt-4">
                      <LessonVideo videoUrl={activeLesson.video_url} />
                    </div>
                    {activeLesson.content && (
                      <p className="mt-4 font-inter text-[15px] leading-[1.8] text-body">
                        {activeLesson.content}
                      </p>
                    )}
                  </>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {lessons.map((lesson) => {
                  const isDone = completedLessonIds.has(lesson.id);
                  return (
                    <div
                      key={lesson.id}
                      className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${
                        activeLessonId === lesson.id
                          ? "border-violet bg-violet/5"
                          : "border-violet/10"
                      }`}
                    >
                      <button
                        onClick={() => handleToggleLesson(lesson.id, isDone)}
                        disabled={updatingLessonId === lesson.id}
                        aria-label={isDone ? "Mark incomplete" : "Mark complete"}
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors disabled:opacity-50 ${
                          isDone
                            ? "border-violet bg-violet text-white"
                            : "border-violet/30 text-transparent"
                        }`}
                      >
                        <Check size={13} />
                      </button>
                      <button
                        onClick={() => setActiveLessonId(lesson.id)}
                        className="flex-1 text-left font-inter text-[13px] text-ink hover:text-violet"
                      >
                        {lesson.title}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {relatedCourses.length > 0 && (
          <div className="mt-20 border-t border-violet/10 pt-12">
            <h3 className="font-cormorant text-2xl text-ink">More Understandings</h3>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {relatedCourses.map((c) => (
                <Link
                  key={c.slug}
                  href={`/courses/${c.slug}`}
                  className="rounded-xl border border-violet/10 p-4 font-inter text-[14px] text-ink transition-colors hover:border-violet hover:text-violet"
                >
                  {c.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
