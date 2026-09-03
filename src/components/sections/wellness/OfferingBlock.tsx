"use client";

import { useState, type ReactNode } from "react";
import { m } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import FormField from "@/components/ui/FormField";
import { ImageWithFallback } from "@/components/ui/MediaWithFallback";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { useFormSubmit, submitFormSubmission } from "@/lib/forms";
import { trackLead } from "@/lib/analytics";
import GoWithinArt from "@/components/sections/wellness/GoWithinArt";
import MindCardArt from "@/components/sections/wellness/MindCardArt";
import SectionParticles from "@/components/sections/SectionParticles";
import type { WellnessOffering } from "@/types";

/** Organic blob shape — same asymmetric border-radius used pre-luxury-pass, kept for the frame mask. */
const BLOB_SHAPE = "48% 52% 44% 56% / 55% 48% 52% 45%";

function ImageBubble({
  src,
  alt,
  reduced,
  delay = 0,
  heroArt,
  plain = false,
  aspect = "4/3",
}: {
  src?: string;
  alt: string;
  reduced: boolean;
  delay?: number;
  heroArt?: "go-within" | "mind-card";
  plain?: boolean;
  /** CSS aspect-ratio value ("1/1", "3/4", "6/5"...) matched to the real
   * photo's own proportions so object-cover doesn't crop it oddly. */
  aspect?: string;
}) {
  const borderRadius = plain ? "24px" : BLOB_SHAPE;

  return (
    <div className="relative mx-auto w-full max-w-xl" style={{ aspectRatio: aspect }}>
      {/* Rotating gilded ring frame */}
      {!reduced && (
        <div
          className="gold-ring-spin absolute -inset-3 -z-10"
          style={{ borderRadius }}
          aria-hidden
        />
      )}
      <div
        className="absolute -inset-3 -z-10 opacity-70"
        style={{ borderRadius, boxShadow: "0 0 60px rgba(201,168,76,0.25)" }}
        aria-hidden
      />

      <m.div
        className="relative h-full w-full overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.55)]"
        style={{ borderRadius }}
        animate={reduced ? undefined : { y: [0, -14, 0], scale: [1, 1.02, 1] }}
        transition={
          reduced ? undefined : { duration: 6.5, repeat: Infinity, ease: "easeInOut", delay }
        }
      >
        {heroArt === "go-within" ? (
          <GoWithinArt />
        ) : heroArt === "mind-card" ? (
          <MindCardArt />
        ) : (
          <ImageWithFallback src={src} alt={alt} watermark={alt} rounded="" />
        )}
        {/* inner gold hairline */}
        <div
          className="pointer-events-none absolute inset-2 border border-gold/30"
          style={{ borderRadius }}
          aria-hidden
        />
        {/* subtle vignette for depth */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
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
  imageAspect,
  secondaryImage,
  secondaryImageAspect,
  hasSecondaryImage,
  hasPrimaryImage,
  heroArt,
  imagePlain,
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
  accentColor,
}: WellnessOffering & { accentColor?: string }) {
  const [values, setValues] = useState<Values>(EMPTY_VALUES);
  const { status, errorMessage, submit } = useFormSubmit();
  const reduced = usePrefersReducedMotion();

  const update = (field: keyof Values) => (value: string) =>
    setValues((v) => ({ ...v, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit(async () => {
      if (membershipOptions && membershipOptions.length > 0 && !values.membership) {
        throw new Error("Please select a membership option.");
      }
      await submitFormSubmission("wellness", {
        ...values,
        name: `${values.firstName} ${values.lastName}`.trim(),
        offering: heading,
      });
      trackLead("wellness");
    });
  };

  const hasMembershipForm = Boolean(pricingLabel && price1yr);

  const pricingBlock: ReactNode = hasMembershipForm ? (
    <div className="glass-card-gold relative overflow-hidden rounded-[28px] p-10">
      {/* corner ticks — membership-card detail */}
      <span className="absolute left-5 top-5 h-4 w-4 border-l border-t border-gold/50" aria-hidden />
      <span className="absolute right-5 top-5 h-4 w-4 border-r border-t border-gold/50" aria-hidden />
      <span className="absolute bottom-5 left-5 h-4 w-4 border-b border-l border-gold/50" aria-hidden />
      <span className="absolute bottom-5 right-5 h-4 w-4 border-b border-r border-gold/50" aria-hidden />

      <p className="font-inter text-[10px] font-semibold uppercase tracking-[0.5em] text-gold">
        {pricingLabel}
      </p>
      <p className="text-gradient-gold mt-5 font-cormorant text-[38px] font-light">{price1yr}</p>
      {price2yr && (
        <p className="text-gradient-gold mt-1 font-cormorant text-[38px] font-light">{price2yr}</p>
      )}

      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-10 flex max-w-md flex-col gap-4 text-left"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField
            tone="dark"
            label="First Name"
            name="firstName"
            value={values.firstName}
            onChange={update("firstName")}
          />
          <FormField
            tone="dark"
            label="Last Name"
            name="lastName"
            value={values.lastName}
            onChange={update("lastName")}
          />
        </div>
        <FormField
          tone="dark"
          label="Email"
          name="email"
          type="email"
          required
          value={values.email}
          onChange={update("email")}
        />
        <FormField
          tone="dark"
          label="Message"
          name="message"
          type="textarea"
          rows={4}
          required
          value={values.message}
          onChange={update("message")}
        />
        {membershipOptions && membershipOptions.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="font-inter text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
              Membership <span className="text-violet">*</span>
            </span>
            <div className="flex flex-col gap-3 sm:flex-row">
              {membershipOptions.map((option) => {
                const selected = values.membership === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => update("membership")(option)}
                    aria-pressed={selected}
                    className={`flex-1 rounded-xl border px-4 py-3 text-left font-inter text-[13px] font-semibold transition-all ${
                      selected
                        ? "border-gold bg-gold text-dark-base"
                        : "glass-card-dark border-white/15 text-white/80 hover:border-gold/50"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {status === "error" && errorMessage && (
          <p className="text-center font-inter text-[13px] text-red-400">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="btn-gold-sheen group mt-2 flex h-[54px] items-center justify-center gap-2 rounded-full px-8 font-inter text-[11px] font-bold uppercase tracking-[0.3em] disabled:opacity-50"
        >
          {status === "submitting"
            ? "Sending…"
            : status === "success"
              ? "Thank You"
              : "Request Access"}
          {status !== "success" && status !== "submitting" && (
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          )}
        </button>
      </form>
    </div>
  ) : bookingTiers && bookingTiers.length > 0 ? (
    <div className="glass-card-gold relative overflow-hidden rounded-[28px] p-10 text-left">
      <span className="absolute left-5 top-5 h-4 w-4 border-l border-t border-gold/50" aria-hidden />
      <span className="absolute right-5 top-5 h-4 w-4 border-r border-t border-gold/50" aria-hidden />
      <span className="absolute bottom-5 left-5 h-4 w-4 border-b border-l border-gold/50" aria-hidden />
      <span className="absolute bottom-5 right-5 h-4 w-4 border-b border-r border-gold/50" aria-hidden />

      <p className="text-center font-inter text-[10px] font-semibold uppercase tracking-[0.5em] text-gold">
        {bookingLabel ?? "Booking"}
      </p>
      <ul className="mt-6 flex flex-col gap-3">
        {bookingTiers.map((tier) => (
          <li
            key={tier.label}
            className="flex flex-wrap items-center justify-between gap-3 border-b border-gold/20 pb-3"
          >
            <span className="font-inter text-[14px] text-white/70">
              {tier.label} :{" "}
              <span className="text-gradient-gold font-cormorant text-[20px] font-light">
                {tier.price}
              </span>
            </span>
            <Link
              href="/contact"
              className="btn-gold-sheen shrink-0 rounded-full px-5 py-2 font-inter text-[10px] font-bold uppercase tracking-[0.2em]"
            >
              Reserve
            </Link>
          </li>
        ))}
      </ul>
    </div>
  ) : null;

  const collaboratorBlock: ReactNode = winWinText ? (
    <div className="glass-card-gold relative overflow-hidden rounded-[28px] p-10">
      <div className="flex flex-col gap-3 text-center">
        <p className="font-inter text-[14px] leading-relaxed text-white/70">{winWinText}</p>
        {contactEmail && (
          <p className="font-inter text-[14px] text-white/70">
            For more information email:{" "}
            <a href={`mailto:${contactEmail}`} className="text-gold hover:underline">
              {contactEmail}
            </a>
          </p>
        )}
        {collaboratorPitch && (
          <>
            <p className="font-inter text-[12px] font-semibold uppercase tracking-[0.3em] text-gold/70">
              AND
            </p>
            <p className="font-inter text-[14px] font-semibold text-white">{collaboratorPitch}</p>
          </>
        )}
      </div>
      {collaboratorItems && collaboratorItems.length > 0 && (
        <ul className="mx-auto mt-4 flex max-w-sm flex-col gap-2 text-left">
          {collaboratorItems.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 font-inter text-[13px] leading-relaxed text-white/70"
            >
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  ) : null;

  const accentStyle = accentColor
    ? ({ "--color-gold": accentColor, "--tier-accent": accentColor } as React.CSSProperties)
    : undefined;

  return (
    <section className="relative overflow-hidden bg-dark-base py-24 md:py-36" style={accentStyle}>
      {/* Ambient luxury background: drifting light + gold particles + grain */}
      <m.div
        className="pointer-events-none absolute -top-20 left-1/4 h-[520px] w-[520px] rounded-full bg-gold/10 blur-[150px]"
        animate={reduced ? undefined : { x: [0, 60, -20, 0], y: [0, 40, 80, 0] }}
        transition={reduced ? undefined : { duration: 26, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
      <m.div
        className="pointer-events-none absolute bottom-0 right-1/5 h-[420px] w-[420px] rounded-full bg-violet/15 blur-[150px]"
        animate={reduced ? undefined : { x: [0, -50, 30, 0], y: [0, -30, 20, 0] }}
        transition={reduced ? undefined : { duration: 22, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
      {!reduced && <SectionParticles count={26} />}
      <div className="grain-overlay pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay" aria-hidden />

      <div className="relative mx-auto max-w-5xl px-6">
        {/* Section 1 — text left, image right */}
        <m.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16"
        >
          <div className="flex flex-col gap-6 text-left">
            <span className="flex items-center gap-3">
              <span className="block h-px w-14 bg-gradient-to-r from-gold to-transparent" />
              <Sparkles size={14} className="text-gold" />
            </span>
            <h2 className="text-gradient-gold font-cormorant text-[34px] font-light uppercase leading-[1.15] tracking-[0.02em] md:text-[48px]">
              {heading}
            </h2>
            {tagline && (
              <p className="font-inter text-[13px] font-semibold uppercase tracking-[0.25em] text-gold">
                {tagline}
              </p>
            )}
            {bodyParagraphs && bodyParagraphs.length > 0 && (
              <div className="flex flex-col gap-4">
                {bodyParagraphs.map((p, i) => (
                  <p key={i} className="font-inter text-[15px] font-light leading-[1.9] text-white/65">
                    {p}
                  </p>
                ))}
              </div>
            )}
            {session && (
              <div className="mt-3 border-t border-gold/15 pt-6">
                <h3 className="font-inter text-[12px] font-bold uppercase tracking-[0.3em] text-white">
                  {session.heading}
                  {session.subheading && (
                    <span className="font-semibold normal-case tracking-normal text-white/60">
                      {" "}
                      {session.subheading}
                    </span>
                  )}
                </h3>
                <p className="mt-3 font-inter text-[14px] font-light leading-[1.9] text-white/65">
                  {session.description}
                </p>
                {session.extraParagraph && (
                  <p className="mt-3 font-inter text-[14px] font-light leading-[1.9] text-white/65">
                    {session.extraParagraph}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-10">
            {hasPrimaryImage !== false && (
              <ImageBubble
                src={image}
                alt={heading}
                reduced={reduced}
                heroArt={heroArt}
                plain={imagePlain}
                aspect={imageAspect}
              />
            )}
            {hasSecondaryImage && (
              <ImageBubble
                src={secondaryImage}
                alt={heading}
                reduced={reduced}
                delay={0.4}
                aspect={secondaryImageAspect}
              />
            )}
          </div>
        </m.div>

        {/* Section 2 — pricing, centered */}
        {(pricingBlock || collaboratorBlock) && (
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="mx-auto mt-20 max-w-md text-center md:mt-24"
          >
            <span className="mx-auto flex w-24 items-center justify-center gap-2" aria-hidden>
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold" />
              <Sparkles size={12} className="text-gold" />
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold" />
            </span>
            {pricingBlock && <div className="mt-8">{pricingBlock}</div>}
            {collaboratorBlock && <div className="mt-10">{collaboratorBlock}</div>}
          </m.div>
        )}
      </div>
    </section>
  );
}
