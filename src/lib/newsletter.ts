import { createAdminClient } from "@/lib/supabase/admin";

export function unsubscribeUrlFor(email: string): string {
  return `${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe?email=${encodeURIComponent(email)}`;
}

/** Waitlist emails minus anyone who has unsubscribed. Server-only. */
export async function getNewsletterRecipients(): Promise<string[]> {
  const admin = createAdminClient();

  const [{ data: subscribers }, { data: unsubscribed }] = await Promise.all([
    admin.from("waitlist").select("email"),
    admin.from("newsletter_unsubscribes").select("email"),
  ]);

  const unsubscribedSet = new Set((unsubscribed ?? []).map((u) => u.email.toLowerCase()));
  const seen = new Set<string>();
  const recipients: string[] = [];

  for (const s of subscribers ?? []) {
    const email = s.email.toLowerCase();
    if (unsubscribedSet.has(email) || seen.has(email)) continue;
    seen.add(email);
    recipients.push(s.email);
  }

  return recipients;
}
