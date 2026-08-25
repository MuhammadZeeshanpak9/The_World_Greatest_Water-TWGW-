"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { m } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import toast from "react-hot-toast";
import { SUBSCRIPTION_PLANS } from "@/data/content";
import NotifyMeForm from "@/components/ui/NotifyMeForm";
import { useSession } from "@/context/SessionContext";

export default function PlanComparison() {
  const router = useRouter();
  const { user } = useSession();
  const [stripeEnabled, setStripeEnabled] = useState(false);
  const [subscribing, setSubscribing] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/payments/status")
      .then((res) => res.json())
      .then((json) => setStripeEnabled(!!json.stripe))
      .catch(() => setStripeEnabled(false));
  }, []);

  async function handleSubscribe(planKey: string) {
    if (!user) {
      router.push("/login?redirect=/subscription");
      return;
    }

    setSubscribing(planKey);
    try {
      const res = await fetch("/api/subscriptions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey, productSlug: "elev8-water" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Unable to subscribe");

      if (!json.enabled) {
        toast(json.message ?? "Subscriptions launching soon");
        return;
      }

      toast.success("You're subscribed!");
      router.push("/account/subscriptions");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to subscribe");
    } finally {
      setSubscribing(null);
    }
  }

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-center font-cormorant text-[40px] text-ink md:text-[52px] text-glow-violet">
          Choose Your Plan
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2">
          {SUBSCRIPTION_PLANS.map((plan, i) => {
            const planKey = plan.name.toLowerCase();
            return (
              <m.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="rounded-[24px] glass-card-light p-10 shadow-[0_20px_60px_rgba(107,47,160,0.08)]"
              >
                <span
                  className={`inline-block rounded-full px-4 py-1.5 font-inter text-[10px] font-semibold uppercase tracking-[0.25em] ${
                    plan.badgeTone === "teal" ? "bg-teal/15 text-teal" : "bg-violet/10 text-violet"
                  }`}
                >
                  {plan.badge}
                </span>

                <h3 className="mt-6 font-cormorant text-[28px] text-ink">{plan.name}</h3>

                <div className="mt-3 flex flex-col gap-1">
                  <p className="font-inter text-[15px] text-body">
                    16.9 FL OZ — <span className="font-semibold text-violet">{plan.price16oz}</span>
                  </p>
                  <p className="font-inter text-[15px] text-body">
                    1 LITER — <span className="font-semibold text-violet">{plan.price1L}</span>
                  </p>
                </div>

                <ul className="mt-6 flex flex-col gap-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet/10 text-violet">
                        <Check size={13} />
                      </span>
                      <span className="font-inter text-[14px] text-body">{f}</span>
                    </li>
                  ))}
                </ul>

                {stripeEnabled ? (
                  <button
                    onClick={() => handleSubscribe(planKey)}
                    disabled={subscribing === planKey}
                    className="group mt-8 flex h-[52px] w-full items-center justify-center gap-2 rounded bg-violet px-8 font-inter text-[12px] font-semibold tracking-[0.15em] text-white uppercase transition-transform duration-300 hover:scale-[1.02] disabled:opacity-60"
                  >
                    {subscribing === planKey ? "Subscribing…" : plan.ctaLabel}
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </button>
                ) : (
                  <NotifyMeForm
                    label={plan.ctaLabel}
                    source="subscription"
                    className="mt-8"
                    toastMessage="I AM on the list. You will be notified when subscriptions go live."
                  />
                )}
              </m.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
