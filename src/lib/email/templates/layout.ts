export const BRAND_VIOLET = "#6B2FA0";
const INK = "#14142A";

/** Escapes user-supplied text before it's interpolated into an email's HTML. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Shared ELEV8 WATER branded wrapper — table-based layout for email-client compatibility. */
export function emailLayout(bodyHtml: string, preheader = ""): string {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin:0;padding:0;background-color:#f7f4fb;font-family:Georgia,serif;">
    ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(preheader)}</div>` : ""}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f4fb;padding:40px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="background-color:${INK};padding:32px 40px;text-align:center;">
                <div style="font-family:Georgia,serif;font-size:24px;color:#ffffff;letter-spacing:2px;">ELEV8 WATER</div>
                <div style="font-family:Arial,sans-serif;font-size:10px;letter-spacing:3px;color:${BRAND_VIOLET};text-transform:uppercase;margin-top:4px;">THE WORLD'S GREATEST WATER</div>
              </td>
            </tr>
            <tr>
              <td style="padding:40px;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:24px 40px;background-color:#f7f4fb;text-align:center;">
                <div style="font-family:Arial,sans-serif;font-size:11px;color:#8e8e9e;">© ${new Date().getFullYear()} ELEV8 WATER. All Rights Reserved.</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
