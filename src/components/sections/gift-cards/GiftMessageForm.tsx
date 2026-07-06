"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import FormField from "@/components/ui/FormField";
import { useFormSubmit, isValidEmail } from "@/lib/forms";

type Errors = Partial<Record<"recipientName" | "recipientEmail" | "senderName" | "message", string>>;

export default function GiftMessageForm() {
  const [values, setValues] = useState({
    recipientName: "",
    recipientEmail: "",
    senderName: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const { status, submit } = useFormSubmit();

  const update = (field: keyof typeof values) => (value: string) =>
    setValues((v) => ({ ...v, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Errors = {};
    if (!values.recipientName.trim()) nextErrors.recipientName = "Recipient name is required.";
    if (!isValidEmail(values.recipientEmail)) nextErrors.recipientEmail = "Enter a valid email address.";
    if (!values.senderName.trim()) nextErrors.senderName = "Your name is required.";
    if (!values.message.trim()) nextErrors.message = "Message is required.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    submit(() => new Promise((resolve) => setTimeout(resolve, 900)));
  };

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[600px] px-6 text-center">
        <h2 className="font-cormorant text-[36px] text-ink md:text-[48px]">
          Add a Personal Message
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mt-10 max-w-[600px] rounded-[24px] border border-violet/10 bg-white/70 p-8 shadow-[0_20px_60px_rgba(107,47,160,0.1)] backdrop-blur md:p-12"
      >
        {status === "success" ? (
          <p className="flex items-center justify-center gap-2 py-8 font-inter text-[14px] font-semibold uppercase tracking-[0.15em] text-violet">
            <Check size={18} /> Gift Sent — They&apos;ll Receive It By Email Shortly
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <FormField
              label="Recipient Name"
              name="recipientName"
              value={values.recipientName}
              onChange={update("recipientName")}
              placeholder="Who is this gift for?"
              required
              error={errors.recipientName}
            />
            <FormField
              label="Recipient Email"
              name="recipientEmail"
              type="email"
              value={values.recipientEmail}
              onChange={update("recipientEmail")}
              placeholder="their@example.com"
              required
              error={errors.recipientEmail}
            />
            <FormField
              label="Your Name"
              name="senderName"
              value={values.senderName}
              onChange={update("senderName")}
              placeholder="Your name"
              required
              error={errors.senderName}
            />
            <FormField
              label="Personal Message"
              name="message"
              type="textarea"
              rows={4}
              value={values.message}
              onChange={update("message")}
              placeholder="Write something from the heart..."
              required
              error={errors.message}
            />
            <button
              type="submit"
              disabled={status === "submitting"}
              className="group mt-2 flex h-[52px] w-full items-center justify-center gap-2 rounded bg-violet font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-white transition-transform duration-300 hover:scale-[1.01] disabled:opacity-60"
            >
              {status === "submitting" ? "Sending…" : "Send Gift"}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        )}
      </motion.div>

      <p className="mx-auto mt-6 max-w-[600px] px-6 text-center font-inter text-[12px] text-muted">
        Gift cards are delivered instantly via email
      </p>
    </section>
  );
}
