"use client";

import { useEffect, useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import FormField from "@/components/ui/FormField";

export default function ProfileForm() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/account");
        const json = await res.json();
        if (!cancelled && res.ok) {
          setEmail(json.profile?.email ?? "");
          setFullName(json.profile?.full_name ?? "");
          setPhone(json.profile?.phone ?? "");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/account", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName, phone }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Unable to save profile");
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to save profile");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-[480px] space-y-4 px-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-violet/5" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[480px] rounded-[20px] glass-card-light p-8 md:p-12">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <label className="flex flex-col gap-2">
            <span className="font-inter text-[11px] font-semibold uppercase tracking-[0.2em] text-body">
              Email
            </span>
            <span className="w-full rounded-xl bg-muted/10 px-4 py-3 font-inter text-[14px] text-muted">
              {email}
            </span>
          </label>

          <FormField label="Full Name" name="fullName" value={fullName} onChange={setFullName} />
          <FormField label="Phone" name="phone" type="tel" value={phone} onChange={setPhone} />

          <button
            type="submit"
            disabled={saving}
            className="group mt-2 flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-gradient-brand btn-glow font-inter text-[12px] font-semibold uppercase tracking-[0.15em] text-white transition-transform duration-300 hover:scale-[1.01] disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>
    </section>
  );
}
