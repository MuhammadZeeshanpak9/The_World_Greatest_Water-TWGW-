import { emailLayout, escapeHtml, BRAND_VIOLET } from "./layout";

/** Newsletter body content is authored as plain text paragraphs (blank-line separated) by the
 * admin and escaped here — same trust boundary as every other admin-authored email body in this
 * app (adminNotification, courseEnrollment, etc.), not raw HTML from the campaign editor. */
export function newsletterEmail({
  subject,
  content,
  unsubscribeUrl,
}: {
  subject: string;
  content: string;
  unsubscribeUrl: string;
}): { subject: string; html: string } {
  const paragraphs = content
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map(
      (p) =>
        `<p style="margin:0 0 16px;font-family:Georgia,serif;font-size:15px;line-height:1.8;color:#14142A;">${escapeHtml(p).replace(/\n/g, "<br/>")}</p>`,
    )
    .join("");

  const bodyHtml = `
    <h1 style="margin:0 0 20px;font-family:Georgia,serif;font-size:26px;color:${BRAND_VIOLET};">${escapeHtml(subject)}</h1>
    ${paragraphs}
    <p style="margin:32px 0 0;font-family:Arial,sans-serif;font-size:11px;color:#8e8e9e;text-align:center;">
      <a href="${unsubscribeUrl}" style="color:#8e8e9e;">Unsubscribe from these emails</a>
    </p>
  `;

  return { subject, html: emailLayout(bodyHtml, subject) };
}
