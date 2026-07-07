"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import FormField from "@/components/ui/FormField";

type Values = {
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

type Errors = Partial<Record<keyof Values, string>>;

const COUNTRIES = [
  { label: "United States", value: "US" },
  { label: "Canada", value: "CA" },
  { label: "United Kingdom", value: "UK" },
  { label: "Australia", value: "AU" },
  { label: "Other", value: "OTHER" },
];

const SHIPPING_METHODS = [
  { id: "standard", label: "Standard (5-7 days)", price: "Free over $75" },
  { id: "express", label: "Express (2-3 days)", price: "$15.00" },
];

export default function ShippingStep({ onContinue }: { onContinue: () => void }) {
  const [values, setValues] = useState<Values>({
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [method, setMethod] = useState("standard");

  const update = (field: keyof Values) => (value: string) =>
    setValues((v) => ({ ...v, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Errors = {};
    if (!values.address1.trim()) nextErrors.address1 = "Address is required.";
    if (!values.city.trim()) nextErrors.city = "City is required.";
    if (!values.state.trim()) nextErrors.state = "State is required.";
    if (!values.zip.trim()) nextErrors.zip = "ZIP is required.";
    if (!values.country) nextErrors.country = "Select a country.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onContinue();
  };

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

      <div className="mt-2 flex flex-col gap-3">
        <span className="font-inter text-[11px] font-semibold uppercase tracking-[0.2em] text-body">
          Shipping Method
        </span>
        {SHIPPING_METHODS.map((m) => (
          <label
            key={m.id}
            className="flex cursor-pointer items-center justify-between rounded-xl border border-violet/15 bg-white/70 px-4 py-3 backdrop-blur transition-colors has-[:checked]:border-violet has-[:checked]:bg-violet/5"
          >
            <span className="flex items-center gap-3">
              <input
                type="radio"
                name="shippingMethod"
                value={m.id}
                checked={method === m.id}
                onChange={() => setMethod(m.id)}
                className="h-4 w-4 accent-[#6b2fa0]"
              />
              <span className="font-inter text-[14px] text-ink">{m.label}</span>
            </span>
            <span className="font-inter text-[13px] font-semibold text-violet">{m.price}</span>
          </label>
        ))}
      </div>

      <button
        type="submit"
        className="group mt-2 flex h-[52px] items-center justify-center gap-2 rounded-full bg-gradient-brand btn-glow font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-white transition-transform duration-300 hover:scale-[1.01]"
      >
        Continue To Payment
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
      </button>
    </form>
  );
}
