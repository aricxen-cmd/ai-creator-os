"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

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
  const router =
    useRouter();

  const [
    item,
    setItem,
  ] =
    useState<PromptLibraryRow | null>(
      null
    );

  const [
    title,
    setTitle,
  ] = useState("");

  const [
    category,
    setCategory,
  ] = useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    prompt,
    setPrompt,
  ] = useState("");

  const [
    tags,
    setTags,
  ] = useState("");

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
    loadPrompt();
  }, [promptId]);

  async function loadPrompt() {
    setLoading(true);
    setError("");

    try {
      const data =
        await getPromptLibraryItem(
          promptId
        );

      if (!data) {
        setError(
          "Prompt not found."
        );

        return;
      }

      setItem(data);
      setTitle(
        data.title
      );
      setCategory(
        data.category
      );
      setDescription(
        data.description ??
          ""
      );
      setPrompt(
        data.prompt
      );
      setTags(
        data.tags.join(
          ", "
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load prompt."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!item) {
      return;
    }

    if (!title.trim()) {
      setError(
        "Title is required."
      );

      return;
    }

    if (!prompt.trim()) {
      setError(
        "Prompt is required."
      );

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
            title:
              title.trim(),

            category,

            description:
              description.trim() ||
              null,

            prompt:
              prompt.trim(),

            tags:
              parseTags(
                tags
              ),
          }
        );

      setItem(updated);

      setStatus(
        "Prompt saved."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save prompt."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!item) {
      return;
    }

    try {
      await deletePromptLibraryItem(
        item.id
      );

      router.push(
        "/prompts/library"
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete prompt."
      );
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-zinc-500">
        Loading prompt...
      </div>
    );
  }

  if (!item) {
    return (
      <div className="rounded-xl border border-red-800 bg-red-950/30 p-8">
        {error ||
          "Prompt not found."}
      </div>
    );
  }

  return (
    <>
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-400">
          Prompt Vault
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          ✏️ Edit Prompt
        </h1>

        <p className="mt-3 text-zinc-400">
          Edit the reusable
          master prompt without
          cluttering the main
          Prompt Vault.
        </p>
      </div>

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

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Title">
            <input
              value={
                title
              }
              onChange={(
                event
              ) =>
                setTitle(
                  event.target
                    .value
                )
              }
              className="input"
            />
          </Field>

          <Field label="Category">
            <select
              value={
                category
              }
              onChange={(
                event
              ) =>
                setCategory(
                  event.target
                    .value
                )
              }
              className="input"
            >
              {categories.map(
                (value) => (
                  <option
                    key={
                      value
                    }
                    value={
                      value
                    }
                  >
                    {value}
                  </option>
                )
              )}
            </select>
          </Field>
        </div>

        <Field label="Description">
          <input
            value={
              description
            }
            onChange={(
              event
            ) =>
              setDescription(
                event.target
                  .value
              )
            }
            className="input"
          />
        </Field>

        <Field label="Prompt">
          <textarea
            value={
              prompt
            }
            onChange={(
              event
            ) =>
              setPrompt(
                event.target
                  .value
              )
            }
            rows={24}
            className="input resize-y leading-7"
          />
        </Field>

        <Field label="Tags">
          <input
            value={
              tags
            }
            onChange={(
              event
            ) =>
              setTags(
                event.target
                  .value
              )
            }
            className="input"
          />
        </Field>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={
              handleSave
            }
            disabled={
              saving
            }
            className="rounded-lg bg-emerald-600 px-6 py-3 font-semibold transition hover:bg-emerald-500 disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "💾 Save Changes"}
          </button>

          <Link
            href={`/prompts/builder?libraryPromptId=${item.id}`}
            className="rounded-lg border border-emerald-700 px-6 py-3 text-emerald-400"
          >
            🛠 Use in Builder
          </Link>

          <Link
            href="/prompts/library"
            className="rounded-lg border border-zinc-700 px-6 py-3 text-zinc-300"
          >
            Back
          </Link>

          <button
            type="button"
            onClick={
              handleDelete
            }
            className="rounded-lg border border-red-800 px-6 py-3 text-red-400"
          >
            Delete
          </button>
        </div>

        <style jsx>{`
          .input {
            width: 100%;
            border-radius: 0.5rem;
            border: 1px solid rgb(63 63 70);
            background: rgb(9 9 11);
            padding: 0.75rem 1rem;
            color: white;
            outline: none;
          }

          .input:focus {
            border-color: rgb(16 185 129);
          }
        `}</style>
      </div>
    </>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children:
    React.ReactNode;
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

function parseTags(
  value: string
) {
  return Array.from(
    new Set(
      value
        .split(",")
        .map(
          (tag) =>
            tag
              .trim()
              .toLowerCase()
        )
        .filter(Boolean)
    )
  );
}