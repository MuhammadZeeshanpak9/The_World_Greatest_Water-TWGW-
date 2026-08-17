import { emailLayout, BRAND_VIOLET } from "./layout";

export function passwordResetEmail(params: { resetLink: string }): {
  subject: string;
  html: string;
} {
  const body = `
    <h1 style="font-family:Georgia,serif;font-size:24px;color:#14142A;margin:0 0 16px;">Reset Your Password</h1>
    <p style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#4a4a5a;margin:0 0 24px;">
      Click the button below to choose a new password. This link expires in 1 hour.
    </p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${params.resetLink}" style="display:inline-block;background-color:${BRAND_VIOLET};color:#ffffff;font-family:Arial,sans-serif;font-size:13px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;text-decoration:none;padding:14px 32px;border-radius:6px;">Reset Password</a>
    </div>
    <p style="font-family:Arial,sans-serif;font-size:13px;line-height:1.6;color:#8e8e9e;margin:24px 0 0;">
      If you didn't request this, you can safely ignore this email — your password will not be changed.
    </p>
  `;

  return {
    subject: "Reset Your ELEV8 WATER Password",
    html: emailLayout(body, "Reset your password — link expires in 1 hour."),
  };
}
