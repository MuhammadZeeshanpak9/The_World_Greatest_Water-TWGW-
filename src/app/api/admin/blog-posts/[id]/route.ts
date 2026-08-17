import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminUser, unauthorized } from "@/lib/supabase/authz";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/supabase/audit";

type Params = { params: Promise<{ id: string }> };

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
    return NextResponse.json({ error: "Invalid blog post data" }, { status: 400 });
  }
  const b = body as Record<string, unknown>;

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (typeof b.slug === "string") {
    updates.slug = b.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
  }
  if (typeof b.title === "string") updates.title = b.title.trim();
  if (typeof b.teaser === "string") updates.teaser = b.teaser.trim();
  if (typeof b.content === "string") updates.content = b.content;
  if (typeof b.topic === "string") updates.topic = b.topic.trim();
  if (typeof b.published === "boolean") updates.published = b.published;

  const admin = createAdminClient();
  const { data: oldData } = await admin.from("blog_posts").select("*").eq("id", id).single();

  const { data, error } = await admin
    .from("blog_posts")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({ action: "update", table: "blog_posts", recordId: id, oldData, newData: data });

  revalidatePath("/blogs");
  if (data.slug) revalidatePath(`/blogs/${data.slug}`);

  return NextResponse.json({ post: data });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const user = await getAdminUser();
  if (!user) return unauthorized();

  const { id } = await params;
  const admin = createAdminClient();

  const { data: oldData } = await admin.from("blog_posts").select("*").eq("id", id).single();
  const { error } = await admin.from("blog_posts").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({ action: "delete", table: "blog_posts", recordId: id, oldData });

  return NextResponse.json({ success: true });
}
