"use client";

import type {
  ExploreCategory,
  ExploreFilters as ExploreFiltersState,
  ExplorePlatform,
} from "../types";

interface Props {
  filters: ExploreFiltersState;

  onChange: (
    next: ExploreFiltersState
  ) => void;
}

const categories: (
  | ExploreCategory
  | "All"
)[] = [
  "All",
  "Brainrot",
  "Animals",
  "Stories",
  "Science",
  "Transformations",
  "Fitness",
  "Cars",
  "Factory",
  "Motivation",
  "Educational",
];

const platforms: (
  | ExplorePlatform
  | "All"
)[] = [
  "All",
  "TikTok",
  "YouTube Shorts",
  "Instagram Reels",
];

export default function ExploreFilters({
  filters,
  onChange,
}: Props) {
  return (
    <div className="space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px]">
        <div>
          <label
            htmlFor="explore-search"
            className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500"
          >
            Search
          </label>

          <input
            id="explore-search"
            type="text"
            value={
              filters.search
            }
            onChange={(
              event
            ) =>
              onChange({
                ...filters,

                search:
                  event
                    .target
                    .value,
              })
            }
            placeholder="Search formats, niches, styles, tags..."
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-emerald-600"
          />
        </div>

        <div>
          <label
            htmlFor="explore-platform"
            className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500"
          >
            Platform
          </label>

          <select
            id="explore-platform"
            value={
              filters.platform
            }
            onChange={(
              event
            ) =>
              onChange({
                ...filters,

                platform:
                  event
                    .target
                    .value as
                    | ExplorePlatform
                    | "All",
              })
            }
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-200 outline-none transition focus:border-emerald-600"
          >
            {platforms.map(
              (
                platform
              ) => (
                <option
                  key={
                    platform
                  }
                  value={
                    platform
                  }
                >
                  {platform}
                </option>
              )
            )}
          </select>
        </div>

        <div>
          <label
            htmlFor="explore-sort"
            className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500"
          >
            Sort
          </label>

          <select
            id="explore-sort"
            value={
              filters.sort
            }
            onChange={(
              event
            ) =>
              onChange({
                ...filters,

                sort:
                  event
                    .target
                    .value as ExploreFiltersState["sort"],
              })
            }
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-200 outline-none transition focus:border-emerald-600"
          >
            <option value="Trending">
              Trending
            </option>

            <option value="Newest">
              Newest
            </option>

            <option value="Popular">
              Popular
            </option>
          </select>
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
          Categories
        </p>

        <div className="flex flex-wrap gap-2">
          {categories.map(
            (
              category
            ) => {
              const active =
                filters.category ===
                category;

              return (
                <button
                  key={
                    category
                  }
                  type="button"
                  onClick={() =>
                    onChange({
                      ...filters,

                      category,
                    })
                  }
                  className={
                    active
                      ? "rounded-full border border-emerald-500 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-300"
                      : "rounded-full border border-zinc-700 bg-zinc-950 px-4 py-2 text-xs font-semibold text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-200"
                  }
                >
                  {category}
                </button>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}