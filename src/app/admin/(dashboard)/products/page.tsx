"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Plus, Package, Upload } from "lucide-react";
import toast from "react-hot-toast";
import DataTable, { type Column } from "@/components/admin/DataTable";
import SlideOver from "@/components/admin/SlideOver";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import StatusBadge from "@/components/admin/StatusBadge";
import PillButton from "@/components/admin/PillButton";
import { useAdminTable } from "@/lib/hooks/useAdminTable";

type Product = {
  id: string;
  name: string;
  subtitle: string | null;
  description: string | null;
  price: number;
  per_unit: string | null;
  category: string;
  status: "available" | "sold-out" | "coming-soon";
  slug: string;
  image_url: string | null;
};

const STATUS_OPTIONS = ["available", "sold-out", "coming-soon"] as const;

const EMPTY_FORM = {
  name: "",
  subtitle: "",
  description: "",
  price: "",
  per_unit: "",
  category: "",
  status: "available" as (typeof STATUS_OPTIONS)[number],
  slug: "",
  image_url: "",
};

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const [slideOverOpen, setSlideOverOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    if (category) p.set("category", category);
    p.set("page", String(page));
    return p.toString();
  }, [search, category, page]);

  const { rows, total, loading, error, refetch } = useAdminTable<Product>(
    "/api/admin/products",
    "products",
    queryString,
  );

  // Separate, unfiltered fetch (page 1) purely to populate the category pills — keeps
  // them visible regardless of which pill is currently active.
  const { rows: categorySample } = useAdminTable<Product>(
    "/api/admin/products",
    "products",
    "page=1",
  );
  const knownCategories = useMemo(
    () => Array.from(new Set(categorySample.map((r) => r.category))).sort(),
    [categorySample],
  );

  const totalPages = Math.max(1, Math.ceil(total / 20));

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setSlideOverOpen(true);
  }

  function openEdit(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      subtitle: product.subtitle ?? "",
      description: product.description ?? "",
      price: String(product.price),
      per_unit: product.per_unit ?? "",
      category: product.category,
      status: product.status,
      slug: product.slug,
      image_url: product.image_url ?? "",
    });
    setSlideOverOpen(true);
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed");
      setForm((f) => ({ ...f, image_url: json.url }));
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!form.name.trim() || !form.category.trim() || !form.slug.trim() || !form.price) {
      toast.error("Name, category, price, and slug are required");
      return;
    }

    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price) };
      const res = await fetch(
        editingId ? `/api/admin/products/${editingId}` : "/api/admin/products",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to save product");

      toast.success(editingId ? "Product updated" : "Product created");
      setSlideOverOpen(false);
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");
      toast.success("Product deleted");
      setDeleteId(null);
      refetch();
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeleting(false);
    }
  }

  const columns: Column<Product>[] = [
    {
      header: "Image",
      accessor: (r) =>
        r.image_url ? (
          <Image
            src={r.image_url}
            alt={r.name}
            width={40}
            height={40}
            className="rounded-lg object-cover"
          />
        ) : (
          <div className="h-10 w-10 rounded-lg bg-white/10" />
        ),
    },
    { header: "Name", accessor: (r) => r.name },
    { header: "Category", accessor: (r) => r.category },
    { header: "Price", accessor: (r) => `$${Number(r.price).toFixed(2)}` },
    { header: "Status", accessor: (r) => <StatusBadge status={r.status} /> },
    {
      header: "Actions",
      accessor: (r) => (
        <div className="flex gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEdit(r);
            }}
            className="font-inter text-xs text-[#6B2FA0] hover:underline"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteId(r.id);
            }}
            className="font-inter text-xs text-[#EF4444] hover:underline"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-cormorant text-4xl text-white">Products</h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 rounded-lg bg-[#6B2FA0] px-4 py-2.5 font-inter text-sm font-semibold text-white hover:opacity-90"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      <DataTable<Product>
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        loading={loading}
        error={error}
        onRetry={refetch}
        emptyIcon={Package}
        emptyMessage="No products yet."
        searchValue={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        searchPlaceholder="Search products…"
        filters={
          knownCategories.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              <PillButton
                active={!category}
                onClick={() => {
                  setCategory("");
                  setPage(1);
                }}
              >
                All
              </PillButton>
              {knownCategories.map((c) => (
                <PillButton
                  key={c}
                  active={category === c}
                  onClick={() => {
                    setCategory(c);
                    setPage(1);
                  }}
                >
                  {c}
                </PillButton>
              ))}
            </div>
          ) : undefined
        }
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <SlideOver
        open={slideOverOpen}
        title={editingId ? "Edit Product" : "Add Product"}
        onClose={() => setSlideOverOpen(false)}
      >
        <div className="space-y-4">
          <Field
            label="Name"
            value={form.name}
            onChange={(v) => setForm((f) => ({ ...f, name: v }))}
          />
          <Field
            label="Subtitle"
            value={form.subtitle}
            onChange={(v) => setForm((f) => ({ ...f, subtitle: v }))}
          />
          <div>
            <label className="mb-1.5 block font-inter text-xs text-white/50">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full rounded-lg bg-white/[0.08] px-4 py-3 font-inter text-sm text-white focus:ring-1 focus:ring-[#6B2FA0] focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Price"
              type="number"
              value={form.price}
              onChange={(v) => setForm((f) => ({ ...f, price: v }))}
            />
            <Field
              label="Per Unit"
              value={form.per_unit}
              onChange={(v) => setForm((f) => ({ ...f, per_unit: v }))}
              placeholder="e.g. 16.9 fl oz"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Category"
              value={form.category}
              onChange={(v) => setForm((f) => ({ ...f, category: v }))}
            />
            <div>
              <label className="mb-1.5 block font-inter text-xs text-white/50">Status</label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.value as typeof form.status }))
                }
                className="w-full rounded-lg bg-white/[0.08] px-4 py-3 font-inter text-sm text-white focus:ring-1 focus:ring-[#6B2FA0] focus:outline-none"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s} className="bg-[#0F0A1E]">
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Field
            label="Slug"
            value={form.slug}
            onChange={(v) => setForm((f) => ({ ...f, slug: v }))}
          />

          <div>
            <label className="mb-1.5 block font-inter text-xs text-white/50">Image</label>
            <div className="flex items-center gap-3">
              {form.image_url && (
                <Image
                  src={form.image_url}
                  alt=""
                  width={56}
                  height={56}
                  className="rounded-lg object-cover"
                />
              )}
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 font-inter text-sm text-white/70 hover:text-white">
                <Upload size={14} />
                {uploading ? "Uploading…" : "Upload"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                />
              </label>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded-lg bg-[#6B2FA0] py-3 font-inter text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving…" : editingId ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </SlideOver>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Product"
        message="This will permanently delete the product. This cannot be undone."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block font-inter text-xs text-white/50">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg bg-white/[0.08] px-4 py-3 font-inter text-sm text-white focus:ring-1 focus:ring-[#6B2FA0] focus:outline-none"
      />
    </div>
  );
}
