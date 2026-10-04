"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import ExploreCard from "./ExploreCard";

import ExploreFilters from "./ExploreFilters";

import type {
  ExploreFilters as ExploreFiltersState,
  ExploreItem,
} from "../types";

import {
  getRecentExploreIds,
  getSavedExploreIds,
  subscribeExploreLibrary,
  toggleSavedExplore,
} from "../utils/exploreLibrary";

interface Props {
  items: ExploreItem[];
}

type ExploreTab =
  | "All"
  | "Saved"
  | "Recent"
  | "Trending"
  | "New";

const initialFilters: ExploreFiltersState =
  {
    search:
      "",

    category:
      "All",

    platform:
      "All",

    sort:
      "Trending",
  };

const tabs: ExploreTab[] =
  [
    "All",
    "Saved",
    "Recent",
    "Trending",
    "New",
  ];

export default function ExploreGallery({
  items,
}: Props) {
  const [
    filters,
    setFilters,
  ] =
    useState<ExploreFiltersState>(
      initialFilters
    );

  const [
    activeTab,
    setActiveTab,
  ] =
    useState<ExploreTab>(
      "All"
    );

  const [
    savedIds,
    setSavedIds,
  ] =
    useState<string[]>(
      []
    );

  const [
    recentIds,
    setRecentIds,
  ] =
    useState<string[]>(
      []
    );

  useEffect(() => {
    function refreshLibrary() {
      setSavedIds(
        getSavedExploreIds()
      );

      setRecentIds(
        getRecentExploreIds()
      );
    }

    refreshLibrary();

    return subscribeExploreLibrary(
      refreshLibrary
    );
  }, []);

  const filteredItems =
    useMemo(() => {
      const search =
        filters.search
          .trim()
          .toLowerCase();

      let result =
        items.filter(
          (item) => {
            /*
             * First apply the
             * personal Explore tab.
             */
            const matchesTab =
              matchTab({
                item,
                activeTab,
                savedIds,
                recentIds,
              });

            if (
              !matchesTab
            ) {
              return false;
            }

            /*
             * Then apply the normal
             * search/category/platform
             * filters.
             */
            const matchesSearch =
              !search ||
              [
                item.title,
                item.description,
                item.category,
                item.style,
                item.trendFormatId,
                ...item.tags,
                ...item.platforms,
              ]
                .join(" ")
                .toLowerCase()
                .includes(
                  search
                );

            const matchesCategory =
              filters.category ===
                "All" ||
              item.category ===
                filters.category;

            const matchesPlatform =
              filters.platform ===
                "All" ||
              item.platforms.includes(
                filters.platform
              );

            return (
              matchesSearch &&
              matchesCategory &&
              matchesPlatform
            );
          }
        );

      /*
       * Recent needs its own order:
       * newest remix first.
       */
      if (
        activeTab ===
        "Recent"
      ) {
        result = [
          ...result,
        ].sort(
          (
            a,
            b
          ) =>
            recentIds.indexOf(
              a.id
            ) -
            recentIds.indexOf(
              b.id
            )
        );

        return result;
      }

      return [
        ...result,
      ].sort(
        (
          a,
          b
        ) => {
          switch (
            filters.sort
          ) {
            case "Newest":
              return (
                Number(
                  Boolean(
                    b.new
                  )
                ) -
                Number(
                  Boolean(
                    a.new
                  )
                )
              );

            case "Popular":
              return (
                (b.views ??
                  0) -
                (a.views ??
                  0)
              );

            case "Trending":
            default: {
              const trendingDifference =
                Number(
                  Boolean(
                    b.trending
                  )
                ) -
                Number(
                  Boolean(
                    a.trending
                  )
                );

              if (
                trendingDifference !==
                0
              ) {
                return trendingDifference;
              }

              return (
                (b.views ??
                  0) -
                (a.views ??
                  0)
              );
            }
          }
        }
      );
    }, [
      activeTab,
      filters,
      items,
      recentIds,
      savedIds,
    ]);

  function clearFilters() {
    setFilters(
      initialFilters
    );
  }

  function handleToggleSave(
    id: string
  ) {
    toggleSavedExplore(
      id
    );
  }

  return (
    <div className="space-y-7">
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-2">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map(
            (tab) => {
              const active =
                activeTab ===
                tab;

              return (
                <button
                  key={
                    tab
                  }
                  type="button"
                  onClick={() =>
                    setActiveTab(
                      tab
                    )
                  }
                  className={
                    active
                      ? "shrink-0 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white"
                      : "shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                  }
                >
                  <span>
                    {getTabIcon(
                      tab
                    )}
                  </span>

                  <span className="ml-2">
                    {
                      tab
                    }
                  </span>

                  {tab ===
                    "Saved" && (
                    <CountBadge
                      value={
                        savedIds.length
                      }
                    />
                  )}

                  {tab ===
                    "Recent" && (
                    <CountBadge
                      value={
                        recentIds.length
                      }
                    />
                  )}
                </button>
              );
            }
          )}
        </div>
      </section>

      <ExploreFilters
        filters={
          filters
        }
        onChange={
          setFilters
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-zinc-100">
              {getTabTitle(
                activeTab
              )}
            </h2>

            <span className="rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-500">
              {
                filteredItems.length
              }
            </span>
          </div>

          <p className="mt-1 text-sm text-zinc-500">
            {getTabDescription(
              activeTab
            )}
          </p>
        </div>

        {(filters.search ||
          filters.category !==
            "All" ||
          filters.platform !==
            "All") && (
          <button
            type="button"
            onClick={
              clearFilters
            }
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800"
          >
            Clear Filters
          </button>
        )}
      </div>

      {filteredItems.length >
      0 ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredItems.map(
            (item) => {
              const saved =
                savedIds.includes(
                  item.id
                );

              return (
                <div
                  key={
                    item.id
                  }
                  className="relative"
                >
                  <button
                    type="button"
                    onClick={() =>
                      handleToggleSave(
                        item.id
                      )
                    }
                    aria-label={
                      saved
                        ? `Remove ${item.title} from saved formats`
                        : `Save ${item.title}`
                    }
                    title={
                      saved
                        ? "Remove from Saved"
                        : "Save Format"
                    }
                    className={
                      saved
                        ? "absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-500 text-lg text-white shadow-lg transition hover:scale-105"
                        : "absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/70 text-lg text-zinc-200 shadow-lg backdrop-blur transition hover:scale-105 hover:bg-zinc-800"
                    }
                  >
                    {saved
                      ? "★"
                      : "☆"}
                  </button>

                  <ExploreCard
                    item={
                      item
                    }
                  />
                </div>
              );
            }
          )}
        </div>
      ) : (
        <EmptyState
          activeTab={
            activeTab
          }
          clearFilters={
            clearFilters
          }
          resetTab={() =>
            setActiveTab(
              "All"
            )
          }
        />
      )}
    </div>
  );
}

