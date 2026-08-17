import { emailLayout, BRAND_VIOLET } from "./layout";

export function waitlistConfirmationEmail(): { subject: string; html: string } {
  const body = `
    <p style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${BRAND_VIOLET};margin:0 0 8px;">I AM waiting for the GREATEST</p>
    <h1 style="font-family:Georgia,serif;font-size:28px;color:#14142A;margin:0 0 16px;">YOU are on the list</h1>
    <p style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#4a4a5a;margin:0;">
      We'll let you know the moment it's ready. Thank you for your patience — the wait is part of the elevation.
    </p>
  `;

  return {
    subject: "You're On The List — ELEV8 WATER",
    html: emailLayout(body, "YOU are on the list."),
  };
}
