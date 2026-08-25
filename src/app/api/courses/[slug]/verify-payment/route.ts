import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCourseBySlug, getCourseLessons } from "@/lib/courses";
import { isStripeEnabled } from "@/lib/payments/config";
import { getStripeClient } from "@/lib/payments/stripe";
import { sendCourseEnrollmentEmail, sendAdminFormNotification } from "@/lib/email/send";
import { logAudit } from "@/lib/supabase/audit";

type Params = { params: Promise<{ slug: string }> };

/** Fallback for when a course payment succeeded but the Stripe webhook never fired (or hasn't
 * yet) — re-checks the PaymentIntent directly with Stripe and creates the enrollment if it's
 * genuinely confirmed. Uses the same idempotent upsert as the webhook, so calling this after the
 * webhook already ran (or calling it twice) is harmless. */
export async function POST(request: NextRequest, { params }: Params) {
  const { slug } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const course = await getCourseBySlug(slug);
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("course_enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_slug", slug)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ enrolled: true, course_title: course.title });
  }

  if (!isStripeEnabled()) {
    return NextResponse.json({ error: "No payment to verify" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const b = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  const paymentIntentId = typeof b.paymentIntentId === "string" ? b.paymentIntentId : "";
  if (!paymentIntentId) {
    return NextResponse.json({ error: "paymentIntentId is required" }, { status: 400 });
  }

  const stripe = getStripeClient();
  if (!stripe) {
    return NextResponse.json({ error: "No payment to verify" }, { status: 400 });
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.metadata?.user_id !== user.id || paymentIntent.metadata?.course_slug !== slug) {
    return NextResponse.json({ error: "This payment doesn't belong to you" }, { status: 403 });
  }
  if (paymentIntent.status !== "succeeded") {
    return NextResponse.json({ enrolled: false, status: paymentIntent.status });
  }

  const { data: enrollment } = await admin
    .from("course_enrollments")
    .upsert(
      {
        user_id: user.id,
        course_slug: slug,
        course_title: course.title,
        paid_at: new Date().toISOString(),
        price_paid: paymentIntent.amount / 100,
      },
      { onConflict: "user_id,course_slug" },
    )
    .select()
    .single();

  await logAudit({
    action: "create",
    table: "course_enrollments",
    recordId: enrollment?.id,
    newData: enrollment,
  });

  const lessons = await getCourseLessons(slug);
  await sendCourseEnrollmentEmail(user.email, course.title, slug, lessons.length);
  await sendAdminFormNotification("Course Enrollment", {
    name: user.email,
    email: user.email,
    message: `Enrolled in ${course.title} (verified via fallback — webhook may not have fired)`,
  });

  return NextResponse.json({ enrolled: true, course_title: course.title });
}
