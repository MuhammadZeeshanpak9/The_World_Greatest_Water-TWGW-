import { type NextRequest } from "next/server";
import { getAdminUser } from "@/lib/supabase/authz";
import { createAdminClient } from "@/lib/supabase/admin";
import { newsletterEmail } from "@/lib/email/templates/newsletter";
import { unsubscribeUrlFor } from "@/lib/newsletter";

type Params = { params: Promise<{ id: string }> };

/** Opened via direct browser navigation (new tab), not fetch() — same-origin admin session
 * cookie authenticates it normally. Returns raw text/html, not JSON, so the browser renders it. */
export async function GET(_request: NextRequest, { params }: Params) {
  const user = await getAdminUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  const admin = createAdminClient();
  const { data: campaign, error } = await admin
    .from("newsletter_campaigns")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !campaign) {
    return new Response("Campaign not found", { status: 404 });
  }

  const { html } = newsletterEmail({
    subject: campaign.subject,
    content: campaign.content,
    unsubscribeUrl: unsubscribeUrlFor("preview@example.com"),
  });

  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
