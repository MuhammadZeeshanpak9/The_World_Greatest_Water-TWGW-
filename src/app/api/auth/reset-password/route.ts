import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { isValidEmail } from "@/lib/validation";
import { sendPasswordReset } from "@/lib/email/send";

const GENERIC_RESPONSE = {
  success: true,
  message: "If an account exists for that email, you'll receive reset instructions shortly.",
};

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(`reset-password:${ip}`, {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000,
  });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(GENERIC_RESPONSE);
  }

  const b = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";

  // Always return the same generic response regardless of outcome — including when rate
  // limited — so nothing here can be used to probe whether an email is registered.
  if (allowed && isValidEmail(email)) {
    const admin = createAdminClient();
    const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`;

    const { data, error } = await admin.auth.admin.generateLink({
      type: "recovery",
      email,
      options: { redirectTo },
    });

    if (!error && data?.properties?.action_link) {
      await sendPasswordReset(email, data.properties.action_link);
    }
  }

  return NextResponse.json(GENERIC_RESPONSE);
}
