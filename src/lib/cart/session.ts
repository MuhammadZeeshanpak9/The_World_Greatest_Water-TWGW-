import type { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "elev8_session";
const MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

/** Reads the guest cart session cookie, or creates and sets a new one on `response`. */
export function getOrCreateSessionId(request: NextRequest, response: NextResponse): string {
  const existing = request.cookies.get(COOKIE_NAME)?.value;
  if (existing) return existing;

  const sessionId = crypto.randomUUID();
  response.cookies.set(COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE_SECONDS,
    path: "/",
  });
  return sessionId;
}

/** Reads the guest cart session cookie without creating one. */
export function getSessionId(request: NextRequest): string | undefined {
  return request.cookies.get(COOKIE_NAME)?.value;
}
