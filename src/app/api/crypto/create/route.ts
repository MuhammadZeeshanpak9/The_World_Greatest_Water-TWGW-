import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { isCoinbaseEnabled } from "@/lib/payments/config";
import { getCoinbaseClient } from "@/lib/payments/coinbase";
import { logAudit } from "@/lib/supabase/audit";

/** Placeholder charge_url returned when Coinbase isn't configured — keeps the response shape
 * uniform for callers regardless of enabled state; the checkout UI's Crypto tab shows "coming
 * soon" and never actually calls this route while disabled, but the contract still holds if it
 * does (e.g. a stale client, or future direct testing). */
const PLACEHOLDER_REDIRECT = "/checkout/confirmation";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(`crypto-create:${ip}`, { maxAttempts: 5, windowMs: 60 * 60 * 1000 });
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const b = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  const orderId = typeof b.orderId === "string" ? b.orderId : "";
  if (!orderId) {
    return NextResponse.json({ error: "orderId is required" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: order } = await admin.from("orders").select("*").eq("id", orderId).maybeSingle();

  if (!order || order.customer_email !== user.email) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.payment_status !== "pending") {
    return NextResponse.json({ error: "This order has already been paid" }, { status: 409 });
  }

  if (!isCoinbaseEnabled()) {
    return NextResponse.json({ charge_url: PLACEHOLDER_REDIRECT, enabled: false });
  }

  const coinbase = getCoinbaseClient();
  if (!coinbase) {
    return NextResponse.json({ charge_url: PLACEHOLDER_REDIRECT, enabled: false });
  }

  try {
    const charge = await coinbase.createCharge({
      orderNumber: order.order_number,
      total: Number(order.total),
    });

    await admin.from("orders").update({ coinbase_charge_id: charge.id }).eq("id", orderId);

    await admin.from("crypto_charges").insert({
      order_id: orderId,
      coinbase_charge_id: charge.id,
      amount: order.total,
      currency: "USD",
      status: "pending",
    });

    await admin.from("payment_attempts").insert({
      order_id: orderId,
      payment_method: "crypto",
      amount: order.total,
      status: "initiated",
      provider_reference: charge.id,
    });

    await logAudit({
      action: "update",
      table: "orders",
      recordId: orderId,
      newData: { coinbase_charge_id: charge.id },
    });

    return NextResponse.json({ charge_url: charge.hosted_url, enabled: true });
  } catch (err) {
    await admin.from("payment_attempts").insert({
      order_id: orderId,
      payment_method: "crypto",
      amount: order.total,
      status: "failed",
      error_message: err instanceof Error ? err.message : "Unknown error",
    });
    return NextResponse.json({ error: "Unable to create crypto charge" }, { status: 500 });
  }
}
