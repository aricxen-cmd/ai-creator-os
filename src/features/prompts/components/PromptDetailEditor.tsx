"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  deletePromptLibraryItem,
  getPromptLibraryItem,
  updatePromptLibraryItem,
  type PromptLibraryRow,
} from "@/lib/supabase/promptLibrary";

const categories = [
  "Script",
  "Research",
  "Storyboard",
  "Image",
  "Video",
  "Character",
  "Thumbnail",
  "Motivation",
  "Animal POV",
  "Children",
  "Sports",
  "Google Flow",
  "Viral Shorts",
  "General",
];

interface Props {
  promptId: string;
}

export default function PromptDetailEditor({
  promptId,
}: Props) {
  const router = useRouter();

  const [item, setItem] =
    useState<PromptLibraryRow | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [prompt, setPrompt] = useState("");
  const [tags, setTags] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  /*
   * Load prompt
   */
  const loadPrompt = useCallback(async () => {
    setLoading(true);
    setError("");
    setStatus("");

    try {
      const data =
        await getPromptLibraryItem(promptId);

      if (!data) {
        setItem(null);
        setError("Prompt not found.");
        return;
      }

      setItem(data);

      setTitle(data.title ?? "");

      setCategory(
        data.category ?? "General"
      );

      setDescription(
        data.description ?? ""
      );

      setPrompt(
        data.prompt ?? ""
      );

      setTags(
        Array.isArray(data.tags)
          ? data.tags.join(", ")
          : ""
      );
    } catch (err) {
      console.error(
        "Failed to load Prompt Library item:",
        err
      );

      setItem(null);

      setError(
        getErrorMessage(
          err,
          "Failed to load prompt."
        )
      );
    } finally {
      setLoading(false);
    }
  }, [promptId]);

  /*
   * Load whenever promptId changes
   */
  useEffect(() => {
    void loadPrompt();
  }, [loadPrompt]);

  /*
   * Save prompt
   */
  async function handleSave() {
    if (!item) {
      return;
    }

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!prompt.trim()) {
      setError("Prompt is required.");
      return;
    }

    setSaving(true);
    setError("");
    setStatus("");

    try {
      const updated =
        await updatePromptLibraryItem(
          item.id,
          {
            title: title.trim(),

            category:
              category.trim() ||
              "General",

            description:
              description.trim() ||
              null,

            prompt:
              prompt.trim(),

            tags:
              parseTags(tags),
          }
        );

      setItem(updated);

      setTitle(
        updated.title ?? ""
      );

      setCategory(
        updated.category ??
          "General"
      );

      setDescription(
        updated.description ??
          ""
      );

      setPrompt(
        updated.prompt ?? ""
      );

      setTags(
        Array.isArray(updated.tags)
          ? updated.tags.join(", ")
          : ""
      );

      setStatus(
        "Prompt saved."
      );
    } catch (err) {
      console.error(
        "Failed to save Prompt Library item:",
        err
      );

      setError(
        getErrorMessage(
          err,
          "Failed to save prompt."
        )
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * Delete prompt
   */
  async function handleDelete() {
    if (!item) {
      return;
    }

    const confirmed =
      window.confirm(
        `Delete "${item.title}"? This cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    setError("");
    setStatus("");

    try {
      await deletePromptLibraryItem(
        item.id
      );

      router.push(
        "/prompts/library"
      );

      router.refresh();
    } catch (err) {
      console.error(
        "Failed to delete Prompt Library item:",
        err
      );

      setError(
        getErrorMessage(
          err,
          "Failed to delete prompt."
        )
      );
    }
  }

  /*
   * Loading state
   */
  if (loading) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-zinc-400">
        Loading prompt...
      </div>
    );
  }

  /*
   * Prompt not found / load failed
   */
  if (!item) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-red-800 bg-red-950/30 p-8 text-red-300">
          <p className="font-semibold">
            Unable to load prompt
          </p>

          <p className="mt-2 text-sm">
            {error ||
              "Prompt not found."}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              void loadPrompt()
            }
            className="rounded-lg bg-emerald-600 px-5 py-3 font-semibold transition hover:bg-emerald-500"
          >
            Try Again
          </button>

          <Link
            href="/prompts/library"
            className="rounded-lg border border-zinc-700 px-5 py-3 text-zinc-300 transition hover:border-zinc-500"
          >
            Back to Prompt Vault
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-400">
          Prompt Vault
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          ✏️ Edit Prompt
        </h1>

        <p className="mt-3 text-zinc-400">
          Edit the reusable master prompt
          without cluttering the main
          Prompt Vault.
        </p>
      </div>

      {/* Status */}

      {status && (
        <div className="rounded-lg border border-emerald-800 bg-emerald-950/30 p-4 text-sm text-emerald-400">
          {status}
        </div>
      )}

      {/* Error */}

      {error && (
        <div className="rounded-lg border border-red-700 bg-red-950/50 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Editor */}

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="grid gap-5 md:grid-cols-2">
          {/* Title */}

          <Field label="Title">
            <input
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value
                )
              }
              placeholder="Prompt title"
              className="input"
            />
          </Field>

          {/* Category */}

          <Field label="Category">
            <select
              value={category}
              onChange={(event) =>
                setCategory(
                  event.target.value
                )
              }
              className="input"
            >
              {!categories.includes(
                category
              ) &&
                category && (
                  <option
                    value={category}
                  >
                    {category}
                  </option>
                )}

              {categories.map(
                (value) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {value}
                  </option>
                )
              )}
            </select>
          </Field>
        </div>

        {/* Description */}

        <Field label="Description">
          <input
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            placeholder="Short description"
            className="input"
          />
        </Field>

        {/* Prompt */}

        <Field label="Prompt">
          <textarea
            value={prompt}
            onChange={(event) =>
              setPrompt(
                event.target.value
              )
            }
            rows={24}
            placeholder="Prompt content..."
            className="input resize-y leading-7"
          />
        </Field>

        {/* Tags */}

        <Field label="Tags">
          <input
            value={tags}
            onChange={(event) =>
              setTags(
                event.target.value
              )
            }
            placeholder="science, youtube, video"
            className="input"
          />

          <p className="mt-2 text-xs text-zinc-500">
            Separate tags with commas.
          </p>
        </Field>

        {/* Actions */}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-emerald-600 px-6 py-3 font-semibold transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "💾 Save Changes"}
          </button>

          <Link
            href={`/prompts/builder?libraryPromptId=${encodeURIComponent(
              item.id
            )}`}
            className="rounded-lg border border-emerald-700 px-6 py-3 text-emerald-400 transition hover:bg-emerald-950/30"
          >
            🛠 Use in Builder
          </Link>

          <Link
            href="/prompts/library"
            className="rounded-lg border border-zinc-700 px-6 py-3 text-zinc-300 transition hover:border-zinc-500"
          >
            Back
          </Link>

          <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg border border-red-800 px-6 py-3 text-red-400 transition hover:bg-red-950/30"
          >
            Delete
          </button>
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
            transition:
              border-color 150ms ease,
              box-shadow 150ms ease;
          }

          .input:focus {
            border-color:
              rgb(16 185 129);
            box-shadow:
              0 0 0 1px
              rgb(16 185 129 / 0.25);
          }

          .input::placeholder {
            color: rgb(113 113 122);
          }
        `}</style>
      </div>
    </div>
  );
}

/*
 * Reusable field
 */
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5">
      <label className="mb-2 block text-sm font-medium text-zinc-300">
        {label}
      </label>

      {children}
    </div>
  );
}

/*
 * Convert comma-separated tags
 * into a clean unique array.
 */
function parseTags(
  value: string
): string[] {
  return Array.from(
    new Set(
      value
        .split(",")
        .map((tag) =>
          tag
            .trim()
            .toLowerCase()
        )
        .filter(Boolean)
    )
  );
}

/*
 * Supabase sometimes returns an
 * object rather than Error.
 */
function getErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null
  ) {
    const value =
      error as Record<
        string,
        unknown
      >;

    if (
      typeof value.message ===
        "string" &&
      value.message
    ) {
      return value.message;
    }

    if (
      typeof value.details ===
        "string" &&
      value.details
    ) {
      return value.details;
    }

    if (
      typeof value.hint ===
        "string" &&
      value.hint
    ) {
      return value.hint;
    }
  }

  return fallback;
}