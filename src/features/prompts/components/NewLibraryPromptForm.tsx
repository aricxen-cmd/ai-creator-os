"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import Link from "next/link";

import {
  createPromptLibraryItem,
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

export default function NewLibraryPromptForm() {
  const router =
    useRouter();

  const [
    title,
    setTitle,
  ] = useState("");

  const [
    category,
    setCategory,
  ] = useState(
    "Script"
  );

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
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  async function handleSave() {
    if (!title.trim()) {
      setError(
        "Prompt title is required."
      );

      return;
    }

    if (!prompt.trim()) {
      setError(
        "Prompt content is required."
      );

      return;
    }

    setSaving(true);
    setError("");

    try {
      const result =
        await createPromptLibraryItem({
          title,
          category,
          description,
          prompt,
          tags:
            parseTags(
              tags
            ),
        });

      if (!result.created) {
        setError(
          `A prompt named "${result.item.title}" already exists in ${result.item.category}.`
        );

        return;
      }

      router.push(
        `/prompts/library/${result.item.id}`
      );
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to create prompt."
        )
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      {error && (
        <div className="mb-6 rounded-lg border border-red-700 bg-red-950/50 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

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
            placeholder="Prompt title"
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
              (item) => (
                <option
                  key={
                    item
                  }
                  value={
                    item
                  }
                >
                  {item}
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
          placeholder="What this prompt does..."
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
          rows={20}
          placeholder="Enter reusable prompt..."
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
          placeholder="youtube, viral, script"
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
            : "💾 Save Prompt"}
        </button>

        <Link
          href="/prompts/library"
          className="rounded-lg border border-zinc-700 px-6 py-3 text-zinc-300 transition hover:border-zinc-500"
        >
          Cancel
        </Link>
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

function getErrorMessage(
  error: unknown,
  fallback: string
) {
  if (
    error instanceof Error
  ) {
    return error.message;
  }

  return fallback;
}