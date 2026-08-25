import { NextResponse, type NextRequest } from "next/server";
import { getAdminUser, unauthorized } from "@/lib/supabase/authz";
import { createAdminClient } from "@/lib/supabase/admin";
import { getResendClient } from "@/lib/email/resend";
import { logAudit } from "@/lib/supabase/audit";
import { newsletterEmail } from "@/lib/email/templates/newsletter";
import { getNewsletterRecipients, unsubscribeUrlFor } from "@/lib/newsletter";

export const maxDuration = 60;

const BATCH_SIZE = 50;

function fromAddress() {
  return `ELEV8 WATER <${process.env.RESEND_FROM_EMAIL}>`;
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return chunks;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type Params = { params: Promise<{ id: string }> };

/** Sends the campaign to every current waitlist subscriber minus unsubscribes, then marks the
 * campaign 'sent'. Rejects anything not currently 'draft' so a campaign can only ever go out once.
 *
 * Uses resend.batch.send() (verified present in the installed resend@6.20.0 client — `typeof
 * resend.batch.send === "function"`), 50 recipients per batch with a 1s delay between batches, per
 * your instruction. No sequential-loop fallback was needed since batch.send() is available. */
export async function POST(_request: NextRequest, { params }: Params) {
  const user = await getAdminUser();
  if (!user) return unauthorized();

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
  if (campaign.status !== "draft") {
    return NextResponse.json({ error: "This campaign has already been sent" }, { status: 409 });
  }

  const recipients = await getNewsletterRecipients();
  if (recipients.length === 0) {
    return NextResponse.json({ error: "No subscribers to send to" }, { status: 400 });
  }

  const resend = getResendClient();
  const batches = chunk(recipients, BATCH_SIZE);

  for (let i = 0; i < batches.length; i++) {
    const payload = batches[i].map((email) => {
      const { subject, html } = newsletterEmail({
        subject: campaign.subject,
        content: campaign.content,
        unsubscribeUrl: unsubscribeUrlFor(email),
      });
      return {
        from: fromAddress(),
        to: email,
        subject,
        html,
        headers: {
          "List-Unsubscribe": `<${unsubscribeUrlFor(email)}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      };
    });

    await resend.batch.send(payload);

    if (i < batches.length - 1) {
      await sleep(1000);
    }
  }

  const { data: updated, error: updateError } = await admin
    .from("newsletter_campaigns")
    .update({
      status: "sent",
      sent_at: new Date().toISOString(),
      recipient_count: recipients.length,
    })
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: "Emails were sent, but the campaign status failed to update" }, { status: 500 });
  }

  await logAudit({
    action: "update",
    table: "newsletter_campaigns",
    recordId: id,
    oldData: campaign,
    newData: updated,
  });

  return NextResponse.json({ campaign: updated, recipientCount: recipients.length });
}
