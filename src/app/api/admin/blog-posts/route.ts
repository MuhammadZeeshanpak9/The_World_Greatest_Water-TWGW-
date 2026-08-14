import { NextResponse, type NextRequest } from "next/server";
import { getAdminUser, unauthorized } from "@/lib/supabase/authz";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/supabase/audit";

const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return unauthorized();

  const { searchParams } = request.nextUrl;
  const search = searchParams.get("search")?.trim() ?? "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const admin = createAdminClient();
  let query = admin.from("blog_posts").select("*", { count: "exact" });
  if (search) query = query.ilike("title", `%${search}%`);

  const from = (page - 1) * PAGE_SIZE;
  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ posts: data, total: count ?? 0, page, pageSize: PAGE_SIZE });
}

type BlogPostInput = {
  slug: string;
  title: string;
  teaser?: string;
  content?: string;
  topic?: string;
  published: boolean;
};

function sanitizeBlogPostInput(body: unknown): BlogPostInput | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;

  if (typeof b.slug !== "string" || !b.slug.trim()) return null;
  if (typeof b.title !== "string" || !b.title.trim()) return null;

  return {
    slug: b.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-"),
    title: b.title.trim(),
    teaser: typeof b.teaser === "string" ? b.teaser.trim() : undefined,
    content: typeof b.content === "string" ? b.content : undefined,
    topic: typeof b.topic === "string" ? b.topic.trim() : undefined,
    published: typeof b.published === "boolean" ? b.published : false,
  };
}

export async function POST(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return unauthorized();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const input = sanitizeBlogPostInput(body);
  if (!input) return NextResponse.json({ error: "Invalid blog post data" }, { status: 400 });

  const admin = createAdminClient();
  const { data, error } = await admin.from("blog_posts").insert(input).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({ action: "create", table: "blog_posts", recordId: data.id, newData: data });

  return NextResponse.json({ post: data }, { status: 201 });
}
