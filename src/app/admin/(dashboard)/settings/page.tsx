"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const FIELDS: { key: string; label: string; type?: string }[] = [
  { key: "announcement_text", label: "Announcement Bar Text" },
  { key: "contact_email", label: "Contact Email", type: "email" },
  { key: "instagram_url", label: "Instagram URL", type: "url" },
  { key: "youtube_url", label: "YouTube URL", type: "url" },
  { key: "tiktok_url", label: "TikTok URL", type: "url" },
];

const SENDER_FIELDS: { key: string; label: string }[] = [
  { key: "shippo_sender_name", label: "Sender Name" },
  { key: "shippo_sender_street", label: "Street Address" },
  { key: "shippo_sender_city", label: "City" },
  { key: "shippo_sender_state", label: "State" },
  { key: "shippo_sender_zip", label: "ZIP" },
  { key: "shippo_sender_country", label: "Country" },
];

export default function SettingsPage() {
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/admin/settings");
        const json = await res.json();
        if (!cancelled && res.ok) {
          setForm(json.settings ?? {});
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

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to save settings");
      toast.success("Settings saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 font-cormorant text-4xl text-white">Settings</h1>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-white/5" />
          ))}
        </div>
      ) : (
        <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-6">
          {FIELDS.map((field) => (
            <div key={field.key}>
              <label className="mb-1.5 block font-inter text-xs text-white/50">
                {field.label}
              </label>
              <input
                type={field.type ?? "text"}
                value={form[field.key] ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                className="w-full rounded-lg bg-white/[0.08] px-4 py-3 font-inter text-sm text-white focus:ring-1 focus:ring-[#6B2FA0] focus:outline-none"
              />
            </div>
          ))}

          <div className="border-t border-white/10 pt-4">
            <h2 className="mb-1 font-cormorant text-xl text-white">Shipping Sender Address</h2>
            <p className="mb-4 font-inter text-xs text-white/40">
              Used to generate real shipping labels via Shippo. Update this to your real business
              address before launch — it currently holds a placeholder.
            </p>
            <div className="space-y-4">
              {SENDER_FIELDS.map((field) => (
                <div key={field.key}>
                  <label className="mb-1.5 block font-inter text-xs text-white/50">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    value={form[field.key] ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                    className="w-full rounded-lg bg-white/[0.08] px-4 py-3 font-inter text-sm text-white focus:ring-1 focus:ring-[#6B2FA0] focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-[#6B2FA0] px-6 py-3 font-inter text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            {saving ? (
              "Saving…"
            ) : (
              <>
                Save Settings <span aria-hidden="true">→</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
