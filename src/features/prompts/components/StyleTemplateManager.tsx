"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  createPromptTemplate,
  deletePromptTemplate,
  getPromptTemplates,
  updatePromptTemplate,
  type PromptTemplateRow,
} from "@/lib/supabase/promptTemplates";

export default function StyleTemplateManager() {
  const [
    templates,
    setTemplates,
  ] =
    useState<
      PromptTemplateRow[]
    >([]);

  const [
    name,
    setName,
  ] = useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    styleLock,
    setStyleLock,
  ] = useState("");

  const [
    editingId,
    setEditingId,
  ] =
    useState<string | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    status,
    setStatus,
  ] = useState("");

  useEffect(() => {
    loadTemplates();
  }, []);

  async function loadTemplates() {
    setLoading(true);
    setError("");

    try {
      const data =
        await getPromptTemplates();

      setTemplates(data);
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to load Style Templates."
        )
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!name.trim()) {
      setError(
        "Template name is required."
      );

      return;
    }

    if (!styleLock.trim()) {
      setError(
        "Style Lock is required."
      );

      return;
    }

    setSaving(true);
    setError("");
    setStatus("");

    try {
      if (editingId) {
        await updatePromptTemplate(
          editingId,
          {
            name:
              name.trim(),

            description:
              description.trim(),

            style_lock:
              styleLock.trim(),
          }
        );

        setStatus(
          "Style Template updated."
        );
      } else {
        await createPromptTemplate(
          name.trim(),
          description.trim(),
          styleLock.trim()
        );

        setStatus(
          "Style Template created."
        );
      }

      clearForm();

      await loadTemplates();
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to save Style Template."
        )
      );
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(
    template: PromptTemplateRow
  ) {
    setEditingId(
      template.id
    );

    setName(
      template.name
    );

    setDescription(
      template.description ??
        ""
    );

    setStyleLock(
      template.style_lock ??
        ""
    );

    setError("");
    setStatus("");
  }

  async function handleDelete(
    id: string
  ) {
    setError("");
    setStatus("");

    try {
      await deletePromptTemplate(
        id
      );

      setTemplates(
        (previous) =>
          previous.filter(
            (template) =>
              template.id !== id
          )
      );

      if (
        editingId === id
      ) {
        clearForm();
      }

      setStatus(
        "Style Template deleted."
      );
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to delete Style Template."
        )
      );
    }
  }

  function clearForm() {
    setEditingId(null);
    setName("");
    setDescription("");
    setStyleLock("");
  }

  return (
    <div className="space-y-6">
      {status && (
        <div className="rounded-lg border border-emerald-800 bg-emerald-950/30 p-4 text-sm text-emerald-400">
          {status}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-700 bg-red-950/50 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[400px_1fr]">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-xl font-bold">
            {editingId
              ? "✏️ Edit Style"
              : "➕ Add Style Template"}
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            Define a reusable
            visual system for
            consistent image and
            video generation.
          </p>

          <div className="mt-6">
            <label className="mb-2 block text-sm text-zinc-400">
              Template Name
            </label>

            <input
              value={name}
              onChange={(
                event
              ) =>
                setName(
                  event.target.value
                )
              }
              placeholder="Premium Claymation"
              className="input"
            />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm text-zinc-400">
              Description
            </label>

            <input
              value={
                description
              }
              onChange={(
                event
              ) =>
                setDescription(
                  event.target.value
                )
              }
              placeholder="Premium stop-motion clay animation."
              className="input"
            />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm text-zinc-400">
              Style Lock
            </label>

            <textarea
              value={
                styleLock
              }
              onChange={(
                event
              ) =>
                setStyleLock(
                  event.target.value
                )
              }
              rows={16}
              placeholder="Define rendering style, materials, lighting, texture, color treatment, consistency rules..."
              className="input resize-y leading-6"
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={
                handleSave
              }
              disabled={saving}
              className="rounded-lg bg-emerald-600 px-5 py-3 font-semibold transition hover:bg-emerald-500 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "💾 Save Changes"
                  : "💾 Add Template"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={
                  clearForm
                }
                className="rounded-lg border border-zinc-700 px-5 py-3 text-zinc-300"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">
                🎨 Saved Styles
              </h2>

              <p className="mt-2 text-sm text-zinc-400">
                Shared with
                Prompt Builder
                and Scene Studio.
              </p>
            </div>

            <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400">
              {templates.length}
            </span>
          </div>

          {loading ? (
            <p className="mt-6 text-sm text-zinc-500">
              Loading Style
              Templates...
            </p>
          ) : templates.length ===
            0 ? (
            <div className="mt-6 rounded-lg border border-dashed border-zinc-700 p-8 text-center">
              <p className="text-sm text-zinc-500">
                No Style
                Templates yet.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {templates.map(
                (template) => (
                  <div
                    key={
                      template.id
                    }
                    className={`rounded-xl border bg-zinc-950 p-5 ${
                      editingId ===
                      template.id
                        ? "border-emerald-500"
                        : "border-zinc-800"
                    }`}
                  >
                    <h3 className="font-semibold">
                      {
                        template.name
                      }
                    </h3>

                    {template.description && (
                      <p className="mt-2 text-sm text-zinc-500">
                        {
                          template.description
                        }
                      </p>
                    )}

                    <p className="mt-3 line-clamp-6 whitespace-pre-wrap text-xs leading-5 text-zinc-600">
                      {
                        template.style_lock
                      }
                    </p>

                    <div className="mt-5 flex gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(
                            template
                          )
                        }
                        className="text-sm text-emerald-400"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            template.id
                          )
                        }
                        className="text-sm text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid
            rgb(63 63 70);
          background: rgb(9 9 11);
          padding: 0.75rem 1rem;
          color: white;
          outline: none;
        }

        .input:focus {
          border-color: rgb(
            16 185 129
          );
        }
      `}</style>
    </div>
  );
}

function getErrorMessage(
  error: unknown,
  fallback: string
) {
  if (
    error instanceof Error
  ) {
    return error.message;
  }

  if (
    typeof error ===
      "object" &&
    error !== null
  ) {
    const value =
      error as Record<
        string,
        unknown
      >;

    if (
      typeof value.message ===
      "string"
    ) {
      return value.message;
    }
  }

  return fallback;
}