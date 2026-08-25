import { NextResponse, type NextRequest } from "next/server";
import { getAdminUser, unauthorized } from "@/lib/supabase/authz";
import { createAdminClient } from "@/lib/supabase/admin";
import { getResendClient } from "@/lib/email/resend";
import { newsletterEmail } from "@/lib/email/templates/newsletter";
import { unsubscribeUrlFor } from "@/lib/newsletter";

type Params = { params: Promise<{ id: string }> };

function fromAddress() {
  return `ELEV8 WATER <${process.env.RESEND_FROM_EMAIL}>`;
}

/** Sends a one-off test copy to the first ADMIN_EMAILS entry only. Never touches the campaign's
 * status — a test send must not count as (or block) the real send. */
export async function POST(_request: NextRequest, { params }: Params) {
  const user = await getAdminUser();
  if (!user) return unauthorized();

  const testRecipient = (process.env.ADMIN_EMAILS ?? "").split(",")[0]?.trim();
  if (!testRecipient) {
    return NextResponse.json({ error: "No ADMIN_EMAILS configured to send a test to" }, { status: 500 });
  }

  const { id } = await params;
  const admin = createAdminClient();
  const { data: campaign, error } = await admin
    .from("newsletter_campaigns")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  const { subject, html } = newsletterEmail({
    subject: `[TEST] ${campaign.subject}`,
    content: campaign.content,
    unsubscribeUrl: unsubscribeUrlFor(testRecipient),
  });

  try {
    await getResendClient().emails.send({ from: fromAddress(), to: testRecipient, subject, html });
  } catch {
    return NextResponse.json({ error: "Unable to send test email" }, { status: 500 });
  }

  return NextResponse.json({ success: true, sentTo: testRecipient });
}
