"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  getPromptLibrary,
  incrementPromptUse,
  togglePromptFavorite,
  type PromptLibraryRow,
} from "@/lib/supabase/promptLibrary";

const categories = [
  "All",
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

export default function PromptLibrary() {
  const [
    prompts,
    setPrompts,
  ] = useState<PromptLibraryRow[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("All");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    favoritesOnly,
    setFavoritesOnly,
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
    loadPrompts();
  }, []);

  async function loadPrompts() {
    setLoading(true);
    setError("");

    try {
      const data =
        await getPromptLibrary();

      setPrompts(data);
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to load Prompt Vault."
        )
      );
    } finally {
      setLoading(false);
    }
  }

  const categoryCounts =
    useMemo(() => {
      const counts:
        Record<string, number> = {
          All: prompts.length,
        };

      for (
        const category of
        categories
      ) {
        if (
          category === "All"
        ) {
          continue;
        }

        counts[category] =
          prompts.filter(
            (prompt) =>
              prompt.category ===
              category
          ).length;
      }

      return counts;
    }, [prompts]);

  const favoriteCount =
    useMemo(
      () =>
        prompts.filter(
          (prompt) =>
            prompt.favorite
        ).length,
      [prompts]
    );

  const filteredPrompts =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return prompts.filter(
        (item) => {
          if (
            selectedCategory !==
              "All" &&
            item.category !==
              selectedCategory
          ) {
            return false;
          }

          if (
            favoritesOnly &&
            !item.favorite
          ) {
            return false;
          }

          if (!query) {
            return true;
          }

          const searchable = [
            item.title,
            item.category,
            item.description ?? "",
            item.prompt,
            ...item.tags,
          ]
            .join(" ")
            .toLowerCase();

          return searchable.includes(
            query
          );
        }
      );
    }, [
      prompts,
      search,
      selectedCategory,
      favoritesOnly,
    ]);

  async function handleFavorite(
    item: PromptLibraryRow
  ) {
    try {
      await togglePromptFavorite(
        item.id,
        !item.favorite
      );

      setPrompts(
        (previous) =>
          previous.map(
            (prompt) =>
              prompt.id === item.id
                ? {
                    ...prompt,
                    favorite:
                      !item.favorite,
                  }
                : prompt
          )
      );
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to update favorite."
        )
      );
    }
  }

  async function handleUse(
    item: PromptLibraryRow
  ) {
    try {
      await incrementPromptUse(
        item.id,
        item.use_count
      );
    } catch {
      // Usage tracking should not block prompt use.
    }

    window.location.href =
      `/prompts/builder?libraryPromptId=${encodeURIComponent(
        item.id
      )}`;
  }

  async function handleCopy(
    prompt: string
  ) {
    try {
      await navigator.clipboard.writeText(
        prompt
      );

      setStatus(
        "Prompt copied."
      );
    } catch {
      setError(
        "Unable to copy prompt."
      );
    }
  }

  function selectCategory(
    category: string
  ) {
    setSelectedCategory(
      category
    );

    setFavoritesOnly(
      false
    );
  }

  function selectFavorites() {
    setSelectedCategory(
      "All"
    );

    setFavoritesOnly(
      true
    );
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

      <div className="grid gap-6 xl:grid-cols-[230px_minmax(0,1fr)]">
        {/* LEFT SIDEBAR */}

        <aside className="h-fit rounded-xl border border-zinc-800 bg-zinc-900 p-4 xl:sticky xl:top-6">
          <div className="px-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Prompt Vault
            </p>

            <h2 className="mt-2 text-lg font-bold">
              Browse
            </h2>
          </div>

          <nav className="mt-4 space-y-1">
            <CategoryButton
              label="All Prompts"
              count={
                categoryCounts.All ??
                0
              }
              active={
                selectedCategory ===
                  "All" &&
                !favoritesOnly
              }
              onClick={() =>
                selectCategory(
                  "All"
                )
              }
            />

            <CategoryButton
              label="⭐ Favorites"
              count={
                favoriteCount
              }
              active={
                favoritesOnly
              }
              onClick={
                selectFavorites
              }
            />

            <div className="my-3 border-t border-zinc-800" />

            {categories
              .filter(
                (category) =>
                  category !==
                  "All"
              )
              .map(
                (category) => (
                  <CategoryButton
                    key={
                      category
                    }
                    label={
                      `${getCategoryIcon(
                        category
                      )} ${category}`
                    }
                    count={
                      categoryCounts[
                        category
                      ] ?? 0
                    }
                    active={
                      selectedCategory ===
                        category &&
                      !favoritesOnly
                    }
                    onClick={() =>
                      selectCategory(
                        category
                      )
                    }
                  />
                )
              )}
          </nav>

          <div className="mt-5 border-t border-zinc-800 pt-4">
            <Link
              href="/prompts/library/new"
              className="block w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-center text-sm font-semibold transition hover:bg-emerald-500"
            >
              + New Prompt
            </Link>
          </div>
        </aside>

        {/* MAIN CONTENT */}

        <main className="min-w-0">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                  Library
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  {favoritesOnly
                    ? "⭐ Favorites"
                    : selectedCategory ===
                        "All"
                      ? "All Prompts"
                      : selectedCategory}
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  {
                    filteredPrompts.length
                  }{" "}
                  prompt
                  {filteredPrompts.length ===
                  1
                    ? ""
                    : "s"}
                </p>
              </div>

              <input
                value={search}
                onChange={(
                  event
                ) =>
                  setSearch(
                    event.target
                      .value
                  )
                }
                placeholder="Search Prompt Vault..."
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-200 outline-none transition focus:border-emerald-500 lg:max-w-md"
              />
            </div>
          </div>

          <div className="mt-5">
            {loading ? (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-sm text-zinc-500">
                Loading Prompt Vault...
              </div>
            ) : filteredPrompts.length ===
              0 ? (
              <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900 p-10 text-center">
                <h3 className="font-semibold">
                  No prompts found
                </h3>

                <p className="mt-2 text-sm text-zinc-500">
                  Change the category,
                  search term, or add a
                  new prompt.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {filteredPrompts.map(
                  (item) => (
                    <PromptCard
                      key={
                        item.id
                      }
                      item={
                        item
                      }
                      onUse={() =>
                        handleUse(
                          item
                        )
                      }
                      onCopy={() =>
                        handleCopy(
                          item.prompt
                        )
                      }
                      onFavorite={() =>
                        handleFavorite(
                          item
                        )
                      }
                    />
                  )
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function PromptCard({
  item,
  onUse,
  onCopy,
  onFavorite,
}: {
  item: PromptLibraryRow;
  onUse: () => void;
  onCopy: () => void;
  onFavorite: () => void;
}) {
  return (
    <article className="flex min-w-0 flex-col rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-zinc-700">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <span className="rounded-full border border-zinc-700 px-2.5 py-1 text-[10px] uppercase tracking-wide text-zinc-500">
            {
              item.category
            }
          </span>

          <h3 className="mt-3 text-lg font-semibold">
            {
              item.title
            }
          </h3>
        </div>

        <button
          type="button"
          onClick={
            onFavorite
          }
          className="shrink-0 text-xl"
          title="Favorite"
        >
          {item.favorite
            ? "⭐"
            : "☆"}
        </button>
      </div>

      {item.description && (
        <p className="mt-3 text-sm leading-6 text-zinc-500">
          {
            item.description
          }
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {item.tags
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

        {item.tags.length >
          4 && (
          <span className="rounded-md bg-zinc-950 px-2 py-1 text-[11px] text-zinc-600">
            +
            {
              item.tags.length -
              4
            }
          </span>
        )}
      </div>

      <p className="mt-4 line-clamp-4 whitespace-pre-wrap text-xs leading-5 text-zinc-600">
        {item.prompt}
      </p>

      <div className="mt-auto pt-5">
        <p className="mb-4 text-xs text-zinc-600">
          Used{" "}
          {
            item.use_count
          }{" "}
          times
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={
              onUse
            }
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold transition hover:bg-emerald-500"
          >
            Use
          </button>

          <Link
            href={`/prompts/library/${item.id}`}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-emerald-500"
          >
            Open
          </Link>

          <button
            type="button"
            onClick={
              onCopy
            }
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300"
          >
            Copy
          </button>
        </div>
      </div>
    </article>
  );
}

function CategoryButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${
        active
          ? "bg-emerald-950/40 text-emerald-400"
          : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
      }`}
    >
      <span>
        {label}
      </span>

      <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-500">
        {count}
      </span>
    </button>
  );
}

function getCategoryIcon(
  category: string
) {
  const icons:
    Record<string, string> = {
      Script: "✍️",
      Research: "🔬",
      Storyboard: "🎬",
      Image: "🖼️",
      Video: "🎥",
      Character: "🎭",
      Thumbnail: "📸",
      Motivation: "💪",
      "Animal POV": "🐾",
      Children: "🧒",
      Sports: "⚽",
      "Google Flow": "🌊",
      "Viral Shorts": "🔥",
      General: "📄",
    };

  return (
    icons[category] ??
    "📄"
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