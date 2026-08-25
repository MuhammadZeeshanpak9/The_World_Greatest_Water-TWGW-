import { NextResponse, type NextRequest } from "next/server";
import { after } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendOrderDelivered } from "@/lib/email/send";
import { logAudit } from "@/lib/supabase/audit";

type ShippoTrackingWebhook = {
  event?: string;
  data?: {
    tracking_number?: string;
    carrier?: string;
    tracking_status?: { status?: string };
  };
};

/**
 * Shippo doesn't sign webhook payloads with an HMAC header the way Stripe/Coinbase/Cal.com do —
 * verified this against the SDK (no signing helper exposed anywhere in it, unlike the others).
 * The recommended mitigation for providers without native signing is a secret embedded in the
 * webhook URL itself, compared here with a constant-time check — same discipline, different
 * mechanism, documented in .env.example.
 */
function verifySecret(request: NextRequest): boolean {
  const provided = request.nextUrl.searchParams.get("secret");
  const expected = process.env.SHIPPO_WEBHOOK_SECRET;
  if (!provided || !expected) return false;

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  if (!verifySecret(request)) {
    return NextResponse.json({ error: "Invalid webhook secret" }, { status: 401 });
  }

  let body: ShippoTrackingWebhook;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const trackingNumber = body.data?.tracking_number;
  const status = body.data?.tracking_status?.status;
  if (!trackingNumber || !status) {
    return NextResponse.json({ received: true });
  }

  const admin = createAdminClient();
  const { data: order } = await admin
    .from("orders")
    .select("*")
    .eq("tracking_number", trackingNumber)
    .maybeSingle();

  if (!order) {
    return NextResponse.json({ received: true });
  }

  if (status === "DELIVERED" && !order.delivered_at) {
    const { data: updated } = await admin
      .from("orders")
      .update({ status: "delivered", delivered_at: new Date().toISOString() })
      .eq("id", order.id)
      .select()
      .single();

    await logAudit({
      action: "update",
      table: "orders",
      recordId: order.id,
      oldData: order,
      newData: updated,
    });

    if (order.customer_email) {
      after(async () => {
        await sendOrderDelivered(order.customer_email, order.order_number);
      });
    }
  } else if (status === "TRANSIT" && order.status !== "shipped" && order.status !== "delivered") {
    const { data: updated } = await admin
      .from("orders")
      .update({ status: "shipped" })
      .eq("id", order.id)
      .select()
      .single();

    await logAudit({
      action: "update",
      table: "orders",
      recordId: order.id,
      oldData: order,
      newData: updated,
    });
  }

  return NextResponse.json({ received: true });
}
