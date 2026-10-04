"use client";

import {
  useMemo,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

import {
  useRouter,
} from "next/navigation";

import type {
  ExploreItem,
  ExplorePlatform,
} from "../types";

import {
  createExploreProject,
} from "../services/createExploreProject";

import {
  markExploreRecent,
} from "../utils/exploreLibrary";

interface Props {
  item: ExploreItem;

  compact?: boolean;
}

export default function StartExploreProjectButton({
  item,
  compact = false,
}: Props) {
  const router =
    useRouter();

  const [
    open,
    setOpen,
  ] = useState(false);

  const [
    title,
    setTitle,
  ] = useState("");

  const [
    topic,
    setTopic,
  ] = useState("");

  const [
    duration,
    setDuration,
  ] = useState(
    item.duration
  );

  const [
    platform,
    setPlatform,
  ] =
    useState<ExplorePlatform>(
      item.platforms[0] ??
        "YouTube Shorts"
    );

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const suggestedTitle =
    useMemo(() => {
      if (
        !topic.trim()
      ) {
        return "";
      }

      return `${topic.trim()} — ${item.title}`;
    }, [
      item.title,
      topic,
    ]);

  function openDialog() {
    setError("");
    setOpen(true);
  }

  function closeDialog() {
    if (loading) {
      return;
    }

    setOpen(false);
    setError("");
  }

  async function remixProject() {
    if (
      !topic.trim()
    ) {
      setError(
        "Enter a topic for your new video."
      );

      return;
    }

    setLoading(true);
    setError("");

    try {
      const project =
        await createExploreProject(
          {
            item,

            title:
              title.trim() ||
              suggestedTitle ||
              item.title,

            topic,

            duration,

            platform,
          }
        );

      /*
       * Only mark the format as
       * recently used AFTER the
       * project was successfully
       * created.
       */
      markExploreRecent(
        item.id
      );

      router.push(
        `/projects/${project.id}/research`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create project."
      );

      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={
          openDialog
        }
        className={
          compact
            ? "w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
            : "w-full rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-500"
        }
      >
        🚀 Remix Format
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onMouseDown={
            closeDialog
          }
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="explore-remix-title"
            onMouseDown={(
              event
            ) =>
              event.stopPropagation()
            }
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-zinc-800 p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                  Remix Explore Format
                </p>

                <h2
                  id="explore-remix-title"
                  className="mt-2 text-2xl font-bold text-white"
                >
                  {
                    item.title
                  }
                </h2>

                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Keep the production
                  structure while
                  replacing the original
                  concept with your own.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeDialog
                }
                disabled={
                  loading
                }
                aria-label="Close"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <FormatInfo
                    label="Format"
                    value={
                      item.category
                    }
                  />

                  <FormatInfo
                    label="Style"
                    value={
                      item.style
                    }
                  />

                  <FormatInfo
                    label="Base Duration"
                    value={
                      item.duration
                    }
                  />
                </div>
              </div>

              <Field
                label="Video Topic"
                required
                description="What should your version of this format be about?"
              >
                <textarea
                  value={
                    topic
                  }
                  onChange={(
                    event
                  ) =>
                    setTopic(
                      event
                        .target
                        .value
                    )
                  }
                  placeholder="Example: A raccoon discovers a hidden bunker underneath Area 51..."
                  rows={
                    4
                  }
                  className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm leading-6 text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-emerald-600"
                />
              </Field>

              <Field
                label="Project Title"
                description="Optional. Leave blank and AI Creator OS will build one from your topic."
              >
                <input
                  type="text"
                  value={
                    title
                  }
                  onChange={(
                    event
                  ) =>
                    setTitle(
                      event
                        .target
                        .value
                    )
                  }
                  placeholder={
                    suggestedTitle ||
                    "Project title"
                  }
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-emerald-600"
                />
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Duration"
                >
                  <select
                    value={
                      duration
                    }
                    onChange={(
                      event
                    ) =>
                      setDuration(
                        event
                          .target
                          .value
                      )
                    }
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-200 outline-none focus:border-emerald-600"
                  >
                    {getDurationOptions(
                      item
                    ).map(
                      (
                        option
                      ) => (
                        <option
                          key={
                            option
                          }
                          value={
                            option
                          }
                        >
                          {
                            option
                          }
                        </option>
                      )
                    )}
                  </select>
                </Field>

                <Field
                  label="Platform"
                >
                  <select
                    value={
                      platform
                    }
                    onChange={(
                      event
                    ) =>
                      setPlatform(
                        event
                          .target
                          .value as ExplorePlatform
                      )
                    }
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-200 outline-none focus:border-emerald-600"
                  >
                    {item.platforms.map(
                      (
                        option
                      ) => (
                        <option
                          key={
                            option
                          }
                          value={
                            option
                          }
                        >
                          {
                            option
                          }
                        </option>
                      )
                    )}
                  </select>
                </Field>
              </div>

              {item.prompt && (
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
                    Production Structure
                  </p>

                  <p className="mt-3 text-sm leading-6 text-zinc-300">
                    {
                      item.prompt
                    }
                  </p>
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-red-900/60 bg-red-950/20 p-4 text-sm text-red-300">
                  {
                    error
                  }
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-zinc-800 p-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={
                  closeDialog
                }
                disabled={
                  loading
                }
                className="rounded-xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-900 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  remixProject
                }
                disabled={
                  loading ||
                  !topic.trim()
                }
                className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Creating Project..."
                  : "🚀 Create Remix Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Field({
  label,
  description,
  required = false,
  children,
}: {
  label: string;

  description?: string;

  required?: boolean;

  children: ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-zinc-200">
        {
          label
        }

        {required && (
          <span className="ml-1 text-emerald-400">
            *
          </span>
        )}
      </label>

      {description && (
        <p className="mt-1 text-xs leading-5 text-zinc-500">
          {
            description
          }
        </p>
      )}

      <div className="mt-2">
        {
          children
        }
      </div>
    </div>
  );
}

function FormatInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-600">
        {
          label
        }
      </p>

      <p className="mt-1 text-sm font-medium text-zinc-300">
        {
          value
        }
      </p>
    </div>
  );
}

function getDurationOptions(
  item: ExploreItem
) {
  const presets: Record<
    string,
    string[]
  > = {
    brainrot: [
      "35s",
      "45s",
      "65s",
    ],

    "clay-story": [
      "42s",
      "54s",
      "60s",
    ],

    "animal-haircut": [
      "10s",
      "20s",
    ],

    "anatomy-fitness": [
      "15s",
      "20s",
      "25s",
      "30s",
      "35s",
      "40s",
      "45s",
      "65s",
    ],

    "car-evolution": [
      "20s",
      "30s",
      "40s",
      "60s",
    ],
  };

  const options =
    presets[
      item.trendFormatId
    ] ?? [
      item.duration,
      "30s",
      "45s",
      "60s",
    ];

  return Array.from(
    new Set([
      item.duration,
      ...options,
    ])
  );
}