import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCourseBySlug, getCourseLessons, getCourseProgressForUser } from "@/lib/courses";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { slug } = await params;

  const course = await getCourseBySlug(slug);
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const lessons = await getCourseLessons(slug);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const progress = user
    ? await getCourseProgressForUser(user.id, slug)
    : { enrolled: false, completedAt: null, completedLessonIds: [] };

  const progressPercentage =
    lessons.length > 0
      ? Math.round((progress.completedLessonIds.length / lessons.length) * 100)
      : 0;

  return NextResponse.json({
    course,
    lessons,
    enrolled: progress.enrolled,
    completedAt: progress.completedAt,
    completedLessonIds: progress.completedLessonIds,
    progressPercentage,
  });
}
