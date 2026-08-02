"use client";

import { useState, type ReactNode } from "react";
import { m } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FormField from "@/components/ui/FormField";
import { GradientDivider } from "@/components/ui/primitives";
import { ImageWithFallback } from "@/components/ui/MediaWithFallback";
import { usePrefersReducedMotion } from "@/lib/hooks";
import GoWithinArt from "@/components/sections/wellness/GoWithinArt";
import type { WellnessOffering } from "@/types";

/** Organic drop/blob shape — same asymmetric border-radius trick used in ProductBanner. */
const BLOB_SHAPE = "48% 52% 44% 56% / 55% 48% 52% 45%";

function ImageBubble({
  src,
  alt,
  reduced,
  delay = 0,
  heroArt,
}: {
  src?: string;
  alt: string;
  reduced: boolean;
  delay?: number;
  heroArt?: "go-within";
}) {
  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-md">
      <div
        className="absolute -inset-6 -z-10 blur-3xl"
        style={{ background: "rgba(107,47,160,0.18)", borderRadius: "50%" }}
        aria-hidden
      />
      <m.div
        className="relative h-full w-full overflow-hidden"
        style={{ borderRadius: BLOB_SHAPE }}
        animate={reduced ? undefined : { y: [0, -14, 0], scale: [1, 1.03, 1] }}
        transition={
          reduced ? undefined : { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay }
        }
      >
        {heroArt === "go-within" ? (
          <GoWithinArt />
        ) : (
          <ImageWithFallback src={src} alt={alt} watermark={alt} rounded="" />
        )}
      </m.div>
    </div>
  );
}

type Values = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  membership: string;
};

const EMPTY_VALUES: Values = {
  firstName: "",
  lastName: "",
  email: "",
  message: "",
  membership: "",
};

