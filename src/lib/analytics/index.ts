import { gtagEvent } from "./gtag";
import { metaEvent } from "./meta";
import { tiktokEvent } from "./tiktok";

export type LeadSource =
  | "contact"
  | "wellness"
  | "creators"
  | "join"
  | "gift"
  | "waitlist"
  | "newsletter"
  | "course-enrollment"
  | "subscription";

type TrackedProduct = { id: string; name: string; price: number; category?: string };
type TrackedCartItem = { product_id: string; quantity: number; price_snapshot: number };
type TrackedOrder = {
  order_number: string;
  total: number;
  items?: { product_id?: string; name: string; quantity: number; price: number }[];
};

export function trackPageView(url: string): void {
  gtagEvent("page_view", { page_path: url });
  metaEvent("PageView");
  tiktokEvent("PageView");
}

export function trackProductView(product: TrackedProduct): void {
  gtagEvent("view_item", {
    currency: "USD",
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
      },
    ],
  });
  metaEvent("ViewContent", {
    content_ids: [product.id],
    content_name: product.name,
    value: product.price,
    currency: "USD",
  });
  tiktokEvent("ViewContent", {
    content_id: product.id,
    content_name: product.name,
    value: product.price,
    currency: "USD",
  });
}

export function trackAddToCart(product: TrackedProduct, quantity: number): void {
  const value = product.price * quantity;
  gtagEvent("add_to_cart", {
    currency: "USD",
    value,
    items: [{ item_id: product.id, item_name: product.name, price: product.price, quantity }],
  });
  metaEvent("AddToCart", {
    content_ids: [product.id],
    content_name: product.name,
    value,
    currency: "USD",
  });
  tiktokEvent("AddToCart", {
    content_id: product.id,
    content_name: product.name,
    value,
    currency: "USD",
    quantity,
  });
}

export function trackBeginCheckout(cart: { items: TrackedCartItem[]; total: number }): void {
  gtagEvent("begin_checkout", {
    currency: "USD",
    value: cart.total,
    items: cart.items.map((i) => ({
      item_id: i.product_id,
      price: i.price_snapshot,
      quantity: i.quantity,
    })),
  });
  metaEvent("InitiateCheckout", {
    value: cart.total,
    currency: "USD",
    num_items: cart.items.length,
  });
  tiktokEvent("InitiateCheckout", { value: cart.total, currency: "USD" });
}

/** Most critical tracking call in the app — fires once per completed order. */
export function trackPurchase(order: TrackedOrder): void {
  const items = order.items ?? [];
  gtagEvent("purchase", {
    transaction_id: order.order_number,
    currency: "USD",
    value: order.total,
    items: items.map((i) => ({
      item_id: i.product_id,
      item_name: i.name,
      price: i.price,
      quantity: i.quantity,
    })),
  });
  metaEvent("Purchase", {
    value: order.total,
    currency: "USD",
    content_ids: items.map((i) => i.product_id).filter(Boolean),
  });
  tiktokEvent("CompletePayment", { value: order.total, currency: "USD" });
}

export function trackSignUp(): void {
  gtagEvent("sign_up");
  metaEvent("CompleteRegistration");
  tiktokEvent("CompleteRegistration");
}

export function trackLogin(): void {
  // GA4 has a standard "login" event; Meta/TikTok have no equivalent standard event —
  // skip them rather than misuse an unrelated event name.
  gtagEvent("login");
}

export function trackLead(source: LeadSource): void {
  gtagEvent("generate_lead", { lead_source: source });
  metaEvent("Lead", { content_name: source });
  tiktokEvent("SubmitForm", { content_name: source });
}

export function trackWellnessView(wellnessType: string): void {
  gtagEvent("view_item", { item_category: "wellness", item_name: wellnessType });
  metaEvent("ViewContent", { content_category: "wellness", content_name: wellnessType });
  tiktokEvent("ViewContent", { content_type: "wellness", content_name: wellnessType });
}

export function trackCourseView(courseSlug: string): void {
  gtagEvent("view_item", { item_category: "course", item_name: courseSlug });
  metaEvent("ViewContent", { content_category: "course", content_name: courseSlug });
  tiktokEvent("ViewContent", { content_type: "course", content_name: courseSlug });
}
