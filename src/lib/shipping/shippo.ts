import { Shippo } from "shippo";
import { createAdminClient } from "@/lib/supabase/admin";
import { isShippoEnabled, PACKAGE_DIMENSIONS, type PackageDimensions } from "@/lib/payments/config";
import type { OrderShippingAddress } from "@/types";

let client: Shippo | null = null;

function getShippoInstance(): Shippo | null {
  if (!isShippoEnabled()) return null;
  if (!client) {
    client = new Shippo({ apiKeyHeader: process.env.SHIPPO_API_KEY! });
  }
  return client;
}

const SENDER_KEYS = [
  "shippo_sender_name",
  "shippo_sender_street",
  "shippo_sender_city",
  "shippo_sender_state",
  "shippo_sender_zip",
  "shippo_sender_country",
] as const;

/** Sender address always comes from site_settings (editable in /admin/settings), never from
 * env vars — the env vars only document the placeholder defaults that seed this table. */
async function getSenderAddress() {
  const admin = createAdminClient();
  const { data } = await admin.from("site_settings").select("key, value").in("key", SENDER_KEYS);

  const byKey = Object.fromEntries((data ?? []).map((row) => [row.key, row.value]));

  return {
    name: byKey.shippo_sender_name || "THE WORLD'S GREATEST WATER",
    street1: byKey.shippo_sender_street || "123 Business Address",
    city: byKey.shippo_sender_city || "Los Angeles",
    state: byKey.shippo_sender_state || "CA",
    zip: byKey.shippo_sender_zip || "90001",
    country: byKey.shippo_sender_country || "US",
  };
}

export type ShipmentItem = { productSlug: string; quantity: number };

/** Combines every item into a single parcel: largest single-item box dimensions (assumes items
 * stack into the largest case) plus total weight across all items/quantities. An estimate, per
 * your note — client confirms real box behavior before launch. */
export function combineParcelDimensions(items: ShipmentItem[]): PackageDimensions {
  if (items.length === 0) return PACKAGE_DIMENSIONS.default;

  let length = 0;
  let width = 0;
  let height = 0;
  let weight = 0;

  for (const item of items) {
    const dims = PACKAGE_DIMENSIONS[item.productSlug] ?? PACKAGE_DIMENSIONS.default;
    length = Math.max(length, dims.length);
    width = Math.max(width, dims.width);
    height = Math.max(height, dims.height);
    weight += dims.weight * item.quantity;
  }

  return { length, width, height, weight };
}

export type ShippingRate = {
  id: string;
  carrier: string;
  service: string;
  rate: number;
  days: string;
};

/** Creates a Shippo shipment for the given destination + items and returns available rates.
 * Returns null if Shippo isn't enabled, or [] if Shippo returned zero rates (e.g. an
 * international destination it can't quote) — callers distinguish "disabled" from "unavailable". */
export async function getShippingRates(
  toAddress: OrderShippingAddress,
  items: ShipmentItem[],
): Promise<ShippingRate[] | null> {
  const shippo = getShippoInstance();
  if (!shippo) return null;

  try {
    const sender = await getSenderAddress();
    const dims = combineParcelDimensions(items);

    const shipment = await shippo.shipments.create({
      addressFrom: {
        name: sender.name,
        street1: sender.street1,
        city: sender.city,
        state: sender.state,
        zip: sender.zip,
        country: sender.country,
      },
      addressTo: {
        street1: toAddress.address1,
        street2: toAddress.address2,
        city: toAddress.city,
        state: toAddress.state,
        zip: toAddress.zip,
        country: toAddress.country,
      },
      parcels: [
        {
          massUnit: "lb",
          weight: String(dims.weight),
          distanceUnit: "in",
          length: String(dims.length),
          width: String(dims.width),
          height: String(dims.height),
        },
      ],
      async: false,
    });

    return (shipment.rates ?? []).map((rate) => ({
      id: rate.objectId,
      carrier: rate.provider,
      service: rate.servicelevel?.name ?? rate.provider,
      rate: Number(rate.amount),
      days: rate.estimatedDays != null ? `${rate.estimatedDays} day${rate.estimatedDays === 1 ? "" : "s"}` : "—",
    }));
  } catch (err) {
    console.error("[shippo] getShippingRates failed:", err instanceof Error ? err.message : err);
    return null;
  }
}

export type ShippingLabel = {
  tracking_number: string;
  label_url: string;
  status: string;
};

/** Purchases a label for a previously-fetched rate ID. Carrier/service/rate are NOT re-derived
 * from Shippo's response here (the Transaction API's `rate` field is not reliably an expanded
 * object when purchased by rate ID) — the caller already has that data from the rates it just
 * displayed to the admin, and persists it alongside this label's tracking/label URL. */
export async function createShippingLabel(rateId: string): Promise<ShippingLabel | null> {
  const shippo = getShippoInstance();
  if (!shippo) return null;

  try {
    const transaction = await shippo.transactions.create({
      rate: rateId,
      labelFileType: "PDF",
      async: false,
    });

    if (!transaction.trackingNumber || !transaction.labelUrl) return null;

    return {
      tracking_number: transaction.trackingNumber,
      label_url: transaction.labelUrl,
      status: transaction.status ?? "SUCCESS",
    };
  } catch (err) {
    console.error("[shippo] createShippingLabel failed:", err instanceof Error ? err.message : err);
    return null;
  }
}

export type TrackingEvent = {
  status: string;
  detail: string;
  date: string | null;
  location: string | null;
};

export type TrackingInfo = {
  status: string;
  estimated_delivery: string | null;
  events: TrackingEvent[];
};

export async function getTrackingInfo(
  carrier: string,
  trackingNumber: string,
): Promise<TrackingInfo | null> {
  const shippo = getShippoInstance();
  if (!shippo) return null;

  try {
    const track = await shippo.trackingStatus.get(trackingNumber, carrier);

    const events: TrackingEvent[] = (track.trackingHistory ?? [])
      .map((event) => ({
        status: event.status,
        detail: event.statusDetails,
        date: event.statusDate ? event.statusDate.toISOString() : null,
        location: event.location
          ? [event.location.city, event.location.state].filter(Boolean).join(", ") || null
          : null,
      }))
      .reverse();

    return {
      status: track.trackingStatus?.status ?? "UNKNOWN",
      estimated_delivery: track.eta ? track.eta.toISOString() : null,
      events,
    };
  } catch (err) {
    console.error("[shippo] getTrackingInfo failed:", err instanceof Error ? err.message : err);
    return null;
  }
}
