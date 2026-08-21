"use client";

import {
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  createPromptLibraryItem,
} from "@/lib/supabase/promptLibrary";

import {
  trendFormats,
  type TrendFormat,
} from "../data/trendFormats";

const categories = [
  "All",
  "Stories",
  "Animals",
  "Science",
  "Transformation",
  "Mystery",
];

export default function TrendEngine() {
  const [
    search,
    setSearch,
  ] = useState("");

  const [
    category,
    setCategory,
  ] = useState("All");

  const [
    selected,
    setSelected,
  ] =
    useState<TrendFormat | null>(
      null
    );

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    status,
    setStatus,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const filtered =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return trendFormats.filter(
        (format) => {
          if (
            category !== "All" &&
            format.category !==
              category
          ) {
            return false;
          }

          if (!query) {
            return true;
          }

          return [
            format.title,
            format.description,
            format.category,
            format.style,
            ...format.tags,
          ]
            .join(" ")
            .toLowerCase()
            .includes(query);
        }
      );
    }, [
      search,
      category,
    ]);

  async function copyPrompt(
    format: TrendFormat
  ) {
    try {
      await navigator.clipboard.writeText(
        format.prompt
      );

      setStatus(
        `${format.title} prompt copied.`
      );
    } catch {
      setError(
        "Unable to copy prompt."
      );
    }
  }

  async function saveToVault(
    format: TrendFormat
  ) {
    setSaving(true);
    setError("");
    setStatus("");

    try {
      const result =
        await createPromptLibraryItem(
          {
            title:
              format.title,

            category:
              "Video",

            description:
              format.description,

            prompt:
              format.prompt,

            tags:
              format.tags,
          }
        );

      if (!result.created) {
        setStatus(
          `"${format.title}" is already in Prompt Vault.`
        );

        return;
      }

      setStatus(
        `"${format.title}" added to Prompt Vault.`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save trend prompt."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {status && (
        <div className="rounded-lg border border-emerald-800 bg-emerald-950/30 p-4 text-sm text-emerald-400">
          {status}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-700 bg-red-950/40 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
        <div className="flex flex-col gap-4 lg:flex-row">
          <input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search formats..."
            className="input flex-1"
          />

          <div className="flex flex-wrap gap-2">
            {categories.map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    setCategory(
                      item
                    )
                  }
                  className={`rounded-lg border px-4 py-2 text-sm transition ${
                    category ===
                    item
                      ? "border-emerald-500 bg-emerald-950/30 text-emerald-400"
                      : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_430px]">
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map(
            (format) => (
              <button
                key={
                  format.id
                }
                type="button"
                onClick={() =>
                  setSelected(
                    format
                  )
                }
                className={`rounded-xl border p-5 text-left transition ${
                  selected?.id ===
                  format.id
                    ? "border-emerald-500 bg-emerald-950/10"
                    : "border-zinc-800 bg-zinc-900 hover:border-zinc-600"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="text-3xl">
                    {
                      format.icon
                    }
                  </div>

                  <div className="flex gap-2">
                    {format.isHot && (
                      <span className="rounded-full bg-red-950/50 px-2 py-1 text-[10px] font-semibold text-red-400">
                        HOT
                      </span>
                    )}

                    {format.isNew && (
                      <span className="rounded-full bg-emerald-950/50 px-2 py-1 text-[10px] font-semibold text-emerald-400">
                        NEW
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="mt-4 text-lg font-bold">
                  {
                    format.title
                  }
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {
                    format.description
                  }
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {format.tags
                    .slice(0, 4)
                    .map(
                      (tag) => (
                        <span
                          key={
                            tag
                          }
                          className="rounded-md bg-zinc-950 px-2 py-1 text-[11px] text-zinc-500"
                        >
                          #{tag}
                        </span>
                      )
                    )}
                </div>

                <p className="mt-5 text-sm font-medium text-emerald-400">
                  Open Format →
                </p>
              </button>
            )
          )}
        </div>

        <div className="xl:sticky xl:top-6 xl:self-start">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            {!selected ? (
              <div className="flex min-h-125 items-center justify-center text-center">
                <div>
                  <div className="text-5xl">
                    🔥
                  </div>

                  <h2 className="mt-4 text-xl font-bold">
                    Select a format
                  </h2>

                  <p className="mt-2 max-w-xs text-sm leading-6 text-zinc-500">
                    Choose a viral
                    production format
                    to inspect its
                    rules and send it
                    into Prompt Vault.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="text-4xl">
                  {
                    selected.icon
                  }
                </div>

                <h2 className="mt-4 text-2xl font-bold">
                  {
                    selected.title
                  }
                </h2>

                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {
                    selected.description
                  }
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Info
                    label="Structure"
                    value={
                      selected.structureFamily
                    }
                  />

                  <Info
                    label="Audio"
                    value={
                      selected.audioMode
                    }
                  />

                  <Info
                    label="Style"
                    value={
                      selected.style
                    }
                  />

                  <Info
                    label="Model"
                    value={
                      selected.recommendedModel
                    }
                  />
                </div>

                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Durations
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {selected.durations.map(
                      (
                        duration
                      ) => (
                        <span
                          key={
                            duration
                          }
                          className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300"
                        >
                          {
                            duration
                          }
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Production Rules
                  </p>

                  <div className="mt-3 space-y-2">
                    {selected.productionRules.map(
                      (
                        rule
                      ) => (
                        <p
                          key={
                            rule
                          }
                          className="text-sm leading-6 text-zinc-400"
                        >
                          ✓{" "}
                          {rule}
                        </p>
                      )
                    )}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      saveToVault(
                        selected
                      )
                    }
                    disabled={
                      saving
                    }
                    className="rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold transition hover:bg-emerald-500 disabled:opacity-50"
                  >
                    {saving
                      ? "Saving..."
                      : "📚 Add to Prompt Vault"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      copyPrompt(
                        selected
                      )
                    }
                    className="rounded-lg border border-zinc-700 px-4 py-3 text-sm text-zinc-300"
                  >
                    📋 Copy Prompt
                  </button>
                </div>

                <Link
                  href="/prompts/library"
                  className="mt-4 inline-block text-sm font-medium text-emerald-400"
                >
                  Open Prompt Vault →
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid
            rgb(63 63 70);
          background:
            rgb(9 9 11);
          padding:
            0.75rem 1rem;
          color: white;
          outline: none;
        }

        .input:focus {
          border-color:
            rgb(16 185 129);
        }
      `}</style>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
      <p className="text-[10px] uppercase tracking-wide text-zinc-600">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium capitalize text-zinc-300">
        {value}
      </p>
    </div>
  );
}