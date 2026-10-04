"use client";

import Link from "next/link";

import type {
  ExploreItem,
} from "../types";

import StartExploreProjectButton from "./StartExploreProjectButton";

interface Props {
  item: ExploreItem;
}

export default function ExploreCard({
  item,
}: Props) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 transition hover:-translate-y-1 hover:border-zinc-700 hover:shadow-2xl hover:shadow-black/30">
      <Preview
        item={
          item
        }
      />

      <div className="p-5">
        <div className="flex flex-wrap gap-2">
          {item.trending && (
            <Badge>
              🔥 Trending
            </Badge>
          )}

          {item.new && (
            <Badge>
              ✨ New
            </Badge>
          )}

          {item.featured && (
            <Badge>
              ⭐ Featured
            </Badge>
          )}
        </div>

        <h3 className="mt-4 text-lg font-bold text-zinc-100">
          {
            item.title
          }
        </h3>

        <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-400">
          {
            item.description
          }
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Meta
            label="Format"
            value={
              item.category
            }
          />

          <Meta
            label="Duration"
            value={
              item.duration
            }
          />

          <Meta
            label="Style"
            value={
              item.style
            }
          />

          <Meta
            label="Platforms"
            value={`${item.platforms.length}`}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags
            .slice(
              0,
              4
            )
            .map(
              (tag) => (
                <span
                  key={
                    tag
                  }
                  className="rounded-full bg-zinc-800 px-2.5 py-1 text-[11px] text-zinc-400"
                >
                  #
                  {
                    tag
                  }
                </span>
              )
            )}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-zinc-800 pt-4">
          <div className="flex gap-4 text-xs text-zinc-500">
            {typeof item.views ===
              "number" && (
              <span>
                👁{" "}
                {formatCount(
                  item.views
                )}
              </span>
            )}

            {typeof item.likes ===
              "number" && (
              <span>
                ♥{" "}
                {formatCount(
                  item.likes
                )}
              </span>
            )}
          </div>

          <span className="text-xs font-medium text-zinc-500">
            {
              item.duration
            }
          </span>
        </div>

        <div className="mt-5 space-y-3">
          <StartExploreProjectButton
            item={
              item
            }
            compact
          />

          <div className="grid grid-cols-2 gap-3">
            <Link
              href={`/explore/${item.id}`}
              className="rounded-lg border border-zinc-700 px-4 py-2.5 text-center text-sm font-semibold text-zinc-200 transition hover:bg-zinc-800"
            >
              View Details
            </Link>

            <Link
              href={`/trends/${item.trendFormatId}`}
              className="rounded-lg border border-zinc-700 px-4 py-2.5 text-center text-sm font-semibold text-zinc-200 transition hover:bg-zinc-800"
            >
              Trend Format
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function Preview({
  item,
}: {
  item: ExploreItem;
}) {
  if (
    item.thumbnailUrl
  ) {
    return (
      <Link
        href={`/explore/${item.id}`}
        className="relative block aspect-9/12 overflow-hidden bg-zinc-950"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={
            item.thumbnailUrl
          }
          alt={
            item.title
          }
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <PreviewOverlay
          item={
            item
          }
        />
      </Link>
    );
  }

  return (
    <Link
      href={`/explore/${item.id}`}
      className="relative flex aspect-9/12 items-center justify-center overflow-hidden bg-linear-to-br from-zinc-950 via-zinc-900 to-zinc-800"
    >
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-emerald-500 blur-3xl" />

        <div className="absolute -right-10 bottom-10 h-40 w-40 rounded-full bg-violet-500 blur-3xl" />
      </div>

      <div className="relative px-8 text-center">
        <div className="text-5xl">
          {getCategoryIcon(
            item.category
          )}
        </div>

        <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
          {
            item.category
          }
        </p>

        <p className="mt-2 text-xl font-bold text-white">
          {
            item.title
          }
        </p>
      </div>

      <PreviewOverlay
        item={
          item
        }
      />
    </Link>
  );
}

function PreviewOverlay({
  item,
}: {
  item: ExploreItem;
}) {
  return (
    <>
      <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
        {
          item.duration
        }
      </div>

      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <span className="rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-xs text-zinc-200 backdrop-blur">
          {
            item.style
          }
        </span>

        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm text-black shadow-lg transition group-hover:scale-110">
          ▶
        </span>
      </div>
    </>
  );
}

function Badge({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <span className="rounded-full border border-zinc-700 bg-zinc-950 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-300">
      {
        children
      }
    </span>
  );
}

function Meta({
  label,
  value,
}: {
  label: string;

  value: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5">
      <p className="text-[9px] uppercase tracking-[0.14em] text-zinc-600">
        {
          label
        }
      </p>

      <p className="mt-1 truncate text-xs font-medium text-zinc-300">
        {
          value
        }
      </p>
    </div>
  );
}

function formatCount(
  value: number
) {
  if (
    value >=
    1_000_000
  ) {
    return `${(
      value /
      1_000_000
    ).toFixed(
      1
    )}M`;
  }

  if (
    value >=
    1_000
  ) {
    return `${(
      value /
      1_000
    ).toFixed(
      1
    )}K`;
  }

  return `${value}`;
}

function getCategoryIcon(
  category: string
) {
  switch (
    category
  ) {
    case "Brainrot":
      return "🧠";

    case "Animals":
      return "🐾";

    case "Stories":
      return "🎭";

    case "Science":
      return "🧪";

    case "Transformations":
      return "✨";

    case "Fitness":
      return "💪";

    case "Cars":
      return "🏎️";

    case "Factory":
      return "🏭";

    case "Motivation":
      return "🔥";

    case "Educational":
      return "💡";

    default:
      return "🎬";
  }
}