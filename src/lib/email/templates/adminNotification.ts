import { emailLayout, escapeHtml } from "./layout";

export function adminNotificationEmail(params: {
  formType: string;
  name?: string;
  email: string;
  date: string;
  message?: string;
}): { subject: string; html: string } {
  const { formType, name, email, date, message } = params;

  const body = `
    <h1 style="font-family:Georgia,serif;font-size:22px;color:#14142A;margin:0 0 20px;">New ${escapeHtml(formType)} Submission</h1>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;font-size:14px;color:#4a4a5a;">
      <tr><td style="padding:6px 0;font-weight:bold;width:100px;">Form</td><td style="padding:6px 0;">${escapeHtml(formType)}</td></tr>
      <tr><td style="padding:6px 0;font-weight:bold;">Name</td><td style="padding:6px 0;">${name ? escapeHtml(name) : "—"}</td></tr>
      <tr><td style="padding:6px 0;font-weight:bold;">Email</td><td style="padding:6px 0;">${escapeHtml(email)}</td></tr>
      <tr><td style="padding:6px 0;font-weight:bold;">Date</td><td style="padding:6px 0;">${escapeHtml(date)}</td></tr>
      ${message ? `<tr><td style="padding:6px 0;font-weight:bold;vertical-align:top;">Message</td><td style="padding:6px 0;white-space:pre-line;">${escapeHtml(message)}</td></tr>` : ""}
    </table>
  `;

  return {
    subject: `New ${formType} Submission`,
    html: emailLayout(body),
  };
}
