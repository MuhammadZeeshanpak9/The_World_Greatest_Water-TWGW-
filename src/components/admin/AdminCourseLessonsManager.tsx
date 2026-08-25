"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowDown, ArrowUp, Plus } from "lucide-react";
import toast from "react-hot-toast";
import SlideOver from "@/components/admin/SlideOver";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

type Lesson = {
  id: string;
  course_slug: string;
  title: string;
  content: string | null;
  video_url: string | null;
  order_index: number;
};

const EMPTY_FORM = { title: "", content: "", video_url: "" };

export default function AdminCourseLessonsManager({ slug }: { slug: string }) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  const [slideOverOpen, setSlideOverOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [reorderingId, setReorderingId] = useState<string | null>(null);

  const loadLessons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/courses/${slug}/lessons`);
      if (!res.ok) throw new Error("Failed to load lessons");
      const json = await res.json();
      setLessons(json.lessons ?? []);
    } catch {
      toast.error("Unable to load lessons");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadLessons();
  }, [loadLessons]);

  function openAdd() {
    setEditingLesson(null);
    setForm(EMPTY_FORM);
    setSlideOverOpen(true);
  }

  function openEdit(lesson: Lesson) {
    setEditingLesson(lesson);
    setForm({
      title: lesson.title,
      content: lesson.content ?? "",
      video_url: lesson.video_url ?? "",
    });
    setSlideOverOpen(true);
  }

  async function handleSave() {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(
        editingLesson
          ? `/api/admin/courses/${slug}/lessons/${editingLesson.id}`
          : `/api/admin/courses/${slug}/lessons`,
        {
          method: editingLesson ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Unable to save lesson");
      toast.success(editingLesson ? "Lesson updated" : "Lesson created");
      setSlideOverOpen(false);
      await loadLessons();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to save lesson");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/courses/${slug}/lessons/${deleteId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Unable to delete lesson");
      toast.success("Lesson deleted");
      setDeleteId(null);
      await loadLessons();
    } catch {
      toast.error("Unable to delete lesson");
    } finally {
      setDeleting(false);
    }
  }

  async function handleReorder(lesson: Lesson, direction: "up" | "down") {
    const sorted = [...lessons].sort((a, b) => a.order_index - b.order_index);
    const index = sorted.findIndex((l) => l.id === lesson.id);
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= sorted.length) return;

    const other = sorted[swapIndex];
    setReorderingId(lesson.id);
    try {
      const results = await Promise.all([
        fetch(`/api/admin/courses/${slug}/lessons/${lesson.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_index: other.order_index }),
        }),
        fetch(`/api/admin/courses/${slug}/lessons/${other.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_index: lesson.order_index }),
        }),
      ]);
      if (results.some((r) => !r.ok)) throw new Error("Unable to reorder lessons");
      await loadLessons();
    } catch {
      toast.error("Unable to reorder lessons");
    } finally {
      setReorderingId(null);
    }
  }

  const sortedLessons = [...lessons].sort((a, b) => a.order_index - b.order_index);

  return (
    <div>
      <Link
        href="/admin/courses"
        className="mb-4 inline-flex items-center gap-2 font-inter text-sm text-white/60 hover:text-white"
      >
        <ArrowLeft size={14} /> Back to Courses
      </Link>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-cormorant text-4xl text-white">{slug}</h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 rounded-lg bg-[#6B2FA0] px-4 py-2.5 font-inter text-sm font-semibold text-white hover:opacity-90"
        >
          <Plus size={16} /> Add Lesson
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-white/5" />
          ))}
        </div>
      ) : sortedLessons.length === 0 ? (
        <p className="font-inter text-sm text-white/50">No lessons yet.</p>
      ) : (
        <div className="space-y-2">
          {sortedLessons.map((lesson, i) => (
            <div
              key={lesson.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleReorder(lesson, "up")}
                    disabled={i === 0 || reorderingId === lesson.id}
                    className="text-white/40 hover:text-white disabled:opacity-30"
                    aria-label="Move up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    onClick={() => handleReorder(lesson, "down")}
                    disabled={i === sortedLessons.length - 1 || reorderingId === lesson.id}
                    className="text-white/40 hover:text-white disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>
                <div>
                  <p className="font-inter text-sm text-white">{lesson.title}</p>
                  <p className="font-inter text-xs text-white/40">Order {lesson.order_index}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => openEdit(lesson)}
                  className="font-inter text-xs text-[#6B2FA0] hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteId(lesson.id)}
                  className="font-inter text-xs text-[#EF4444] hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <SlideOver
        open={slideOverOpen}
        title={editingLesson ? "Edit Lesson" : "Add Lesson"}
        onClose={() => setSlideOverOpen(false)}
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block font-inter text-xs text-white/50">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full rounded-lg bg-white/[0.08] px-4 py-3 font-inter text-sm text-white focus:ring-1 focus:ring-[#6B2FA0] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block font-inter text-xs text-white/50">Content</label>
            <textarea
              rows={6}
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              className="w-full rounded-lg bg-white/[0.08] px-4 py-3 font-inter text-sm text-white focus:ring-1 focus:ring-[#6B2FA0] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block font-inter text-xs text-white/50">
              Video URL (YouTube or direct file)
            </label>
            <input
              value={form.video_url}
              onChange={(e) => setForm((f) => ({ ...f, video_url: e.target.value }))}
              placeholder="https://youtube.com/watch?v=... or https://.../video.mp4"
              className="w-full rounded-lg bg-white/[0.08] px-4 py-3 font-inter text-sm text-white focus:ring-1 focus:ring-[#6B2FA0] focus:outline-none"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded-lg bg-[#6B2FA0] py-3 font-inter text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving…" : editingLesson ? "Save Changes" : "Create Lesson"}
          </button>
        </div>
      </SlideOver>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Lesson"
        message="This will permanently delete the lesson. This cannot be undone."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
