import { emailLayout, escapeHtml, BRAND_VIOLET } from "./layout";

export function courseEnrollmentEmail(params: {
  courseTitle: string;
  lessonCount: number;
  courseUrl: string;
}): { subject: string; html: string } {
  const { courseTitle, lessonCount, courseUrl } = params;

  const body = `
    <p style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${BRAND_VIOLET};margin:0 0 8px;">I AM ready to learn</p>
    <h1 style="font-family:Georgia,serif;font-size:26px;color:#14142A;margin:0 0 16px;">I AM enrolled — ${escapeHtml(courseTitle)}</h1>
    <p style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#4a4a5a;margin:0 0 16px;">
      Your course is ready — ${lessonCount} lesson${lessonCount === 1 ? "" : "s"} waiting for you, whenever you're ready to begin.
    </p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${courseUrl}" style="display:inline-block;background-color:${BRAND_VIOLET};color:#ffffff;font-family:Arial,sans-serif;font-size:13px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;text-decoration:none;padding:14px 32px;border-radius:6px;">Start Learning</a>
    </div>
  `;

  return {
    subject: `I AM enrolled — ${courseTitle}`,
    html: emailLayout(body, `Your course is ready: ${courseTitle}`),
  };
}
