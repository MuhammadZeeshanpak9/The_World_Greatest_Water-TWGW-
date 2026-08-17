import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit, resetRateLimit, getClientIp } from "@/lib/rateLimit";
import { getSessionId } from "@/lib/cart/session";
import { mergeGuestCart } from "@/lib/cart/merge";
import { logAudit } from "@/lib/supabase/audit";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rateLimitKey = `login:${ip}`;
  const { allowed, remainingAttempts } = checkRateLimit(rateLimitKey);

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again in 15 minutes." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const b = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  const email = typeof b.email === "string" ? b.email.trim() : "";
  const password = typeof b.password === "string" ? b.password : "";

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return NextResponse.json(
      { error: "Invalid email or password", remainingAttempts },
      { status: 401 },
    );
  }

  resetRateLimit(rateLimitKey);

  const sessionId = getSessionId(request);
  if (sessionId) {
    await mergeGuestCart(data.user.id, sessionId);
  }

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("user_profiles")
    .select("*")
    .eq("id", data.user.id)
    .maybeSingle();

  await logAudit({ action: "login", table: "auth", recordId: data.user.id });

  return NextResponse.json({
    user: { id: data.user.id, email: data.user.email },
    profile,
  });
}
