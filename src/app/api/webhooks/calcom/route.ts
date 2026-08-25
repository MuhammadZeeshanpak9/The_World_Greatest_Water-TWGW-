import { NextResponse, type NextRequest } from "next/server";
import { after } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendAdminFormNotification } from "@/lib/email/send";
import { logAudit } from "@/lib/supabase/audit";

type CalAttendee = { email: string; name: string };
type CalBookingPayload = {
  uid: string;
  title?: string;
  startTime: string;
  endTime: string;
  attendees?: CalAttendee[];
  eventType?: { slug?: string; title?: string };
};

function verifySignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  const expected = crypto
    .createHmac("sha256", process.env.CALCOM_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest("hex");

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/**
 * Cal.com signs with HMAC-SHA256 over the raw body — must verify before JSON.parse(), since
 * re-serializing parsed JSON is not guaranteed byte-identical to what was signed.
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-cal-signature-256");

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: { triggerEvent?: string; payload?: CalBookingPayload };
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const triggerEvent = body.triggerEvent ?? "";
  const payload = body.payload;

  if (!payload?.uid) {
    return NextResponse.json({ error: "Missing booking uid" }, { status: 400 });
  }

  const admin = createAdminClient();
  const attendee = payload.attendees?.[0];
  const wellnessType =
    payload.eventType?.slug ?? payload.eventType?.title ?? payload.title ?? "unknown";

  if (triggerEvent === "BOOKING_CANCELLED") {
    await admin
      .from("cal_bookings")
      .update({ status: "cancelled" })
      .eq("cal_booking_id", payload.uid);
    await logAudit({
      action: "update",
      table: "cal_bookings",
      recordId: payload.uid,
      newData: { status: "cancelled" },
    });
  } else if (triggerEvent === "BOOKING_RESCHEDULED") {
    await admin
      .from("cal_bookings")
      .update({ start_time: payload.startTime, end_time: payload.endTime })
      .eq("cal_booking_id", payload.uid);
    await logAudit({
      action: "update",
      table: "cal_bookings",
      recordId: payload.uid,
      newData: { start_time: payload.startTime, end_time: payload.endTime },
    });
  } else if (triggerEvent === "BOOKING_CREATED") {
    // Upsert (not insert) — Cal.com retries webhooks on timeout, so this must be idempotent.
    const { error } = await admin.from("cal_bookings").upsert(
      {
        cal_booking_id: payload.uid,
        wellness_type: wellnessType,
        customer_name: attendee?.name ?? "Unknown",
        customer_email: attendee?.email ?? "unknown@unknown.com",
        start_time: payload.startTime,
        end_time: payload.endTime,
        status: "confirmed",
      },
      { onConflict: "cal_booking_id" },
    );

    if (!error) {
      await logAudit({ action: "create", table: "cal_bookings", recordId: payload.uid });

      // Deferred past the response via after() so the webhook itself returns immediately —
      // Cal.com only needs the DB write to succeed; the notification email is not critical
      // to that, and email failures must never affect the webhook's own success.
      after(async () => {
        await sendAdminFormNotification("Wellness Booking", {
          name: attendee?.name ?? "Unknown",
          email: attendee?.email ?? "unknown@unknown.com",
          message: `${wellnessType} — ${payload.startTime}`,
        });
      });
    }
  }

  return NextResponse.json({ received: true });
}
