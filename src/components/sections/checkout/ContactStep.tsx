"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import FormField from "@/components/ui/FormField";
import { isValidEmail } from "@/lib/forms";

type Values = { email: string; firstName: string; lastName: string };
type Errors = Partial<Record<keyof Values, string>>;

export default function ContactStep({ onContinue }: { onContinue: () => void }) {
  const [values, setValues] = useState<Values>({ email: "", firstName: "", lastName: "" });
  const [errors, setErrors] = useState<Errors>({});

  const update = (field: keyof Values) => (value: string) =>
    setValues((v) => ({ ...v, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Errors = {};
    if (!isValidEmail(values.email)) nextErrors.email = "Enter a valid email address.";
    if (!values.firstName.trim()) nextErrors.firstName = "First name is required.";
    if (!values.lastName.trim()) nextErrors.lastName = "Last name is required.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onContinue();
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-5">
      <FormField
        label="Email"
        name="email"
        type="email"
        value={values.email}
        onChange={update("email")}
        placeholder="you@example.com"
        required
        error={errors.email}
      />
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="First Name"
          name="firstName"
          value={values.firstName}
          onChange={update("firstName")}
          required
          error={errors.firstName}
        />
        <FormField
          label="Last Name"
          name="lastName"
          value={values.lastName}
          onChange={update("lastName")}
          required
          error={errors.lastName}
        />
      </div>

      <button
        type="submit"
        className="group mt-2 flex h-[52px] items-center justify-center gap-2 rounded bg-violet font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-white transition-transform duration-300 hover:scale-[1.01]"
      >
        Continue To Shipping
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
      </button>
    </form>
  );
}
