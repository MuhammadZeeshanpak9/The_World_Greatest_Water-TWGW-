import { NextResponse, type NextRequest } from "next/server";
import { getAdminUser, unauthorized } from "@/lib/supabase/authz";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/supabase/audit";

type Params = { params: Promise<{ slug: string; id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  const user = await getAdminUser();
  if (!user) return unauthorized();

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid lesson data" }, { status: 400 });
  }
  const b = body as Record<string, unknown>;

  const updates: Record<string, unknown> = {};
  if (typeof b.title === "string" && b.title.trim()) updates.title = b.title.trim();
  if (typeof b.content === "string") updates.content = b.content.trim() ? b.content : null;
  if (typeof b.video_url === "string") updates.video_url = b.video_url.trim() || null;
  if (typeof b.order_index === "number") updates.order_index = b.order_index;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: oldData } = await admin.from("course_lessons").select("*").eq("id", id).single();

  const { data, error } = await admin
    .from("course_lessons")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Unable to update lesson" }, { status: 500 });
  }

  await logAudit({ action: "update", table: "course_lessons", recordId: id, oldData, newData: data });

  return NextResponse.json({ lesson: data });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const user = await getAdminUser();
  if (!user) return unauthorized();

  const { id } = await params;
  const admin = createAdminClient();

  const { data: oldData } = await admin.from("course_lessons").select("*").eq("id", id).single();
  const { error } = await admin.from("course_lessons").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Unable to delete lesson" }, { status: 500 });
  }

  await logAudit({ action: "delete", table: "course_lessons", recordId: id, oldData });

  return NextResponse.json({ success: true });
}
