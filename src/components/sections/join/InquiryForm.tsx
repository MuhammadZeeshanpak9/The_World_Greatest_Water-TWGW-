"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import FormField from "@/components/ui/FormField";
import { useFormSubmit, isValidEmail } from "@/lib/forms";

type Values = {
  business: string;
  contact: string;
  email: string;
  phone: string;
  message: string;
};
type Errors = Partial<Record<keyof Values, string>>;

const INITIAL: Values = { business: "", contact: "", email: "", phone: "", message: "" };

export default function InquiryForm() {
  const [values, setValues] = useState<Values>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const { status, submit } = useFormSubmit();

  const update = (field: keyof Values) => (value: string) =>
    setValues((v) => ({ ...v, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Errors = {};
    if (!values.business.trim()) nextErrors.business = "Business name is required.";
    if (!values.contact.trim()) nextErrors.contact = "Contact name is required.";
    if (!isValidEmail(values.email)) nextErrors.email = "Enter a valid email address.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    submit(() => new Promise((resolve) => setTimeout(resolve, 900)));
  };

  return (
    <section className="bg-violet-tint py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-[600px] rounded-[24px] border border-violet/10 bg-white p-8 shadow-[0_20px_60px_rgba(107,47,160,0.1)] md:p-12"
      >
        {status === "success" ? (
          <p className="flex items-center justify-center gap-2 py-8 font-inter text-[14px] font-semibold uppercase tracking-[0.15em] text-violet">
            <Check size={18} /> Inquiry Sent — We&apos;ll Be In Touch Soon
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <FormField
              label="Business Name"
              name="business"
              value={values.business}
              onChange={update("business")}
              placeholder="Your business"
              required
              error={errors.business}
            />
            <FormField
              label="Contact Name"
              name="contact"
              value={values.contact}
              onChange={update("contact")}
              placeholder="Your name"
              required
              error={errors.contact}
            />
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
            <FormField
              label="Phone"
              name="phone"
              type="tel"
              value={values.phone}
              onChange={update("phone")}
              placeholder="Your phone number"
            />
            <FormField
              label="Message"
              name="message"
              type="textarea"
              rows={4}
              value={values.message}
              onChange={update("message")}
              placeholder="Tell us about your business..."
            />
            <button
              type="submit"
              disabled={status === "submitting"}
              className="group mt-2 flex h-[52px] w-full items-center justify-center gap-2 rounded bg-violet font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-white transition-transform duration-300 hover:scale-[1.01] disabled:opacity-60"
            >
              {status === "submitting" ? "Sending…" : "Send Inquiry"}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        )}
      </motion.div>
    </section>
  );
}
