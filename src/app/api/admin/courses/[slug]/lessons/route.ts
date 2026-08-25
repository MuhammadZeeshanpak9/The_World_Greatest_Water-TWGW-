import { NextResponse, type NextRequest } from "next/server";
import { getAdminUser, unauthorized } from "@/lib/supabase/authz";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/supabase/audit";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const user = await getAdminUser();
  if (!user) return unauthorized();

  const { slug } = await params;
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("course_lessons")
    .select("*")
    .eq("course_slug", slug)
    .order("order_index", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Unable to load lessons" }, { status: 500 });
  }

  return NextResponse.json({ lessons: data ?? [] });
}

export async function POST(request: NextRequest, { params }: Params) {
  const user = await getAdminUser();
  if (!user) return unauthorized();

  const { slug } = await params;

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

  if (typeof b.title !== "string" || !b.title.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const admin = createAdminClient();

  let orderIndex = typeof b.order_index === "number" ? b.order_index : undefined;
  if (orderIndex === undefined) {
    const { count } = await admin
      .from("course_lessons")
      .select("*", { count: "exact", head: true })
      .eq("course_slug", slug);
    orderIndex = (count ?? 0) + 1;
  }

  const { data, error } = await admin
    .from("course_lessons")
    .insert({
      course_slug: slug,
      title: b.title.trim(),
      content: typeof b.content === "string" && b.content.trim() ? b.content : null,
      video_url: typeof b.video_url === "string" && b.video_url.trim() ? b.video_url.trim() : null,
      order_index: orderIndex,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Unable to create lesson" }, { status: 500 });
  }

  await logAudit({ action: "create", table: "course_lessons", recordId: data.id, newData: data });

  return NextResponse.json({ lesson: data }, { status: 201 });
}
