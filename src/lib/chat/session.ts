import type { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "elev8_chat_session";
const MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

/** Reads the ELEV8 V.A. chat session cookie, or creates and sets a new one on `response`. */
export function getOrCreateChatSessionId(request: NextRequest, response: NextResponse): string {
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

/** Reads the chat session cookie without creating one. */
export function getChatSessionId(request: NextRequest): string | undefined {
  return request.cookies.get(COOKIE_NAME)?.value;
}
