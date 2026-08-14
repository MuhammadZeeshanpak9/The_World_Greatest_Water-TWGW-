import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, resetRateLimit, getClientIp } from "@/lib/rateLimit";
import { logAudit } from "@/lib/supabase/audit";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { allowed, remainingAttempts } = checkRateLimit(ip);

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
    // TEMPORARY — diagnosing a login failure. Remove once resolved.
    console.error("[login] Supabase error:", error?.message);
    return NextResponse.json(
      { error: "Invalid credentials", remainingAttempts },
      { status: 401 },
    );
  }

  resetRateLimit(ip);
  await logAudit({ action: "login", table: "auth", recordId: data.user.id });

  return NextResponse.json({ user: { id: data.user.id, email: data.user.email } });
}
