import { emailLayout, escapeHtml, BRAND_VIOLET } from "./layout";

export function welcomeEmail(params: { name: string; shopUrl: string }): {
  subject: string;
  html: string;
} {
  const name = escapeHtml(params.name || "there");

  const body = `
    <h1 style="font-family:Georgia,serif;font-size:28px;color:#14142A;margin:0 0 16px;">Welcome to THE WORLD'S GREATEST WATER</h1>
    <p style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#4a4a5a;margin:0 0 16px;">
      Hi ${name},
    </p>
    <p style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#4a4a5a;margin:0 0 16px;">
      I AM created with YOU in mind. Your account is ready — ultra-purified water, infused with 528hz binaural frequency, is waiting for you.
    </p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${params.shopUrl}" style="display:inline-block;background-color:${BRAND_VIOLET};color:#ffffff;font-family:Arial,sans-serif;font-size:13px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;text-decoration:none;padding:14px 32px;border-radius:6px;">Shop Now</a>
    </div>
  `;

  return {
    subject: "Welcome to ELEV8 WATER",
    html: emailLayout(body, "I AM created with YOU in mind."),
  };
}
