"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import FormField from "@/components/ui/FormField";
import type { ShippingValues as Values, SelectedRate } from "./types";

type Errors = Partial<Record<keyof Values, string>>;

const COUNTRIES = [
  { label: "United States", value: "US" },
  { label: "Canada", value: "CA" },
  { label: "United Kingdom", value: "UK" },
  { label: "Australia", value: "AU" },
  { label: "Other", value: "OTHER" },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

type RatesState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "free" }
  | { status: "options"; rates: SelectedRate[] }
  | { status: "unavailable"; message: string };

export default function ShippingStep({
  initialValues,
  onContinue,
}: {
  initialValues?: Partial<Values>;
  onContinue: (values: Values, rate: SelectedRate | null, freeShipping: boolean) => void;
}) {
  const [values, setValues] = useState<Values>({
    address1: initialValues?.address1 ?? "",
    address2: initialValues?.address2 ?? "",
    city: initialValues?.city ?? "",
    state: initialValues?.state ?? "",
    zip: initialValues?.zip ?? "",
    country: initialValues?.country ?? "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [ratesState, setRatesState] = useState<RatesState>({ status: "idle" });
  const [selectedRateId, setSelectedRateId] = useState<string | null>(null);

  const update = (field: keyof Values) => (value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    // Address changed after rates were already quoted — those rates no longer apply.
    if (ratesState.status !== "idle") {
      setRatesState({ status: "idle" });
      setSelectedRateId(null);
    }
  };

  async function fetchRates(address: Values) {
    setRatesState({ status: "loading" });
    try {
      const res = await fetch("/api/shipping/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toAddress: address }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Unable to calculate shipping rates");

      if (json.freeShipping) {
        setRatesState({ status: "free" });
        return;
      }
      if (!json.rates || json.rates.length === 0) {
        setRatesState({
          status: "unavailable",
          message:
            json.message ??
            "Shipping to this location is currently unavailable. Please contact us at winwin@theworldsgreatestwater.com",
        });
        return;
      }
      setRatesState({ status: "options", rates: json.rates });
    } catch (err) {
      setRatesState({
        status: "unavailable",
        message: err instanceof Error ? err.message : "Unable to calculate shipping rates.",
      });
    }
  }

  // Free shipping needs no selection — auto-continue once the badge has had a moment to show.
  useEffect(() => {
    if (ratesState.status !== "free") return;
    const timer = setTimeout(() => onContinue(values, null, true), 700);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ratesState.status]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (ratesState.status === "options") {
      const rate = ratesState.rates.find((r) => r.id === selectedRateId);
      if (!rate) return;
      onContinue(values, rate, false);
      return;
    }

    const nextErrors: Errors = {};
    if (!values.address1.trim()) nextErrors.address1 = "Address is required.";
    if (!values.city.trim()) nextErrors.city = "City is required.";
    if (!values.state.trim()) nextErrors.state = "State is required.";
    if (!values.zip.trim()) nextErrors.zip = "ZIP is required.";
    if (!values.country) nextErrors.country = "Select a country.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    fetchRates(values);
  };

  const canContinue = ratesState.status === "options" && !!selectedRateId;
  const showAddressButton = ratesState.status === "idle" || ratesState.status === "unavailable";

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-5">
      <FormField
        label="Address Line 1"
        name="address1"
        value={values.address1}
        onChange={update("address1")}
        required
        error={errors.address1}
      />
      <FormField
        label="Address Line 2 (optional)"
        name="address2"
        value={values.address2}
        onChange={update("address2")}
      />
      <div className="grid grid-cols-3 gap-4">
        <FormField
          label="City"
          name="city"
          value={values.city}
          onChange={update("city")}
          required
          error={errors.city}
        />
        <FormField
          label="State"
          name="state"
          value={values.state}
          onChange={update("state")}
          required
          error={errors.state}
        />
        <FormField
          label="ZIP"
          name="zip"
          value={values.zip}
          onChange={update("zip")}
          required
          error={errors.zip}
        />
      </div>
      <FormField
        label="Country"
        name="country"
        type="select"
        options={COUNTRIES}
        value={values.country}
        onChange={update("country")}
        placeholder="Select a country"
        required
        error={errors.country}
      />

      {ratesState.status === "loading" && (
        <p className="mt-2 flex items-center gap-2 font-inter text-[13px] text-muted">
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-violet border-t-transparent" />
          Calculating shipping rates…
        </p>
      )}

      {ratesState.status === "free" && (
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-teal/30 bg-teal/10 px-4 py-3">
          <Check size={16} className="text-teal" />
          <span className="font-inter text-[12px] font-semibold tracking-[0.1em] text-teal uppercase">
            Free Shipping Applied
          </span>
        </div>
      )}

      {ratesState.status === "unavailable" && (
        <p className="mt-2 font-inter text-[13px] text-red-600">{ratesState.message}</p>
      )}

      {ratesState.status === "options" && (
        <div className="mt-2 flex flex-col gap-3">
          <span className="font-inter text-[11px] font-semibold uppercase tracking-[0.2em] text-body">
            Shipping Method
          </span>
          {ratesState.rates.map((rate) => (
            <label
              key={rate.id}
              className="flex cursor-pointer items-center justify-between rounded-xl border border-violet/15 bg-white/70 px-4 py-3 backdrop-blur transition-colors has-[:checked]:border-violet has-[:checked]:bg-violet/5"
            >
              <span className="flex items-center gap-3">
                <input
                  type="radio"
                  name="shippingRate"
                  value={rate.id}
                  checked={selectedRateId === rate.id}
                  onChange={() => setSelectedRateId(rate.id)}
                  className="h-4 w-4 accent-[#6b2fa0]"
                />
                <span className="font-inter text-[14px] text-ink">
                  {rate.carrier} — {rate.service}
                  <span className="ml-2 text-muted">({rate.days} days)</span>
                </span>
              </span>
              <span className="font-inter text-[13px] font-semibold text-violet">
                {formatCurrency(rate.rate)}
              </span>
            </label>
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={ratesState.status === "loading" || (ratesState.status === "options" && !canContinue)}
        className="group mt-2 flex h-[52px] items-center justify-center gap-2 rounded-full bg-gradient-brand btn-glow font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-white transition-transform duration-300 hover:scale-[1.01] disabled:opacity-60"
      >
        {showAddressButton ? "Calculate Shipping" : "Continue To Payment"}
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
      </button>
    </form>
  );
}
