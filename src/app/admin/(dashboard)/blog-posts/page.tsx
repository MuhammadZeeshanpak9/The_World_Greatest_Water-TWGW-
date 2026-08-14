"use client";

import { useMemo, useState } from "react";
import { FileText, Plus } from "lucide-react";
import toast from "react-hot-toast";
import DataTable, { type Column } from "@/components/admin/DataTable";
import SlideOver from "@/components/admin/SlideOver";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useAdminTable } from "@/lib/hooks/useAdminTable";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  teaser: string | null;
  content: string | null;
  topic: string | null;
  published: boolean;
  updated_at: string;
};

const EMPTY_FORM = { title: "", teaser: "", topic: "", content: "", published: false };

function slugify(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogPostsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [slideOverOpen, setSlideOverOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    p.set("page", String(page));
    return p.toString();
  }, [search, page]);

  const { rows, total, loading, error, refetch } = useAdminTable<BlogPost>(
    "/api/admin/blog-posts",
    "posts",
    queryString,
  );

  const totalPages = Math.max(1, Math.ceil(total / 20));

  function openAdd() {
    setEditingPost(null);
    setForm(EMPTY_FORM);
    setSlideOverOpen(true);
  }

  function openEdit(post: BlogPost) {
    setEditingPost(post);
    setForm({
      title: post.title,
      teaser: post.teaser ?? "",
      topic: post.topic ?? "",
      content: post.content ?? "",
      published: post.published,
    });
    setSlideOverOpen(true);
  }

  async function togglePublished(post: BlogPost) {
    setTogglingId(post.id);
    try {
      const res = await fetch(`/api/admin/blog-posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !post.published }),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success(post.published ? "Post unpublished" : "Post published");
      refetch();
    } catch {
      toast.error("Failed to update publish status");
    } finally {
      setTogglingId(null);
    }
  }

  async function handleSave() {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setSaving(true);
    try {
      const payload = editingPost ? { ...form } : { ...form, slug: slugify(form.title) };

      const res = await fetch(
        editingPost ? `/api/admin/blog-posts/${editingPost.id}` : "/api/admin/blog-posts",
        {
          method: editingPost ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to save post");

      toast.success(editingPost ? "Post updated" : "Post created");
      setSlideOverOpen(false);
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save post");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/blog-posts/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete post");
      toast.success("Post deleted");
      setDeleteId(null);
      refetch();
    } catch {
      toast.error("Failed to delete post");
    } finally {
      setDeleting(false);
    }
  }

  const columns: Column<BlogPost>[] = [
    { header: "Title", accessor: (r) => r.title },
    { header: "Topic", accessor: (r) => r.topic ?? "—" },
    {
      header: "Published",
      accessor: (r) => (
        <Toggle
          checked={r.published}
          disabled={togglingId === r.id}
          onChange={() => togglePublished(r)}
        />
      ),
    },
    { header: "Updated", accessor: (r) => formatDate(r.updated_at) },
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
        <h1 className="font-cormorant text-4xl text-white">Blog Posts</h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 rounded-lg bg-[#6B2FA0] px-4 py-2.5 font-inter text-sm font-semibold text-white hover:opacity-90"
        >
          <Plus size={16} /> Add Post
        </button>
      </div>

      <DataTable<BlogPost>
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        loading={loading}
        error={error}
        onRetry={refetch}
        emptyIcon={FileText}
        emptyMessage="No blog posts yet."
        searchValue={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        searchPlaceholder="Search title…"
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <SlideOver
        open={slideOverOpen}
        title={editingPost ? "Edit Post" : "Add Post"}
        onClose={() => setSlideOverOpen(false)}
      >
        <div className="space-y-4">
          <Field
            label="Title"
            value={form.title}
            onChange={(v) => setForm((f) => ({ ...f, title: v }))}
          />
          <Field
            label="Teaser"
            value={form.teaser}
            onChange={(v) => setForm((f) => ({ ...f, teaser: v }))}
          />
          <Field
            label="Topic"
            value={form.topic}
            onChange={(v) => setForm((f) => ({ ...f, topic: v }))}
          />
          <div>
            <label className="mb-1.5 block font-inter text-xs text-white/50">Content</label>
            <textarea
              rows={10}
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              className="w-full rounded-lg bg-white/[0.08] px-4 py-3 font-inter text-sm text-white focus:ring-1 focus:ring-[#6B2FA0] focus:outline-none"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-inter text-sm text-white/70">Published</span>
            <Toggle
              checked={form.published}
              onChange={() => setForm((f) => ({ ...f, published: !f.published }))}
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded-lg bg-[#6B2FA0] py-3 font-inter text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving…" : editingPost ? "Save Changes" : "Create Post"}
          </button>
        </div>
      </SlideOver>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Post"
        message="This will permanently delete the blog post. This cannot be undone."
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block font-inter text-xs text-white/50">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg bg-white/[0.08] px-4 py-3 font-inter text-sm text-white focus:ring-1 focus:ring-[#6B2FA0] focus:outline-none"
      />
    </div>
  );
}

function Toggle({
  checked,
  disabled,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      disabled={disabled}
      aria-pressed={checked}
      className={`relative h-6 w-11 rounded-full transition-colors disabled:opacity-40 ${checked ? "bg-[#10B981]" : "bg-white/20"}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${checked ? "translate-x-[22px]" : "translate-x-0.5"}`}
      />
    </button>
  );
}
