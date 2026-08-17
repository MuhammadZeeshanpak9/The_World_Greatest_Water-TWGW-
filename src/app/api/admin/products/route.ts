import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminUser, unauthorized } from "@/lib/supabase/authz";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/supabase/audit";

const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return unauthorized();

  const { searchParams } = request.nextUrl;
  const search = searchParams.get("search")?.trim() ?? "";
  const category = searchParams.get("category")?.trim() ?? "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const admin = createAdminClient();
  let query = admin.from("products").select("*", { count: "exact" });
  if (search) query = query.ilike("name", `%${search}%`);
  if (category) query = query.eq("category", category);

  const from = (page - 1) * PAGE_SIZE;
  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ products: data, total: count ?? 0, page, pageSize: PAGE_SIZE });
}

type ProductInput = {
  name: string;
  subtitle?: string;
  description?: string;
  price: number;
  per_unit?: string;
  category: string;
  status: "available" | "sold-out" | "coming-soon";
  slug: string;
  image_url?: string;
};

function sanitizeProductInput(body: unknown): ProductInput | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;

  if (typeof b.name !== "string" || !b.name.trim()) return null;
  if (typeof b.price !== "number" || Number.isNaN(b.price)) return null;
  if (typeof b.category !== "string" || !b.category.trim()) return null;
  if (typeof b.slug !== "string" || !b.slug.trim()) return null;

  const status = b.status === "sold-out" || b.status === "coming-soon" ? b.status : "available";

  return {
    name: b.name.trim(),
    subtitle: typeof b.subtitle === "string" ? b.subtitle.trim() : undefined,
    description: typeof b.description === "string" ? b.description.trim() : undefined,
    price: b.price,
    per_unit: typeof b.per_unit === "string" ? b.per_unit.trim() : undefined,
    category: b.category.trim(),
    status,
    slug: b.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-"),
    image_url: typeof b.image_url === "string" ? b.image_url : undefined,
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

  const input = sanitizeProductInput(body);
  if (!input) return NextResponse.json({ error: "Invalid product data" }, { status: 400 });

  const admin = createAdminClient();
  const { data, error } = await admin.from("products").insert(input).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({ action: "create", table: "products", recordId: data.id, newData: data });

  revalidatePath("/shop");
  revalidatePath("/");

  return NextResponse.json({ product: data }, { status: 201 });
}
