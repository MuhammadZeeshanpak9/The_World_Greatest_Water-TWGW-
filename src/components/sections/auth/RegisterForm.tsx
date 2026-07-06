"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import FormField from "@/components/ui/FormField";
import { useFormSubmit, isValidEmail } from "@/lib/forms";

type Values = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type Errors = Partial<Record<keyof Values, string>>;

export default function RegisterForm() {
  const [values, setValues] = useState<Values>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const { status, submit } = useFormSubmit();

  const update = (field: keyof Values) => (value: string) =>
    setValues((v) => ({ ...v, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Errors = {};
    if (!values.firstName.trim()) nextErrors.firstName = "First name is required.";
    if (!values.lastName.trim()) nextErrors.lastName = "Last name is required.";
    if (!isValidEmail(values.email)) nextErrors.email = "Enter a valid email address.";
    if (!values.password) nextErrors.password = "Password is required.";
    if (values.confirmPassword !== values.password)
      nextErrors.confirmPassword = "Passwords do not match.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    submit(() => new Promise((resolve) => setTimeout(resolve, 900)));
  };

  return (
    <section className="bg-white py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-[480px] rounded-[20px] border border-violet/10 bg-white/70 p-8 shadow-[0_20px_60px_rgba(107,47,160,0.1)] backdrop-blur md:p-12"
      >
        {status === "success" ? (
          <p className="flex items-center justify-center gap-2 py-8 font-inter text-[14px] font-semibold uppercase tracking-[0.15em] text-violet">
            ✓ Account Created Successfully
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
              label="Password"
              name="password"
              type="password"
              value={values.password}
              onChange={update("password")}
              placeholder="••••••••"
              required
              error={errors.password}
            />
            <FormField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={values.confirmPassword}
              onChange={update("confirmPassword")}
              placeholder="••••••••"
              required
              error={errors.confirmPassword}
            />

            <button
              type="submit"
              disabled={status === "submitting"}
              className="group mt-2 flex h-[52px] w-full items-center justify-center gap-2 rounded bg-violet font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-white transition-transform duration-300 hover:scale-[1.01] disabled:opacity-60"
            >
              {status === "submitting" ? "Creating Account…" : "Create Account"}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>

            <p className="text-center font-inter text-[13px] text-body">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-violet hover:text-violet-mid">
                Sign In →
              </Link>
            </p>
          </form>
        )}
      </motion.div>
    </section>
  );
}
