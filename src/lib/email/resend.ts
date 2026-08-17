import { Resend } from "resend";

let client: Resend | null = null;

/** Lazily-created Resend client singleton. */
export function getResendClient(): Resend {
  if (!client) {
    client = new Resend(process.env.RESEND_API_KEY!);
  }
  return client;
}
