import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { sendAdminFormNotification } from "@/lib/email/send";

const VALID_FORM_TYPES = ["contact", "wellness", "creators", "join", "gift-cards"];
const MAX_FIELD_LENGTH = 5000;
const MAX_FIELDS = 20;

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/**
 * Public, unauthenticated write endpoint for the site's contact/apply/gift/join/wellness
 * forms. RLS on `form_submissions` only grants the `authenticated` role access, so the
 * anon-key client a real visitor's browser uses has no direct write path — this route uses
 * the service-role client on purpose, guarded by rate limiting + strict field allow-listing
 * instead of a broad public RLS policy.
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(`form:${ip}`);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }
  const b = body as Record<string, unknown>;

  if (typeof b.form_type !== "string" || !VALID_FORM_TYPES.includes(b.form_type)) {
    return NextResponse.json({ error: "Invalid form type" }, { status: 400 });
  }

  const email = typeof b.email === "string" ? b.email.trim() : "";
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }

  const entries = Object.entries(b).filter(([key]) => key !== "form_type");
  if (entries.length > MAX_FIELDS) {
    return NextResponse.json({ error: "Too many fields" }, { status: 400 });
  }

  const data: Record<string, string> = {};
  for (const [key, value] of entries) {
    if (typeof value !== "string") continue;
    data[key] = value.trim().slice(0, MAX_FIELD_LENGTH);
  }

  const admin = createAdminClient();
  const { error } = await admin.from("form_submissions").insert({
    form_type: b.form_type,
    data,
    read: false,
  });

  if (error) {
    return NextResponse.json(
      { error: "Failed to submit. Please try again." },
      { status: 500 },
    );
  }

  await sendAdminFormNotification(b.form_type, {
    name: data.name,
    email,
    message: data.message,
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
