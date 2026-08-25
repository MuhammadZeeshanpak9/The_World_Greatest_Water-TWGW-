import { NextResponse } from "next/server";
import { getAdminUser, unauthorized } from "@/lib/supabase/authz";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const user = await getAdminUser();
  if (!user) return unauthorized();

  const admin = createAdminClient();

  const { data: posts, error } = await admin
    .from("blog_posts")
    .select("*")
    .not("topic", "is", null)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Unable to load courses" }, { status: 500 });
  }

  const courses = posts ?? [];
  const slugs = courses.map((c) => c.slug);

  const [{ data: enrollments }, { data: lessons }] = await Promise.all([
    admin.from("course_enrollments").select("course_slug").in("course_slug", slugs),
    admin.from("course_lessons").select("course_slug").in("course_slug", slugs),
  ]);

  const enrollmentCountBySlug = new Map<string, number>();
  for (const e of enrollments ?? []) {
    enrollmentCountBySlug.set(e.course_slug, (enrollmentCountBySlug.get(e.course_slug) ?? 0) + 1);
  }
  const lessonCountBySlug = new Map<string, number>();
  for (const l of lessons ?? []) {
    lessonCountBySlug.set(l.course_slug, (lessonCountBySlug.get(l.course_slug) ?? 0) + 1);
  }

  const result = courses.map((c) => ({
    ...c,
    enrollmentCount: enrollmentCountBySlug.get(c.slug) ?? 0,
    lessonCount: lessonCountBySlug.get(c.slug) ?? 0,
  }));

  return NextResponse.json({ courses: result });
}
