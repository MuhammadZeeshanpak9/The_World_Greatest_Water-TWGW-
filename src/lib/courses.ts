import { createAdminClient } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/supabase/audit";
import { sendCourseEnrollmentEmail, sendAdminFormNotification } from "@/lib/email/send";
import type { DbBlogPost } from "@/types";

export type CourseSummary = DbBlogPost & {
  lessonCount: number;
  enrolled: boolean;
  completedLessons: number;
  completedAt: string | null;
};

export type CourseLesson = {
  id: string;
  course_slug: string;
  title: string;
  content: string | null;
  video_url: string | null;
  order_index: number;
};

/** All published courses (blog_posts with a topic set), optionally enriched with the given
 * user's enrollment/progress state. Server-only (transitively imports the service-role client). */
export async function getCourses(userId: string | null): Promise<CourseSummary[]> {
  try {
    const admin = createAdminClient();
    const { data: posts, error } = await admin
      .from("blog_posts")
      .select("*")
      .not("topic", "is", null)
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (error) throw error;

    const courses = posts ?? [];
    if (courses.length === 0) return [];

    const slugs = courses.map((c) => c.slug);

    const { data: lessons } = await admin
      .from("course_lessons")
      .select("course_slug")
      .in("course_slug", slugs);

    const lessonCountBySlug = new Map<string, number>();
    for (const l of lessons ?? []) {
      lessonCountBySlug.set(l.course_slug, (lessonCountBySlug.get(l.course_slug) ?? 0) + 1);
    }

    const enrollmentBySlug = new Map<string, { id: string; completed_at: string | null }>();
    const completedCountByEnrollment = new Map<string, number>();

    if (userId) {
      const { data: enrollments } = await admin
        .from("course_enrollments")
        .select("id, course_slug, completed_at")
        .eq("user_id", userId)
        .in("course_slug", slugs);

      for (const e of enrollments ?? []) {
        enrollmentBySlug.set(e.course_slug, { id: e.id, completed_at: e.completed_at });
      }

      const enrollmentIds = (enrollments ?? []).map((e) => e.id);
      if (enrollmentIds.length > 0) {
        const { data: progressRows } = await admin
          .from("course_progress")
          .select("enrollment_id")
          .eq("completed", true)
          .in("enrollment_id", enrollmentIds);

        for (const p of progressRows ?? []) {
          completedCountByEnrollment.set(
            p.enrollment_id,
            (completedCountByEnrollment.get(p.enrollment_id) ?? 0) + 1,
          );
        }
      }
    }

    return courses.map((course) => {
      const enrollment = enrollmentBySlug.get(course.slug);
      return {
        ...course,
        lessonCount: lessonCountBySlug.get(course.slug) ?? 0,
        enrolled: !!enrollment,
        completedLessons: enrollment ? (completedCountByEnrollment.get(enrollment.id) ?? 0) : 0,
        completedAt: enrollment?.completed_at ?? null,
      };
    });
  } catch {
    return [];
  }
}

export async function getCourseBySlug(slug: string): Promise<DbBlogPost | null> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .not("topic", "is", null)
      .eq("published", true)
      .maybeSingle();
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
}

export type CourseProgressState = {
  enrolled: boolean;
  completedAt: string | null;
  completedLessonIds: string[];
};

/** Shared by the /api/courses/[slug] route and the courses/[slug] Server Component page, so
 * the enrollment+progress lookup logic exists in exactly one place. */
export async function getCourseProgressForUser(
  userId: string,
  slug: string,
): Promise<CourseProgressState> {
  const admin = createAdminClient();
  const { data: enrollment } = await admin
    .from("course_enrollments")
    .select("id, completed_at")
    .eq("user_id", userId)
    .eq("course_slug", slug)
    .maybeSingle();

  if (!enrollment) {
    return { enrolled: false, completedAt: null, completedLessonIds: [] };
  }

  const { data: progressRows } = await admin
    .from("course_progress")
    .select("lesson_id")
    .eq("enrollment_id", enrollment.id)
    .eq("completed", true);

  return {
    enrolled: true,
    completedAt: enrollment.completed_at,
    completedLessonIds: (progressRows ?? []).map((p) => p.lesson_id),
  };
}

/** Shared by /api/courses/[slug]/enroll and /api/courses/[slug]/payment's Stripe-disabled
 * branches — both need identical "free enrollment" behavior, so it exists in exactly one place. */
export async function enrollUserFree(userId: string, email: string, course: DbBlogPost) {
  const admin = createAdminClient();

  const { data: enrollment, error } = await admin
    .from("course_enrollments")
    .insert({
      user_id: userId,
      course_slug: course.slug,
      course_title: course.title,
      paid_at: null,
      price_paid: null,
    })
    .select()
    .single();

  if (error || !enrollment) throw new Error("Unable to enroll. Please try again.");

  await logAudit({
    action: "create",
    table: "course_enrollments",
    recordId: enrollment.id,
    newData: enrollment,
  });

  const lessons = await getCourseLessons(course.slug);
  await sendCourseEnrollmentEmail(email, course.title, course.slug, lessons.length);
  await sendAdminFormNotification("Course Enrollment", {
    name: email,
    email,
    message: `Enrolled in ${course.title}`,
  });

  return enrollment;
}

export async function getCourseLessons(slug: string): Promise<CourseLesson[]> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("course_lessons")
      .select("*")
      .eq("course_slug", slug)
      .order("order_index", { ascending: true });
    if (error) throw error;
    return data ?? [];
  } catch {
    return [];
  }
}
