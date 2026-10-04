import Link from "next/link";

import {
  notFound,
} from "next/navigation";

import AppShell from "@/components/layout/AppShell";

import StartExploreProjectButton from "@/features/explore/components/StartExploreProjectButton";

import {
  exploreItems,
} from "@/features/explore/data/exploreItems";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ExploreDetailPage({
  params,
}: Props) {
  const { id } =
    await params;

  const item =
    exploreItems.find(
      (entry) =>
        entry.id ===
        id
    );

  if (!item) {
    notFound();
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <Link
            href="/explore"
            className="text-sm font-medium text-zinc-500 transition hover:text-zinc-200"
          >
            ← Back to Explore
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <main className="space-y-6">
            <Preview
              title={
                item.title
              }
              category={
                item.category
              }
              style={
                item.style
              }
              thumbnailUrl={
                item.thumbnailUrl
              }
            />

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <div className="flex flex-wrap gap-2">
                {item.trending && (
                  <Badge>
                    🔥 Trending
                  </Badge>
                )}

                {item.featured && (
                  <Badge>
                    ⭐ Featured
                  </Badge>
                )}

                {item.new && (
                  <Badge>
                    ✨ New
                  </Badge>
                )}
              </div>

              <h1 className="mt-5 text-3xl font-bold text-white">
                {
                  item.title
                }
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-400">
                {
                  item.description
                }
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Info
                  label="Category"
                  value={
                    item.category
                  }
                />

                <Info
                  label="Duration"
                  value={
                    item.duration
                  }
                />

                <Info
                  label="Style"
                  value={
                    item.style
                  }
                />

                <Info
                  label="Format ID"
                  value={
                    item.trendFormatId
                  }
                />
              </div>
            </section>

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                Production Concept
              </p>

              <h2 className="mt-2 text-xl font-bold">
                Format Prompt
              </h2>

              <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-300">
                  {item.prompt ??
                    "No format prompt has been added yet."}
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Platforms
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {item.platforms.map(
                  (
                    platform
                  ) => (
                    <span
                      key={
                        platform
                      }
                      className="rounded-full border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm text-zinc-300"
                    >
                      {
                        platform
                      }
                    </span>
                  )
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Tags
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {item.tags.map(
                  (tag) => (
                    <span
                      key={
                        tag
                      }
                      className="rounded-full bg-zinc-800 px-3 py-1.5 text-sm text-zinc-400"
                    >
                      #
                      {
                        tag
                      }
                    </span>
                  )
                )}
              </div>
            </section>
          </main>

          <aside className="space-y-5">
            <div className="sticky top-6 space-y-5">
              <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                  Create Your Version
                </p>

                <h2 className="mt-2 text-xl font-bold">
                  Use this format
                </h2>

                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Create a new AI Creator OS project using this Explore format as the production starting point.
                </p>

                <div className="mt-5">
                  <StartExploreProjectButton
                    item={
                      item
                    }
                  />
                </div>

                <Link
                  href={`/trends/${item.trendFormatId}`}
                  className="mt-3 block w-full rounded-xl border border-zinc-700 px-5 py-3 text-center text-sm font-semibold text-zinc-200 transition hover:bg-zinc-800"
                >
                  View Trend Format
                </Link>
              </section>

              <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <h3 className="font-semibold text-zinc-200">
                  Format Stats
                </h3>

                <div className="mt-4 space-y-3">
                  <Stat
                    label="Views"
                    value={
                      formatCount(
                        item.views ??
                          0
                      )
                    }
                  />

                  <Stat
                    label="Likes"
                    value={
                      formatCount(
                        item.likes ??
                          0
                      )
                    }
                  />

                  <Stat
                    label="Duration"
                    value={
                      item.duration
                    }
                  />

                  <Stat
                    label="Style"
                    value={
                      item.style
                    }
                  />
                </div>
              </section>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

function Preview({
  title,
  category,
  style,
  thumbnailUrl,
}: {
  title: string;
  category: string;
  style: string;
  thumbnailUrl?: string;
}) {
  if (
    thumbnailUrl
  ) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={
            thumbnailUrl
          }
          alt={
            title
          }
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-zinc-800 bg-linear-to-br from-zinc-950 via-zinc-900 to-zinc-800">
      <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative max-w-xl px-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-400">
          {
            category
          }
        </p>

        <h2 className="mt-4 text-4xl font-bold text-white">
          {
            title
          }
        </h2>

        <p className="mt-4 text-zinc-400">
          {
            style
          }
        </p>

        <div className="mx-auto mt-6 flex h-16 w-16 items-center justify-center rounded-full bg-white text-xl text-black shadow-2xl">
          ▶
        </div>
      </div>
    </div>
  );
}

function Badge({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <span className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-zinc-300">
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
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
      <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-600">
        {
          label
        }
      </p>

      <p className="mt-2 text-sm font-medium text-zinc-300">
        {
          value
        }
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-800 pb-3 last:border-b-0 last:pb-0">
      <span className="text-sm text-zinc-500">
        {
          label
        }
      </span>

      <span className="text-sm font-semibold text-zinc-200">
        {
          value
        }
      </span>
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