export default function OfferingBlock({
  heading,
  image,
  secondaryImage,
  hasSecondaryImage,
  heroArt,
  tagline,
  bodyParagraphs,
  session,
  bookingTiers,
  bookingLabel,
  pricingLabel,
  price1yr,
  price2yr,
  membershipOptions,
  winWinText,
  contactEmail,
  collaboratorPitch,
  collaboratorItems,
}: WellnessOffering) {
  const [values, setValues] = useState<Values>(EMPTY_VALUES);
  const [submitted, setSubmitted] = useState(false);
  const reduced = usePrefersReducedMotion();

  const update = (field: keyof Values) => (value: string) =>
    setValues((v) => ({ ...v, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const hasMembershipForm = Boolean(pricingLabel && price1yr);

  const pricingBlock: ReactNode = hasMembershipForm ? (
    <>
      <div>
        <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.3em] text-violet">
          {pricingLabel}
        </p>
        <p className="mt-3 font-cormorant text-[28px] text-ink">{price1yr}</p>
        {price2yr && <p className="mt-1 font-cormorant text-[28px] text-ink">{price2yr}</p>}
      </div>

      {/* Signup form — styled placeholder, no backend submission yet */}
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-10 flex max-w-md flex-col gap-4 text-left"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="First Name"
            name="firstName"
            value={values.firstName}
            onChange={update("firstName")}
          />
          <FormField
            label="Last Name"
            name="lastName"
            value={values.lastName}
            onChange={update("lastName")}
          />
        </div>
        <FormField
          label="Email"
          name="email"
          type="email"
          required
          value={values.email}
          onChange={update("email")}
        />
        <FormField
          label="Message"
          name="message"
          type="textarea"
          rows={4}
          required
          value={values.message}
          onChange={update("message")}
        />
        <FormField
          label="Membership"
          name="membership"
          type="select"
          required
          value={values.membership}
          onChange={update("membership")}
          options={(membershipOptions ?? []).map((o) => ({ label: o, value: o }))}
        />

        <button
          type="submit"
          className="group mt-2 flex h-[52px] items-center justify-center gap-2 rounded-full bg-gradient-brand px-8 font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-white btn-glow transition-transform duration-300 active:scale-95"
        >
          {submitted ? "Thank You" : "Submit"}
          {!submitted && (
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          )}
        </button>
      </form>
    </>
  ) : bookingTiers && bookingTiers.length > 0 ? (
    <div className="text-left">
      <p className="text-center font-inter text-[11px] font-semibold uppercase tracking-[0.3em] text-violet">
        {bookingLabel ?? "Booking"}
      </p>
      <ul className="mt-5 flex flex-col gap-3">
        {bookingTiers.map((tier) => (
          <li
            key={tier.label}
            className="flex flex-wrap items-center justify-between gap-3 border-b border-violet/10 pb-3"
          >
            <span className="font-inter text-[14px] text-body">
              {tier.label} : <span className="font-semibold text-ink">{tier.price}</span>
            </span>
            <Link
              href="/contact"
              className="shrink-0 rounded-full bg-violet px-5 py-2 font-inter text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-violet-deep"
            >
              Book Now
            </Link>
          </li>
        ))}
      </ul>
    </div>
  ) : null;

  const collaboratorBlock: ReactNode = winWinText ? (
    <>
      <div className="flex flex-col gap-3 text-center">
        <p className="font-inter text-[14px] leading-relaxed text-body">{winWinText}</p>
        {contactEmail && (
          <p className="font-inter text-[14px] text-body">
            For more information email:{" "}
            <a href={`mailto:${contactEmail}`} className="text-violet hover:underline">
              {contactEmail}
            </a>
          </p>
        )}
        {collaboratorPitch && (
          <>
            <p className="font-inter text-[13px] font-semibold uppercase tracking-[0.15em] text-muted">
              AND
            </p>
            <p className="font-inter text-[14px] font-semibold text-ink">{collaboratorPitch}</p>
          </>
        )}
      </div>
      {collaboratorItems && collaboratorItems.length > 0 && (
        <ul className="mx-auto mt-4 flex max-w-sm flex-col gap-2 text-left">
          {collaboratorItems.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 font-inter text-[13px] leading-relaxed text-body"
            >
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-violet" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </>
  ) : null;

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
        {/* Section 1 — text left, image right */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid gap-10 md:grid-cols-2 md:items-center md:gap-14"
        >
          <div className="flex flex-col gap-5 text-left">
            <GradientDivider width="w-12" />
            <h2 className="font-cormorant text-[34px] font-bold leading-tight text-ink md:text-[46px]">
              {heading}
            </h2>
            {tagline && (
              <p className="font-inter text-[16px] font-semibold italic text-body">{tagline}</p>
            )}
            {bodyParagraphs && bodyParagraphs.length > 0 && (
              <div className="flex flex-col gap-4">
                {bodyParagraphs.map((p, i) => (
                  <p key={i} className="font-inter text-[14px] leading-relaxed text-body">
                    {p}
                  </p>
                ))}
              </div>
            )}
            {session && (
              <div className="mt-2">
                <h3 className="font-inter text-[13px] font-bold uppercase tracking-[0.15em] text-ink">
                  {session.heading}
                  {session.subheading && (
                    <span className="font-semibold normal-case tracking-normal text-body">
                      {" "}
                      {session.subheading}
                    </span>
                  )}
                </h3>
                <p className="mt-3 font-inter text-[14px] leading-relaxed text-body">
                  {session.description}
                </p>
                {session.extraParagraph && (
                  <p className="mt-3 font-inter text-[14px] leading-relaxed text-body">
                    {session.extraParagraph}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-10">
            <ImageBubble src={image} alt={heading} reduced={reduced} heroArt={heroArt} />
            {hasSecondaryImage && (
              <ImageBubble src={secondaryImage} alt={heading} reduced={reduced} delay={0.4} />
            )}
          </div>
        </m.div>

        {/* Section 2 — pricing, centered */}
        {(pricingBlock || collaboratorBlock) && (
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="mx-auto mt-16 max-w-md text-center md:mt-20"
          >
            <GradientDivider className="mx-auto" width="w-16" />
            {pricingBlock && <div className="mt-8">{pricingBlock}</div>}
            {collaboratorBlock && <div className="mt-10">{collaboratorBlock}</div>}
          </m.div>
        )}
      </div>
    </section>
  );
}
