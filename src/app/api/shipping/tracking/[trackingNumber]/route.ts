import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { isShippoEnabled } from "@/lib/payments/config";
import { getTrackingInfo, type TrackingEvent } from "@/lib/shipping/shippo";

type Params = { params: Promise<{ trackingNumber: string }> };

// Most-recent-first, matching the ordering getTrackingInfo() already produces for real Shippo data.
const MOCK_EVENTS: TrackingEvent[] = [
  { status: "TRANSIT", detail: "In transit to next facility", date: null, location: null },
  { status: "TRANSIT", detail: "Package picked up by carrier", date: null, location: "Los Angeles, CA" },
  { status: "PRE_TRANSIT", detail: "Shipping label created", date: null, location: "Los Angeles, CA" },
];

/** Public — no auth required, customers track their own order via a link. Rate limited since
 * it's an unauthenticated endpoint that fans out to a paid third-party API when enabled. */
export async function GET(request: NextRequest, { params }: Params) {
  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(`shipping-tracking:${ip}`, {
    maxAttempts: 20,
    windowMs: 60 * 60 * 1000,
  });
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const { trackingNumber } = await params;
  if (!trackingNumber || trackingNumber.trim().length === 0) {
    return NextResponse.json({ error: "A tracking number is required" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: order } = await admin
    .from("orders")
    .select("order_number, shipping_carrier, shipping_service, delivered_at")
    .eq("tracking_number", trackingNumber)
    .maybeSingle();

  if (!order) {
    return NextResponse.json({ found: false });
  }

  if (!isShippoEnabled()) {
    return NextResponse.json({
      found: true,
      order_number: order.order_number,
      carrier: order.shipping_carrier ?? "USPS",
      service: order.shipping_service ?? "Priority Mail",
      status: order.delivered_at ? "DELIVERED" : "TRANSIT",
      estimated_delivery: null,
      events: MOCK_EVENTS,
    });
  }

  const tracking = await getTrackingInfo(order.shipping_carrier ?? "usps", trackingNumber);
  if (!tracking) {
    return NextResponse.json({
      found: true,
      order_number: order.order_number,
      carrier: order.shipping_carrier,
      service: order.shipping_service,
      status: "UNKNOWN",
      estimated_delivery: null,
      events: [],
      message: "Tracking information not yet available. Please check back in 24 hours after shipping.",
    });
  }

  return NextResponse.json({
    found: true,
    order_number: order.order_number,
    carrier: order.shipping_carrier,
    service: order.shipping_service,
    status: tracking.status,
    estimated_delivery: tracking.estimated_delivery,
    events: tracking.events,
  });
}
