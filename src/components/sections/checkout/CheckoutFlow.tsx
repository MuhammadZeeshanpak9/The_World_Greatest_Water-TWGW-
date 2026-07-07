"use client";

import { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import StepIndicator from "./StepIndicator";
import ContactStep from "./ContactStep";
import ShippingStep from "./ShippingStep";
import PaymentStep from "./PaymentStep";

export default function CheckoutFlow() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

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
            {step === 1 && <ContactStep onContinue={() => setStep(2)} />}
            {step === 2 && <ShippingStep onContinue={() => setStep(3)} />}
            {step === 3 && <PaymentStep />}
          </m.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
