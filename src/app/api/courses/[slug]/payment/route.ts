import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCourseBySlug, enrollUserFree } from "@/lib/courses";
import { isStripeEnabled } from "@/lib/payments/config";
import { createCoursePaymentIntent } from "@/lib/payments/coursePayment";

type Params = { params: Promise<{ slug: string }> };

/** Standalone entry point for course payment, alongside /enroll's own Stripe-enabled branch
 * (both create a PaymentIntent via the same createCoursePaymentIntent() helper — this route
 * exists for the frontend to call directly, e.g. retrying after a failed payment attempt
 * without re-running /enroll's whole not-already-enrolled check flow a second time). */
export async function POST(_request: NextRequest, { params }: Params) {
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
    return NextResponse.json({ error: "Already enrolled in this course" }, { status: 409 });
  }

  if (!isStripeEnabled()) {
    await enrollUserFree(user.id, user.email, course);
    return NextResponse.json({ enrolled: true, course_title: course.title });
  }

  try {
    const paymentIntent = await createCoursePaymentIntent(user.id, user.email, slug);
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    console.error("[courses/payment] payment intent creation failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Unable to start enrollment payment" }, { status: 500 });
  }
}
