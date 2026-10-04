import AppShell from "@/components/layout/AppShell";

import ExploreGallery from "@/features/explore/components/ExploreGallery";

import {
  exploreItems,
} from "@/features/explore/data/exploreItems";

export default function ExplorePage() {
  const featured =
    exploreItems.filter(
      (item) =>
        item.featured
    );

  const trending =
    exploreItems.filter(
      (item) =>
        item.trending
    );

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900">
          <div className="relative px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

              <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
            </div>

            <div className="relative max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-400">
                AI Creator OS Explore
              </p>

              <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Discover formats worth
                creating.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400">
                Browse viral short-form
                formats, production
                styles, story structures,
                and reusable concepts.
                Find something you like,
                then turn the format into
                your own project.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Stat
                  label="Formats"
                  value={`${exploreItems.length}`}
                />

                <Stat
                  label="Featured"
                  value={`${featured.length}`}
                />

                <Stat
                  label="Trending"
                  value={`${trending.length}`}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <CategoryCard
            icon="🔥"
            title="Trending Now"
            description="Formats gaining the most attention."
          />

          <CategoryCard
            icon="🐾"
            title="Animal Videos"
            description="POV, transformations, ASMR, and stories."
          />

          <CategoryCard
            icon="🧠"
            title="Brainrot"
            description="Fast, absurd, highly shareable storytelling."
          />

          <CategoryCard
            icon="✨"
            title="Transformations"
            description="Before-and-after and evolution concepts."
          />
        </section>

        <ExploreGallery
          items={
            exploreItems
          }
        />
      </div>
    </AppShell>
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
    <div className="rounded-xl border border-zinc-700/80 bg-zinc-950/70 px-4 py-3 backdrop-blur">
      <p className="text-xl font-bold text-zinc-100">
        {value}
      </p>

      <p className="mt-1 text-xs uppercase tracking-wide text-zinc-500">
        {label}
      </p>
    </div>
  );
}

function CategoryCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="text-3xl">
        {icon}
      </div>

      <h2 className="mt-4 font-semibold text-zinc-100">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-zinc-500">
        {description}
      </p>
    </div>
  );
}