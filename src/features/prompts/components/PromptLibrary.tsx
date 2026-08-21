"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  getPromptLibrary,
  incrementPromptUse,
  togglePromptFavorite,
  type PromptLibraryRow,
} from "@/lib/supabase/promptLibrary";
import { vaultPrompts, type VaultPrompt } from "@/features/prompts/vault";

type UnifiedPrompt =
  | {
      source: "saved";
      id: string;
      title: string;
      description: string;
      category: string;
      stage: string;
      prompt: string;
      tags: string[];
      favorite: boolean;
      useCount: number;
      savedRow: PromptLibraryRow;
      vaultRow?: never;
    }
  | {
      source: "curated";
      id: string;
      title: string;
      description: string;
      category: string;
      stage: string;
      prompt: string;
      tags: string[];
      favorite: false;
      useCount: number;
      savedRow?: never;
      vaultRow: VaultPrompt;
    };

export default function PromptLibrary() {
  const [savedPrompts, setSavedPrompts] = useState<PromptLibraryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSource, setSelectedSource] = useState<
    "all" | "curated" | "saved"
  >("all");
  const [search, setSearch] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [preview, setPreview] = useState<UnifiedPrompt | null>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    void loadPrompts();
  }, []);

  async function loadPrompts() {
    setLoading(true);
    setError("");

    try {
      const data = await getPromptLibrary();
      setSavedPrompts(data);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load saved prompts."));
    } finally {
      setLoading(false);
    }
  }

  const unifiedPrompts = useMemo<UnifiedPrompt[]>(() => {
    const curated: UnifiedPrompt[] = vaultPrompts.map((item) => ({
      source: "curated",
      id: `curated:${item.id}`,
      title: item.title,
      description: item.description,
      category: item.niche,
      stage: item.stage,
      prompt: item.prompt,
      tags: [item.stage, ...item.tags],
      favorite: false,
      useCount: 0,
      vaultRow: item,
    }));

    const saved: UnifiedPrompt[] = savedPrompts.map((item) => ({
      source: "saved",
      id: `saved:${item.id}`,
      title: item.title,
      description: item.description ?? "",
      category: item.category,
      stage: item.category,
      prompt: item.prompt,
      tags: item.tags ?? [],
      favorite: item.favorite,
      useCount: item.use_count,
      savedRow: item,
    }));

    return [...curated, ...saved];
  }, [savedPrompts]);

  const categories = useMemo(() => {
    return Array.from(
      new Set(unifiedPrompts.map((prompt) => prompt.category).filter(Boolean)),
    ).sort((a, b) => a.localeCompare(b));
  }, [unifiedPrompts]);

  const filteredBySource = useMemo(() => {
    if (selectedSource === "all") {
      return unifiedPrompts;
    }

    return unifiedPrompts.filter((prompt) => prompt.source === selectedSource);
  }, [selectedSource, unifiedPrompts]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: filteredBySource.length,
    };

    for (const category of categories) {
      counts[category] = filteredBySource.filter(
        (prompt) => prompt.category === category,
      ).length;
    }

    return counts;
  }, [categories, filteredBySource]);

  const favoriteCount = useMemo(
    () => savedPrompts.filter((prompt) => prompt.favorite).length,
    [savedPrompts],
  );

  const filteredPrompts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return unifiedPrompts.filter((item) => {
      if (selectedSource !== "all" && item.source !== selectedSource) {
        return false;
      }

      if (selectedCategory !== "All" && item.category !== selectedCategory) {
        return false;
      }

      if (favoritesOnly && !item.favorite) {
        return false;
      }

      if (!query) {
        return true;
      }

      const searchable = [
        item.title,
        item.description,
        item.category,
        item.stage,
        item.source,
        item.prompt,
        ...item.tags,
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [unifiedPrompts, selectedCategory, selectedSource, favoritesOnly, search]);

  function selectSource(source: "all" | "curated" | "saved") {
    setSelectedSource(source);
    setSelectedCategory("All");
    setFavoritesOnly(false);
  }

  function selectCategory(category: string) {
    setSelectedCategory(category);
    setFavoritesOnly(false);
  }

  function selectFavorites() {
    setSelectedSource("saved");
    setSelectedCategory("All");
    setFavoritesOnly(true);
  }

  async function handleFavorite(item: UnifiedPrompt) {
    if (item.source !== "saved") {
      setStatus(
        "Curated prompts stay in the main vault. Copy one to customize it.",
      );
      return;
    }

    try {
      await togglePromptFavorite(item.savedRow.id, !item.favorite);

      setSavedPrompts((previous) =>
        previous.map((prompt) =>
          prompt.id === item.savedRow.id
            ? {
                ...prompt,
                favorite: !item.favorite,
              }
            : prompt,
        ),
      );
    } catch (err) {
      setError(getErrorMessage(err, "Failed to update favorite."));
    }
  }

  async function handleUse(item: UnifiedPrompt) {
    if (item.source === "curated") {
      await handleCopy(item.prompt);

      setStatus(
        "Curated prompt copied. Open Prompt Vault to continue working with it.",
      );

      return;
    }

    try {
      await incrementPromptUse(item.savedRow.id, item.savedRow.use_count);
    } catch {
      // Usage tracking should not block prompt use.
    }

    window.location.href = `/prompts/builder?libraryPromptId=${encodeURIComponent(
      item.savedRow.id,
    )}`;
  }

  async function handleCopy(prompt: string) {
    try {
      await navigator.clipboard.writeText(prompt);
      setStatus("Prompt copied.");
      setError("");
    } catch {
      setError("Unable to copy prompt.");
    }
  }

  return (
    <div className="space-y-6">
      {status && (
        <div className="flex items-center justify-between rounded-lg border border-emerald-800 bg-emerald-950/30 p-4 text-sm text-emerald-400">
          <span>{status}</span>

          <button
            type="button"
            onClick={() => setStatus("")}
            className="text-emerald-500 hover:text-white"
          >
            ×
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-between rounded-lg border border-red-700 bg-red-950/50 p-4 text-sm text-red-300">
          <span>{error}</span>

          <button type="button" onClick={() => setError("")}>
            ×
          </button>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[230px_minmax(0,1fr)]">
        <aside className="h-fit rounded-xl border border-zinc-800 bg-zinc-900 p-4 xl:sticky xl:top-6">
          <div className="px-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Unified Vault
            </p>

            <h2 className="mt-2 text-lg font-bold">Browse</h2>
          </div>

          <nav className="mt-4 space-y-1">
            <CategoryButton
              label="📚 All Prompts"
              count={unifiedPrompts.length}
              active={
                selectedSource === "all" &&
                selectedCategory === "All" &&
                !favoritesOnly
              }
              onClick={() => selectSource("all")}
            />

            <CategoryButton
              label="✨ Curated"
              count={vaultPrompts.length}
              active={
                selectedSource === "curated" &&
                selectedCategory === "All" &&
                !favoritesOnly
              }
              onClick={() => selectSource("curated")}
            />

            <CategoryButton
              label="💾 Saved"
              count={savedPrompts.length}
              active={
                selectedSource === "saved" &&
                selectedCategory === "All" &&
                !favoritesOnly
              }
              onClick={() => selectSource("saved")}
            />

            <CategoryButton
              label="⭐ Favorites"
              count={favoriteCount}
              active={favoritesOnly}
              onClick={selectFavorites}
            />

            <div className="my-3 border-t border-zinc-800" />

            <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
              Categories
            </p>

            {categories.map((category) => {
              const count = categoryCounts[category] ?? 0;

              if (count === 0) {
                return null;
              }

              return (
                <CategoryButton
                  key={category}
                  label={`${getCategoryIcon(category)} ${category}`}
                  count={count}
                  active={selectedCategory === category && !favoritesOnly}
                  onClick={() => selectCategory(category)}
                />
              );
            })}
          </nav>

          <div className="mt-5 space-y-2 border-t border-zinc-800 pt-4">
            <Link
              href="/prompts"
              className="block w-full rounded-lg border border-zinc-700 px-4 py-2.5 text-center text-sm font-semibold text-zinc-300 transition hover:border-emerald-500 hover:text-white"
            >
              Open Curated Vault
            </Link>

            <Link
              href="/prompts/library/new"
              className="block w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-center text-sm font-semibold transition hover:bg-emerald-500"
            >
              + New Saved Prompt
            </Link>
          </div>
        </aside>

        <main className="min-w-0">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                  Unified Library
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  {favoritesOnly
                    ? "⭐ Favorites"
                    : selectedCategory !== "All"
                      ? selectedCategory
                      : selectedSource === "curated"
                        ? "Curated Prompts"
                        : selectedSource === "saved"
                          ? "Saved Prompts"
                          : "All Prompts"}
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  {filteredPrompts.length} prompt
                  {filteredPrompts.length === 1 ? "" : "s"}
                </p>
              </div>

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search curated and saved prompts..."
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-200 outline-none transition focus:border-emerald-500 lg:max-w-md"
              />
            </div>
          </div>

          <div className="mt-5">
            {loading ? (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-sm text-zinc-500">
                Loading saved prompts...
              </div>
            ) : filteredPrompts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900 p-10 text-center">
                <h3 className="font-semibold">No prompts found</h3>

                <p className="mt-2 text-sm text-zinc-500">
                  Change the source, category, or search term.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSelectedSource("all");
                    setSelectedCategory("All");
                    setFavoritesOnly(false);
                  }}
                  className="mt-4 text-sm font-medium text-emerald-400"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {filteredPrompts.map((item) => (
                  <PromptCard
                    key={item.id}
                    item={item}
                    onPreview={() => setPreview(item)}
                    onUse={() => void handleUse(item)}
                    onCopy={() => void handleCopy(item.prompt)}
                    onFavorite={() => void handleFavorite(item)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {preview && (
        <PromptPreview
          item={preview}
          onClose={() => setPreview(null)}
          onCopy={() => void handleCopy(preview.prompt)}
        />
      )}
    </div>
  );
}

function PromptCard({
  item,
  onPreview,
  onUse,
  onCopy,
  onFavorite,
}: {
  item: UnifiedPrompt;
  onPreview: () => void;
  onUse: () => void;
  onCopy: () => void;
  onFavorite: () => void;
}) {
  return (
    <article className="flex min-w-0 flex-col rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-zinc-700">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <span
              className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                item.source === "curated"
                  ? "border-violet-500/30 bg-violet-500/10 text-violet-300"
                  : "border-blue-500/30 bg-blue-500/10 text-blue-300"
              }`}
            >
              {item.source}
            </span>

            <span className="rounded-full border border-zinc-700 px-2.5 py-1 text-[10px] uppercase tracking-wide text-zinc-500">
              {item.category}
            </span>
          </div>

          <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
        </div>

        {item.source === "saved" && (
          <button
            type="button"
            onClick={onFavorite}
            className="shrink-0 text-xl"
            title="Favorite"
          >
            {item.favorite ? "⭐" : "☆"}
          </button>
        )}
      </div>

      {item.description && (
        <p className="mt-3 text-sm leading-6 text-zinc-500">
          {item.description}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-md bg-zinc-950 px-2 py-1 text-[11px] text-emerald-500">
          {item.stage}
        </span>

        {item.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-zinc-950 px-2 py-1 text-[11px] text-zinc-500"
          >
            #{tag}
          </span>
        ))}
      </div>

      <p className="mt-4 line-clamp-4 whitespace-pre-wrap text-xs leading-5 text-zinc-600">
        {item.prompt}
      </p>

      <div className="mt-auto pt-5">
        {item.source === "saved" && (
          <p className="mb-4 text-xs text-zinc-600">
            Used {item.useCount} times
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onUse}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold transition hover:bg-emerald-500"
          >
            {item.source === "curated" ? "Copy & Use" : "Use"}
          </button>

          <button
            type="button"
            onClick={onPreview}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-emerald-500"
          >
            Preview
          </button>

          {item.source === "saved" && (
            <Link
              href={`/prompts/library/${item.savedRow.id}`}
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-emerald-500"
            >
              Edit
            </Link>
          )}

          <button
            type="button"
            onClick={onCopy}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300"
          >
            Copy
          </button>
        </div>
      </div>
    </article>
  );
}

function PromptPreview({
  item,
  onClose,
  onCopy,
}: {
  item: UnifiedPrompt;
  onClose: () => void;
  onCopy: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-950">
        <header className="flex items-start justify-between gap-5 border-b border-zinc-800 p-6">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                {item.category}
              </span>

              <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400">
                {item.source}
              </span>
            </div>

            <h2 className="mt-4 text-2xl font-bold">{item.title}</h2>

            <p className="mt-2 text-sm text-zinc-400">{item.description}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-800 px-3 py-2 text-zinc-400 hover:bg-zinc-800"
          >
            ×
          </button>
        </header>

        <div className="overflow-y-auto p-6">
          <pre className="whitespace-pre-wrap rounded-xl border border-zinc-800 bg-black p-5 font-mono text-sm leading-6 text-zinc-300">
            {item.prompt}
          </pre>
        </div>

        <footer className="flex justify-end border-t border-zinc-800 p-5">
          <button
            type="button"
            onClick={onCopy}
            className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold hover:bg-emerald-500"
          >
            Copy full prompt
          </button>
        </footer>
      </section>
    </div>
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
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${
        active
          ? "bg-emerald-950/40 text-emerald-400"
          : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
      }`}
    >
      <span>{label}</span>

      <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-500">
        {count}
      </span>
    </button>
  );
}

function getCategoryIcon(category: string) {
  const icons: Record<string, string> = {
    Script: "✍️",
    Research: "🔬",
    Storyboard: "🎬",
    Image: "🖼️",
    Images: "🖼️",
    Video: "🎥",
    Motion: "🎥",
    Character: "🎭",
    Characters: "🎭",
    Thumbnail: "📸",
    Motivation: "💪",
    "Self-Improvement": "💪",
    "Animal POV": "🐾",
    Children: "🧒",
    "Beginner English": "📖",
    Sports: "⚽",
    "2D Football": "⚽",
    "AI Toys": "🤖",
    "Google Flow": "🌊",
    "Viral Shorts": "🔥",
    General: "📄",
  };

  return icons[category] ?? "📄";
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const value = error as Record<string, unknown>;

    if (typeof value.message === "string") {
      return value.message;
    }
  }

  return fallback;
}
