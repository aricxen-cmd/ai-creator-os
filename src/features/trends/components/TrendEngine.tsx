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
  getTrendCategories,
  trendCatalog,
  type TrendFormat,
} from "../data/trendCatalog";

const categories =
  getTrendCategories();

type TrendView =
  | "all"
  | "hot"
  | "new";

export default function TrendEngine() {
  const [
    search,
    setSearch,
  ] = useState("");

  const [
    category,
    setCategory,
  ] = useState(
    "All"
  );

  const [
    view,
    setView,
  ] =
    useState<TrendView>(
      "all"
    );

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

      return trendCatalog.filter(
        (
          format
        ) => {
          /*
           * CATEGORY
           */
          if (
            category !==
              "All" &&
            format.category !==
              category
          ) {
            return false;
          }

          /*
           * VIEW
           */
          if (
            view ===
              "hot" &&
            !format.isHot
          ) {
            return false;
          }

          if (
            view ===
              "new" &&
            !format.isNew
          ) {
            return false;
          }

          /*
           * SEARCH
           */
          if (!query) {
            return true;
          }

          return [
            format.title,
            format.description,
            format.category,
            format.style,
            format.structureFamily,
            format.audioMode,
            format.recommendedModel,
            ...format.tags,
          ]
            .join(" ")
            .toLowerCase()
            .includes(
              query
            );
        }
      );
    }, [
      search,
      category,
      view,
    ]);

  const hotCount =
    trendCatalog.filter(
      (
        item
      ) =>
        item.isHot
    ).length;

  const newCount =
    trendCatalog.filter(
      (
        item
      ) =>
        item.isNew
    ).length;

  async function copyPrompt(
    format: TrendFormat
  ) {
    setError("");
    setStatus("");

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
    setSaving(
      true
    );

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

      if (
        !result.created
      ) {
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
      setSaving(
        false
      );
    }
  }

  return (
    <div className="space-y-6">
      {/* STATUS */}

      {status && (
        <div className="rounded-lg border border-emerald-800 bg-emerald-950/30 p-4 text-sm text-emerald-400">
          {
            status
          }
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-700 bg-red-950/40 p-4 text-sm text-red-300">
          {
            error
          }
        </div>
      )}

      {/* TREND STATS */}

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat
          label="Formats"
          value={
            trendCatalog.length
          }
          icon="🔥"
        />

        <Stat
          label="Hot"
          value={
            hotCount
          }
          icon="⚡"
        />

        <Stat
          label="New"
          value={
            newCount
          }
          icon="✨"
        />
      </div>

      {/* SEARCH */}

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <input
              value={
                search
              }
              onChange={(
                event
              ) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search trends, styles, models or formats..."
              className="input flex-1"
            />

            <div className="flex gap-2">
              <ViewButton
                label="All"
                active={
                  view ===
                  "all"
                }
                onClick={() =>
                  setView(
                    "all"
                  )
                }
              />

              <ViewButton
                label="🔥 Hot"
                active={
                  view ===
                  "hot"
                }
                onClick={() =>
                  setView(
                    "hot"
                  )
                }
              />

              <ViewButton
                label="✨ New"
                active={
                  view ===
                  "new"
                }
                onClick={() =>
                  setView(
                    "new"
                  )
                }
              />
            </div>
          </div>

          {/* CATEGORY FILTERS */}

          <div className="flex flex-wrap gap-2">
            {categories.map(
              (
                item
              ) => (
                <button
                  key={
                    item
                  }
                  type="button"
                  onClick={() =>
                    setCategory(
                      item
                    )
                  }
                  className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                    category ===
                    item
                      ? "border-emerald-500 bg-emerald-950/30 text-emerald-400"
                      : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                  }`}
                >
                  {
                    item
                  }
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* RESULT COUNT */}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-500">
          Showing{" "}
          <span className="font-semibold text-zinc-300">
            {
              filtered.length
            }
          </span>{" "}
          trend formats
        </p>

        {(search ||
          category !==
            "All" ||
          view !== "all") && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setCategory(
                "All"
              );
              setView(
                "all"
              );
            }}
            className="text-xs font-medium text-emerald-400 hover:text-emerald-300"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_430px]">
        {/* TREND GRID */}

        <div>
          {filtered.length ===
          0 ? (
            <div className="flex min-h-80 items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/40 p-8 text-center">
              <div>
                <div className="text-4xl">
                  🔎
                </div>

                <h3 className="mt-4 font-semibold text-zinc-200">
                  No trend formats
                  found
                </h3>

                <p className="mt-2 text-sm text-zinc-500">
                  Try changing your
                  search or filters.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filtered.map(
                (
                  format
                ) => (
                  <TrendCard
                    key={
                      format.id
                    }
                    format={
                      format
                    }
                    selected={
                      selected?.id ===
                      format.id
                    }
                    onPreview={() =>
                      setSelected(
                        format
                      )
                    }
                  />
                )
              )}
            </div>
          )}
        </div>

        {/* PREVIEW */}

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
                    Preview a production
                    format, inspect its
                    rules, or open the
                    full Trend workflow.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div className="text-4xl">
                    {
                      selected.icon
                    }
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selected.isHot && (
                      <Badge type="hot">
                        HOT
                      </Badge>
                    )}

                    {selected.isNew && (
                      <Badge type="new">
                        NEW
                      </Badge>
                    )}
                  </div>
                </div>

                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-500">
                  {
                    selected.category
                  }
                </p>

                <h2 className="mt-2 text-2xl font-bold">
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
                    {selected.productionRules
                      .slice(
                        0,
                        5
                      )
                      .map(
                        (
                          rule
                        ) => (
                          <p
                            key={
                              rule
                            }
                            className="text-sm leading-6 text-zinc-400"
                          >
                            <span className="text-emerald-500">
                              ✓
                            </span>{" "}
                            {
                              rule
                            }
                          </p>
                        )
                      )}
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Tags
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {selected.tags.map(
                      (
                        tag
                      ) => (
                        <span
                          key={
                            tag
                          }
                          className="rounded-md bg-zinc-950 px-2 py-1 text-[11px] text-zinc-500"
                        >
                          #
                          {
                            tag
                          }
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div className="mt-6 grid gap-3">
                  <Link
                    href={`/trends/${selected.id}`}
                    className="rounded-lg bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-500"
                  >
                    🚀 Open Format
                  </Link>

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
                    className="rounded-lg border border-zinc-700 px-4 py-3 text-sm text-zinc-300 transition hover:border-zinc-500 disabled:opacity-50"
                  >
                    {saving
                      ? "Saving..."
                      : "📚 Save to Prompt Vault"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      copyPrompt(
                        selected
                      )
                    }
                    className="rounded-lg border border-zinc-700 px-4 py-3 text-sm text-zinc-300 transition hover:border-zinc-500"
                  >
                    📋 Copy Master Prompt
                  </button>
                </div>
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

        .input::placeholder {
          color:
            rgb(113 113 122);
        }
      `}</style>
    </div>
  );
}

function TrendCard({
  format,
  selected,
  onPreview,
}: {
  format: TrendFormat;
  selected: boolean;
  onPreview:
    () => void;
}) {
  return (
    <div
      className={`rounded-xl border p-5 transition ${
        selected
          ? "border-emerald-500 bg-emerald-950/10"
          : "border-zinc-800 bg-zinc-900 hover:border-zinc-600"
      }`}
    >
      <button
        type="button"
        onClick={
          onPreview
        }
        className="w-full text-left"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="text-3xl">
            {
              format.icon
            }
          </div>

          <div className="flex gap-2">
            {format.isHot && (
              <Badge type="hot">
                HOT
              </Badge>
            )}

            {format.isNew && (
              <Badge type="new">
                NEW
              </Badge>
            )}
          </div>
        </div>

        <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
          {
            format.category
          }
        </p>

        <h3 className="mt-1 text-lg font-bold">
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
            .slice(
              0,
              4
            )
            .map(
              (
                tag
              ) => (
                <span
                  key={
                    tag
                  }
                  className="rounded-md bg-zinc-950 px-2 py-1 text-[11px] text-zinc-500"
                >
                  #
                  {
                    tag
                  }
                </span>
              )
            )}
        </div>

        <div className="mt-4 flex items-center gap-3 text-[11px] text-zinc-600">
          <span>
            {
              format.durations.length
            }{" "}
            durations
          </span>

          <span>
            •
          </span>

          <span className="capitalize">
            {
              format.audioMode
            }
          </span>
        </div>
      </button>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-zinc-800 pt-4">
        <button
          type="button"
          onClick={
            onPreview
          }
          className="text-sm font-medium text-zinc-400 transition hover:text-zinc-200"
        >
          Preview
        </button>

        <Link
          href={`/trends/${format.id}`}
          className="text-sm font-semibold text-emerald-400 transition hover:text-emerald-300"
        >
          Open Format →
        </Link>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-600">
            {
              label
            }
          </p>

          <p className="mt-1 text-2xl font-bold text-zinc-100">
            {
              value
            }
          </p>
        </div>

        <span className="text-2xl">
          {
            icon
          }
        </span>
      </div>
    </div>
  );
}

function ViewButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick:
    () => void;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
        active
          ? "border-emerald-500 bg-emerald-950/30 text-emerald-400"
          : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
      }`}
    >
      {
        label
      }
    </button>
  );
}

function Badge({
  children,
  type,
}: {
  children:
    React.ReactNode;

  type:
    | "hot"
    | "new";
}) {
  return (
    <span
      className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
        type ===
        "hot"
          ? "bg-red-950/50 text-red-400"
          : "bg-emerald-950/50 text-emerald-400"
      }`}
    >
      {
        children
      }
    </span>
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
        {
          label
        }
      </p>

      <p className="mt-1 text-sm font-medium capitalize text-zinc-300">
        {
          value
        }
      </p>
    </div>
  );
}