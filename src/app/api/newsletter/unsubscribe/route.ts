import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

const GENERIC_RESPONSE = {
  message: "If that email is subscribed, it has been removed from our list.",
};

/** Public, unauthenticated endpoint. Always returns the same generic response regardless of
 * whether the email was actually subscribed, so this can't be used to probe the subscriber list. */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(`newsletter-unsubscribe:${ip}`, {
    maxAttempts: 5,
    windowMs: 60 * 60 * 1000,
  });
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(GENERIC_RESPONSE);
  }

  const b = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  const email = typeof b.email === "string" ? b.email.trim() : "";
  if (!email || !isValidEmail(email)) {
    return NextResponse.json(GENERIC_RESPONSE);
  }

  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("newsletter_unsubscribes")
    .select("id")
    .ilike("email", email)
    .maybeSingle();

  if (!existing) {
    await admin.from("newsletter_unsubscribes").insert({ email });
  }

  return NextResponse.json(GENERIC_RESPONSE);
}
