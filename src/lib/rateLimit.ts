// In-memory rate limiting — 5 attempts per IP per 15-minute window.
//
// Known limitation (tracked for M7): this Map lives in a single serverless
// function instance's memory. On Vercel, concurrent/cold-started instances
// each get their own Map, so a determined attacker distributing requests
// across instances could exceed 5 attempts in practice, and the counter
// resets on every cold start. Fine as a first line of defense for now;
// durable rate limiting (e.g. a shared Supabase table or Redis/Upstash) is
// the correct fix once this needs to hold up under real attack traffic.

const attempts = new Map<string, { count: number; lastAttempt: number }>();

export function checkRateLimit(
  ip: string,
  options?: { maxAttempts?: number; windowMs?: number },
): { allowed: boolean; remainingAttempts: number } {
  const now = Date.now();
  const windowMs = options?.windowMs ?? 15 * 60 * 1000;
  const maxAttempts = options?.maxAttempts ?? 5;
  const record = attempts.get(ip);

  if (!record || now - record.lastAttempt > windowMs) {
    attempts.set(ip, { count: 1, lastAttempt: now });
    return { allowed: true, remainingAttempts: maxAttempts - 1 };
  }

  if (record.count >= maxAttempts) {
    return { allowed: false, remainingAttempts: 0 };
  }

  record.count++;
  record.lastAttempt = now;
  return { allowed: true, remainingAttempts: maxAttempts - record.count };
}

export function resetRateLimit(ip: string) {
  attempts.delete(ip);
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
