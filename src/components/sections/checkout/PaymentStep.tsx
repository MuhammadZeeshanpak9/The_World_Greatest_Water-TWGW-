"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import FormField from "@/components/ui/FormField";
import { PAYMENTS } from "@/data/content";
import { useCart } from "@/context/CartContext";
import OrderSummary from "./OrderSummary";
import type { ContactValues, ShippingValues } from "./types";

type Values = { cardNumber: string; expiry: string; cvv: string; nameOnCard: string };
type Errors = Partial<Record<keyof Values, string>>;

export default function PaymentStep({
  contact,
  shipping,
}: {
  contact: ContactValues;
  shipping: ShippingValues;
}) {
  const router = useRouter();
  const { items, total, refreshCart } = useCart();
  const [values, setValues] = useState<Values>({
    cardNumber: "",
    expiry: "",
    cvv: "",
    nameOnCard: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const update = (field: keyof Values) => (value: string) =>
    setValues((v) => ({ ...v, [field]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const nextErrors: Errors = {};
    if (!values.cardNumber.trim()) nextErrors.cardNumber = "Card number is required.";
    if (!values.expiry.trim()) nextErrors.expiry = "Expiry is required.";
    if (!values.cvv.trim()) nextErrors.cvv = "CVV is required.";
    if (!values.nameOnCard.trim()) nextErrors.nameOnCard = "Name on card is required.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitError(null);
    setSubmitting(true);
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
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Unable to place order");

      sessionStorage.setItem("elev8_order_number", json.order_number);
      await refreshCart();
      router.push("/checkout/confirmation");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Unable to place order");
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <FormField
          label="Card Number"
          name="cardNumber"
          value={values.cardNumber}
          onChange={update("cardNumber")}
          placeholder="1234 5678 9012 3456"
          required
          error={errors.cardNumber}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Expiry"
            name="expiry"
            value={values.expiry}
            onChange={update("expiry")}
            placeholder="MM/YY"
            required
            error={errors.expiry}
          />
          <FormField
            label="CVV"
            name="cvv"
            value={values.cvv}
            onChange={update("cvv")}
            placeholder="123"
            required
            error={errors.cvv}
          />
        </div>
        <FormField
          label="Name On Card"
          name="nameOnCard"
          value={values.nameOnCard}
          onChange={update("nameOnCard")}
          required
          error={errors.nameOnCard}
        />

        <div className="mt-2 flex flex-wrap items-center gap-2">
          {PAYMENTS.filter((p) => p !== "Google Pay" && p !== "Shop Pay").map((p) => (
            <span
              key={p}
              className="rounded-full border border-violet/15 px-3 py-1 font-inter text-[10px] uppercase tracking-[0.1em] text-muted"
            >
              {p}
            </span>
          ))}
        </div>

        {submitError && (
          <p className="text-center font-inter text-[13px] text-red-600">{submitError}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="group mt-2 flex h-[52px] items-center justify-center gap-2 rounded-full bg-gradient-brand btn-glow font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-white transition-transform duration-300 hover:scale-[1.01] disabled:opacity-60"
        >
          {submitting ? "Placing Order…" : "Place Order"}
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </button>
      </form>

      <OrderSummary items={items} total={total} />
    </div>
  );
}
