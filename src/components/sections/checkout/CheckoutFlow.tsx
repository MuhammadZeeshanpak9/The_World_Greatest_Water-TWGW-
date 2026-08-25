"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useSession } from "@/context/SessionContext";
import { trackBeginCheckout } from "@/lib/analytics";
import StepIndicator from "./StepIndicator";
import ContactStep from "./ContactStep";
import ShippingStep from "./ShippingStep";
import PaymentStep from "./PaymentStep";
import { readCheckoutState, writeCheckoutState } from "./checkoutStorage";
import type { ContactValues, ShippingValues, SelectedRate } from "./types";

export default function CheckoutFlow() {
  const [restored] = useState(() => readCheckoutState());
  const [step, setStep] = useState<1 | 2 | 3>(restored?.step ?? 1);
  const [contact, setContact] = useState<ContactValues | null>(restored?.contact ?? null);
  const [shipping, setShipping] = useState<ShippingValues | null>(restored?.shipping ?? null);
  const [selectedRate, setSelectedRate] = useState<SelectedRate | null>(restored?.selectedRate ?? null);
  const [freeShipping, setFreeShipping] = useState(restored?.freeShipping ?? false);
  const { items, total, loading: cartLoading } = useCart();
  const { user } = useSession();
  const router = useRouter();
  const hasTrackedBeginCheckout = useRef(false);

  useEffect(() => {
    if (!cartLoading && items.length === 0) {
      router.replace("/cart");
    }
  }, [cartLoading, items.length, router]);

  useEffect(() => {
    if (cartLoading || items.length === 0 || hasTrackedBeginCheckout.current) return;
    hasTrackedBeginCheckout.current = true;
    trackBeginCheckout({
      items: items.map((i) => ({
        product_id: i.product_id,
        quantity: i.quantity,
        price_snapshot: i.price_snapshot,
      })),
      total,
    });
  }, [cartLoading, items, total]);

  // Persist progress on every step transition, so an accidental refresh mid-checkout doesn't
  // lose it. Cleared on order success from within PaymentStep.
  useEffect(() => {
    writeCheckoutState({ step, contact, shipping, selectedRate, freeShipping });
  }, [step, contact, shipping, selectedRate, freeShipping]);

  const fullName =
    typeof user?.user_metadata?.full_name === "string" ? user.user_metadata.full_name : "";
  const prefillContact: Partial<ContactValues> = {
    email: contact?.email ?? user?.email ?? "",
    firstName: contact?.firstName ?? fullName.split(" ")[0] ?? "",
    lastName: contact?.lastName ?? fullName.split(" ").slice(1).join(" "),
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
                initialValues={shipping ?? undefined}
                onContinue={(values, rate, isFree) => {
                  setShipping(values);
                  setSelectedRate(rate);
                  setFreeShipping(isFree);
                  setStep(3);
                }}
              />
            )}
            {step === 3 && contact && shipping && (
              <PaymentStep
                contact={contact}
                shipping={shipping}
                selectedRate={selectedRate}
                freeShipping={freeShipping}
              />
            )}
          </m.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
