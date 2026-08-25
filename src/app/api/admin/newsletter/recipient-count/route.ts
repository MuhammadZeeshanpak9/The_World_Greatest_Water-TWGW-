import { NextResponse } from "next/server";
import { getAdminUser, unauthorized } from "@/lib/supabase/authz";
import { getNewsletterRecipients } from "@/lib/newsletter";

export async function GET() {
  const user = await getAdminUser();
  if (!user) return unauthorized();

  const recipients = await getNewsletterRecipients();
  return NextResponse.json({ count: recipients.length });
}
