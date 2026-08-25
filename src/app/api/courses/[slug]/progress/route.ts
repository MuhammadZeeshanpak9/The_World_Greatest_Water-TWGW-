import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCourseLessons } from "@/lib/courses";
import { logAudit } from "@/lib/supabase/audit";

type Params = { params: Promise<{ slug: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  const { slug } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const b = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  const lessonId = typeof b.lessonId === "string" ? b.lessonId : "";
  const completed = typeof b.completed === "boolean" ? b.completed : true;

  if (!lessonId) {
    return NextResponse.json({ error: "lessonId is required" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: enrollment } = await admin
    .from("course_enrollments")
    .select("id, completed_at")
    .eq("user_id", user.id)
    .eq("course_slug", slug)
    .maybeSingle();

  if (!enrollment) {
    return NextResponse.json({ error: "You are not enrolled in this course" }, { status: 403 });
  }

  const { error: upsertError } = await admin.from("course_progress").upsert(
    {
      enrollment_id: enrollment.id,
      lesson_id: lessonId,
      completed,
      completed_at: completed ? new Date().toISOString() : null,
    },
    { onConflict: "enrollment_id,lesson_id" },
  );

  if (upsertError) {
    return NextResponse.json({ error: "Unable to update progress" }, { status: 500 });
  }

  const lessons = await getCourseLessons(slug);
  const { data: progressRows } = await admin
    .from("course_progress")
    .select("lesson_id")
    .eq("enrollment_id", enrollment.id)
    .eq("completed", true);

  const completedCount = (progressRows ?? []).length;
  const progressPercentage =
    lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;
  const isFullyComplete = lessons.length > 0 && completedCount >= lessons.length;

  // completed_at is one-way: only set it the first time 100% is reached, and never unset it
  // afterward — even if a new lesson gets added later and the percentage drops back down.
  if (isFullyComplete && !enrollment.completed_at) {
    await admin
      .from("course_enrollments")
      .update({ completed_at: new Date().toISOString() })
      .eq("id", enrollment.id);
  }

  await logAudit({
    action: "update",
    table: "course_progress",
    recordId: enrollment.id,
    newData: { lessonId, completed },
  });

  return NextResponse.json({
    progress_percentage: progressPercentage,
    completed: isFullyComplete || !!enrollment.completed_at,
  });
}
