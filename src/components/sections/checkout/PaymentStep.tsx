"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CreditCard, Wallet, Coins } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";
import OrderSummary from "./OrderSummary";
import { clearCheckoutState } from "./checkoutStorage";
import type { ContactValues, ShippingValues, SelectedRate } from "./types";

type Tab = "card" | "paypal" | "crypto";
type ProviderStatus = { stripe: boolean; paypal: boolean; coinbase: boolean };

const CRYPTO_ICONS = ["BTC", "ETH", "USDC", "MATIC"];

export default function PaymentStep({
  contact,
  shipping,
  selectedRate,
  freeShipping,
}: {
  contact: ContactValues;
  shipping: ShippingValues;
  selectedRate: SelectedRate | null;
  freeShipping: boolean;
}) {
  const router = useRouter();
  const { items, total, refreshCart } = useCart();

  const [activeTab, setActiveTab] = useState<Tab>("card");
  const [providerStatus, setProviderStatus] = useState<ProviderStatus | null>(null);
  const [supportsPaymentRequest] = useState(
    () => typeof window !== "undefined" && "PaymentRequest" in window,
  );

  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [orderTotal, setOrderTotal] = useState<number | null>(null);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    // Provider status needs a real network round-trip — isStripeEnabled()/isCoinbaseEnabled()
    // read server-only secrets, unreachable from a client component directly.
    fetch("/api/payments/status")
      .then((res) => res.json())
      .then((json) =>
        setProviderStatus({ stripe: !!json.stripe, paypal: !!json.paypal, coinbase: !!json.coinbase }),
      )
      .catch(() => setProviderStatus({ stripe: false, paypal: false, coinbase: false }));
  }, []);

  /** Creates the order once and reuses it across tab switches and retries — never duplicates,
   * per the payment-retry requirement. */
  async function ensureOrder(): Promise<{ orderId: string; orderNumber: string; total: number }> {
    if (orderId && orderNumber && orderTotal !== null) {
      return { orderId, orderNumber, total: orderTotal };
    }

    setCreatingOrder(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: `${contact.firstName} ${contact.lastName}`.trim(),
          shippingAddress: {
            address1: shipping.address1,
            address2: shipping.address2 || undefined,
            city: shipping.city,
            state: shipping.state,
            zip: shipping.zip,
            country: shipping.country,
          },
          shippingCarrier: freeShipping ? null : selectedRate?.carrier,
          shippingService: freeShipping ? null : selectedRate?.service,
          shippingRate: freeShipping ? 0 : (selectedRate?.rate ?? 0),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Unable to place order");

      setOrderId(json.order_id);
      setOrderNumber(json.order_number);
      setOrderTotal(json.total ?? total);
      return { orderId: json.order_id, orderNumber: json.order_number, total: json.total ?? total };
    } finally {
      setCreatingOrder(false);
    }
  }

  async function finalizeSuccess(finalOrderNumber: string, finalTotal: number) {
    sessionStorage.setItem(
      "elev8_order_data",
      JSON.stringify({
        order_number: finalOrderNumber,
        total: finalTotal,
        items: items.map((i) => ({
          product_id: i.product_id,
          name: i.product?.name ?? "Product",
          quantity: i.quantity,
          price: i.price_snapshot,
        })),
      }),
    );
    clearCheckoutState();
    await refreshCart();
    router.push("/checkout/confirmation");
  }

  /** The universal fallback — the only path that does anything today, while every provider is
   * still on a placeholder key. Creates the order (payment_status stays at its 'pending'
   * default) so the full flow is testable end-to-end without real payments. */
  async function handlePlaceOrderFallback() {
    setPaymentError(null);
    setProcessingPayment(true);
    try {
      const { orderNumber: finalOrderNumber, total: finalTotal } = await ensureOrder();
      toast.success("Order placed — payment options launching soon");
      await finalizeSuccess(finalOrderNumber, finalTotal);
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : "Unable to place order");
    } finally {
      setProcessingPayment(false);
    }
  }

  async function handlePayWithCrypto() {
    setPaymentError(null);
    setProcessingPayment(true);
    try {
      const { orderId: id } = await ensureOrder();
      const res = await fetch("/api/crypto/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Unable to start crypto payment");
      clearCheckoutState();
      window.location.href = json.charge_url;
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : "Unable to start crypto payment");
      setProcessingPayment(false);
    }
  }

  const busy = creatingOrder || processingPayment;
  const activeTabEnabled =
    (activeTab === "card" && providerStatus?.stripe) ||
    (activeTab === "paypal" && providerStatus?.paypal) ||
    (activeTab === "crypto" && providerStatus?.coinbase);

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-5">
        {providerStatus?.stripe && supportsPaymentRequest && (
          <div className="rounded-xl border border-violet/15 bg-white/70 p-4">
            {/* TODO: mount Stripe's PaymentRequestButtonElement here once real Stripe keys are
                live — needs a real `stripe.paymentRequest({...})` instance from
                @stripe/react-stripe-js's useStripe(), which only resolves against a real
                publishable key. Renders Apple Pay / Google Pay automatically when supported. */}
            <p className="font-inter text-[12px] text-muted">Apple Pay / Google Pay</p>
          </div>
        )}

        <div className="flex gap-2 border-b border-violet/10">
          {(["card", "paypal", "crypto"] as Tab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                setPaymentError(null);
              }}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 font-inter text-[12px] font-semibold tracking-[0.1em] uppercase transition-colors ${
                activeTab === tab
                  ? "border-violet text-violet"
                  : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {tab === "card" && <CreditCard size={15} />}
              {tab === "paypal" && <Wallet size={15} />}
              {tab === "crypto" && <Coins size={15} />}
              {tab === "card" ? "Card" : tab === "paypal" ? "PayPal" : "Crypto"}
            </button>
          ))}
        </div>

        {activeTab === "card" &&
          (providerStatus?.stripe ? (
            <div className="rounded-xl border border-violet/15 bg-white/70 p-6">
              {/* TODO: mount @stripe/react-stripe-js's <Elements> + <PaymentElement> here once
                  real Stripe keys are live. loadStripe(NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) →
                  ensureOrder() → POST /api/payments/create-intent for a clientSecret →
                  <Elements options={{clientSecret}}> → stripe.confirmPayment() on submit →
                  POST /api/payments/confirm to re-verify server-side before marking paid. */}
              <p className="font-inter text-[13px] text-muted">Card payment form will appear here.</p>
            </div>
          ) : (
            <p className="font-inter text-[13px] text-muted italic">
              Card payments coming soon — choose another option below.
            </p>
          ))}

        {activeTab === "paypal" &&
          (providerStatus?.paypal ? (
            <div className="rounded-xl border border-violet/15 bg-white/70 p-6">
              {/* TODO: mount the PayPal Buttons SDK here once real PayPal keys are live — load
                  https://www.paypal.com/sdk/js?client-id=NEXT_PUBLIC_PAYPAL_CLIENT_ID, then
                  paypal.Buttons({ createOrder: () => ensureOrder() then POST
                  /api/paypal/create-order, onApprove: () => POST /api/paypal/capture }).render(). */}
              <p className="font-inter text-[13px] text-muted">PayPal button will appear here.</p>
            </div>
          ) : (
            <p className="font-inter text-[13px] text-muted italic">PayPal coming soon.</p>
          ))}

        {activeTab === "crypto" &&
          (providerStatus?.coinbase ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                {CRYPTO_ICONS.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-violet/15 px-3 py-1 font-inter text-[11px] font-semibold text-muted"
                  >
                    {c}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={handlePayWithCrypto}
                disabled={busy}
                className="group flex h-[52px] items-center justify-center gap-2 rounded-full bg-gradient-brand btn-glow font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-white transition-transform duration-300 hover:scale-[1.01] disabled:opacity-60"
              >
                {processingPayment ? "Redirecting…" : "Pay With Crypto"}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          ) : (
            <p className="font-inter text-[13px] text-muted italic">Crypto payments coming soon.</p>
          ))}

        {paymentError && (
          <div className="flex flex-col items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="font-inter text-[13px] text-red-600">{paymentError}</p>
            <button
              type="button"
              onClick={() => setPaymentError(null)}
              className="font-inter text-[12px] font-semibold text-violet underline"
            >
              Try Again
            </button>
          </div>
        )}

        {!activeTabEnabled && (
          <button
            type="button"
            onClick={handlePlaceOrderFallback}
            disabled={busy}
            className="group mt-2 flex h-[52px] items-center justify-center gap-2 rounded-full bg-gradient-brand btn-glow font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-white transition-transform duration-300 hover:scale-[1.01] disabled:opacity-60"
          >
            {busy ? "Placing Order…" : "Place Order"}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        )}
      </div>

      <OrderSummary items={items} total={total} selectedRate={selectedRate} freeShipping={freeShipping} />
    </div>
  );
}
