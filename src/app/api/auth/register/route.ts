import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { isValidEmail, isStrongPassword } from "@/lib/validation";
import { sendWelcomeEmail } from "@/lib/email/send";
import { logAudit } from "@/lib/supabase/audit";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(`register:${ip}`, {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000,
  });

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many registration attempts. Please try again later." },
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
  const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
  const password = typeof b.password === "string" ? b.password : "";
  const fullName = typeof b.fullName === "string" ? b.fullName.trim().slice(0, 100) : "";

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }
  if (!isStrongPassword(password)) {
    return NextResponse.json(
      {
        error:
          "Password must be at least 8 characters and include an uppercase letter, a number, and a special character",
      },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error || !data.user) {
    // Never reveal whether the email is already registered.
    return NextResponse.json(
      {
        error:
          "Unable to complete registration. If you already have an account, try logging in instead.",
      },
      { status: 400 },
    );
  }

  await logAudit({ action: "create", table: "auth", recordId: data.user.id });

  if (data.session) {
    await sendWelcomeEmail(email, fullName || email);
    return NextResponse.json({
      confirmed: true,
      user: { id: data.user.id, email: data.user.email },
    });
  }

  return NextResponse.json({
    confirmed: false,
    message: "Check your email to confirm your account before signing in.",
  });
}