function matchTab({
  item,
  activeTab,
  savedIds,
  recentIds,
}: {
  item: ExploreItem;

  activeTab: ExploreTab;

  savedIds: string[];

  recentIds: string[];
}) {
  switch (
    activeTab
  ) {
    case "Saved":
      return savedIds.includes(
        item.id
      );

    case "Recent":
      return recentIds.includes(
        item.id
      );

    case "Trending":
      return Boolean(
        item.trending
      );

    case "New":
      return Boolean(
        item.new
      );

    case "All":
    default:
      return true;
  }
}

function CountBadge({
  value,
}: {
  value: number;
}) {
  if (
    value <=
    0
  ) {
    return null;
  }

  return (
    <span className="ml-2 rounded-full bg-black/20 px-2 py-0.5 text-[10px] font-bold">
      {
        value
      }
    </span>
  );
}

function getTabIcon(
  tab: ExploreTab
) {
  switch (
    tab
  ) {
    case "Saved":
      return "★";

    case "Recent":
      return "↻";

    case "Trending":
      return "🔥";

    case "New":
      return "✨";

    case "All":
    default:
      return "▦";
  }
}

function getTabTitle(
  tab: ExploreTab
) {
  switch (
    tab
  ) {
    case "Saved":
      return "Saved Formats";

    case "Recent":
      return "Recently Used";

    case "Trending":
      return "Trending Formats";

    case "New":
      return "New Formats";

    case "All":
    default:
      return "Explore Formats";
  }
}

function getTabDescription(
  tab: ExploreTab
) {
  switch (
    tab
  ) {
    case "Saved":
      return "Formats you saved for future projects.";

    case "Recent":
      return "Formats you recently used to create remix projects.";

    case "Trending":
      return "Explore formats currently marked as trending.";

    case "New":
      return "Newly added formats and production ideas.";

    case "All":
    default:
      return "Browse all available Explore formats.";
  }
}

function EmptyState({
  activeTab,
  clearFilters,
  resetTab,
}: {
  activeTab: ExploreTab;

  clearFilters:
    () => void;

  resetTab:
    () => void;
}) {
  const saved =
    activeTab ===
    "Saved";

  const recent =
    activeTab ===
    "Recent";

  return (
    <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/50 px-6 py-16 text-center">
      <div className="text-4xl">
        {saved
          ? "☆"
          : recent
            ? "↻"
            : "🔎"}
      </div>

      <h3 className="mt-4 text-lg font-semibold text-zinc-200">
        {saved
          ? "No saved formats yet"
          : recent
            ? "No recently used formats"
            : "No formats found"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
        {saved
          ? "Tap the star on any Explore card to save it here."
          : recent
            ? "Create a Remix Project and that format will automatically appear here."
            : "Try changing your search, category, platform, or Explore tab."}
      </p>

      <div className="mt-5 flex flex-wrap justify-center gap-3">
        {!saved &&
          !recent && (
            <button
              type="button"
              onClick={
                clearFilters
              }
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800"
            >
              Reset Filters
            </button>
          )}

        {activeTab !==
          "All" && (
          <button
            type="button"
            onClick={
              resetTab
            }
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            Browse All Formats
          </button>
        )}
      </div>
    </div>
  );
}