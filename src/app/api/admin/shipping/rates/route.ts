import { NextResponse, type NextRequest } from "next/server";
import { getAdminUser, unauthorized } from "@/lib/supabase/authz";
import { createAdminClient } from "@/lib/supabase/admin";
import { isShippoEnabled } from "@/lib/payments/config";
import { getShippingRates, type ShippingRate } from "@/lib/shipping/shippo";

const MOCK_RATES: ShippingRate[] = [
  { id: "mock_standard", carrier: "USPS", service: "Priority Mail", rate: 12.5, days: "2-3" },
  { id: "mock_express", carrier: "FedEx", service: "Express", rate: 24.99, days: "1-2" },
];

/**
 * Admin equivalent of /api/shipping/rates — that customer-facing route rates the LOGGED-IN
 * user's live cart, which doesn't apply here: an order's cart has already been cleared by the
 * time it needs a label, and the admin may not even be the customer. Rates are computed from the
 * order's own stored items/shipping_address instead.
 */
export async function POST(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return unauthorized();

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
  const { data: order } = await admin
    .from("orders")
    .select("items, shipping_address")
    .eq("id", orderId)
    .maybeSingle();
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (!isShippoEnabled()) {
    return NextResponse.json({ rates: MOCK_RATES });
  }

  const items: { product_id: string; quantity: number }[] = order.items ?? [];
  const productIds = items.map((i) => i.product_id);
  const { data: products } = productIds.length
    ? await admin.from("products").select("id, slug").in("id", productIds)
    : { data: [] };

  const slugById = new Map((products ?? []).map((p) => [p.id, p.slug]));
  const shipmentItems = items.map((i) => ({
    productSlug: slugById.get(i.product_id) ?? "default",
    quantity: i.quantity,
  }));

  const rates = await getShippingRates(order.shipping_address, shipmentItems);
  if (rates === null) {
    return NextResponse.json({ error: "Unable to fetch shipping rates" }, { status: 500 });
  }
  if (rates.length === 0) {
    return NextResponse.json({
      rates: [],
      message: "No shipping rates available for this address. Please contact us at winwin@theworldsgreatestwater.com",
    });
  }

  return NextResponse.json({ rates });
}
