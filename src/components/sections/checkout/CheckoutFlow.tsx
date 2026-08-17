"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useSession } from "@/context/SessionContext";
import StepIndicator from "./StepIndicator";
import ContactStep from "./ContactStep";
import ShippingStep from "./ShippingStep";
import PaymentStep from "./PaymentStep";
import type { ContactValues, ShippingValues } from "./types";

export default function CheckoutFlow() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [contact, setContact] = useState<ContactValues | null>(null);
  const [shipping, setShipping] = useState<ShippingValues | null>(null);
  const { items, loading: cartLoading } = useCart();
  const { user } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!cartLoading && items.length === 0) {
      router.replace("/cart");
    }
  }, [cartLoading, items.length, router]);

  const fullName =
    typeof user?.user_metadata?.full_name === "string" ? user.user_metadata.full_name : "";
  const prefillContact: Partial<ContactValues> = {
    email: user?.email ?? "",
    firstName: fullName.split(" ")[0] ?? "",
    lastName: fullName.split(" ").slice(1).join(" "),
  };

  return (
    <section className="bg-white py-24 md:py-32">
      <div className={`mx-auto px-6 ${step === 3 ? "max-w-4xl" : "max-w-md"}`}>
        <StepIndicator step={step} />

        <AnimatePresence mode="wait">
          <m.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && (
              <ContactStep
                initialValues={prefillContact}
                onContinue={(values) => {
                  setContact(values);
                  setStep(2);
                }}
              />
            )}
            {step === 2 && (
              <ShippingStep
                onContinue={(values) => {
                  setShipping(values);
                  setStep(3);
                }}
              />
            )}
            {step === 3 && contact && shipping && (
              <PaymentStep contact={contact} shipping={shipping} />
            )}
          </m.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
