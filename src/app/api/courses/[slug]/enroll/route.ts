import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { getCourseBySlug, enrollUserFree } from "@/lib/courses";
import { isStripeEnabled } from "@/lib/payments/config";
import { createCoursePaymentIntent } from "@/lib/payments/coursePayment";

type Params = { params: Promise<{ slug: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  const { slug } = await params;

  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(`course-enroll:${ip}`, {
    maxAttempts: 10,
    windowMs: 60 * 60 * 1000,
  });
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many enrollment attempts. Please try again later." },
      { status: 429 },
    );
  }

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
    return NextResponse.json({ error: "Already enrolled in this course" }, { status: 409 });
  }

  if (!isStripeEnabled()) {
    await enrollUserFree(user.id, user.email, course);
    return NextResponse.json({ enrolled: true, course_title: course.title });
  }

  // Stripe enabled — payment required before enrollment. The webhook creates the enrollment on
  // payment_intent.succeeded (idempotent upsert); /verify-payment is the fallback if that never
  // fires.
  try {
    const paymentIntent = await createCoursePaymentIntent(user.id, user.email, slug);
    return NextResponse.json({
      requiresPayment: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    console.error("[courses/enroll] payment intent creation failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Unable to start enrollment payment" }, { status: 500 });
  }
}
