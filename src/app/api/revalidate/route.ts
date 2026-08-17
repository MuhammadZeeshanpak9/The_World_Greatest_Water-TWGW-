import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const b = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  const path = typeof b.path === "string" ? b.path : "";
  const tag = typeof b.tag === "string" ? b.tag : "";

  if (!path && !tag) {
    return NextResponse.json({ error: "path or tag is required" }, { status: 400 });
  }

  if (path) revalidatePath(path);
  if (tag) revalidateTag(tag, "max");

  return NextResponse.json({ revalidated: true });
}
