import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { sendWaitlistConfirmation } from "@/lib/email/send";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/** Public, unauthenticated write endpoint for waitlist/newsletter email capture. Same
 * service-role rationale as /api/public/form-submissions. */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(`waitlist:${ip}`);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const b = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  const email = typeof b.email === "string" ? b.email.trim() : "";
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }
  const source = typeof b.source === "string" ? b.source.trim().slice(0, 100) : "unknown";

  const admin = createAdminClient();
  const { error } = await admin.from("waitlist").insert({ email, source });

  // A unique-constraint hit just means they're already on the list — treat as success.
  if (error && error.code !== "23505") {
    return NextResponse.json({ error: "Failed to join waitlist. Please try again." }, { status: 500 });
  }

  await sendWaitlistConfirmation(email);

  return NextResponse.json({ success: true }, { status: 201 });
}
