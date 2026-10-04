import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Car,
  Dumbbell,
  History,
  MessageCircle,
  PawPrint,
  Search,
  Sparkles,
  Utensils,
  WandSparkles,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import { TREND_REGISTRY } from "@/features/trends/registry";
import type {
  TrendCategory,
  TrendTemplate,
} from "@/features/trends/types";

/*
 * =========================================================
 * AI CREATOR OS — TRENDS PAGE
 * =========================================================
 *
 * Registry-driven Trends browser.
 *
 * Data source:
 * src/features/trends/registry.ts
 */


/*
 * =========================================================
 * CATEGORY LABELS
 * =========================================================
 */

function getCategoryLabel(
  category: TrendCategory
): string {
  const labels: Partial<
    Record<TrendCategory, string>
  > = {
    story: "Story",
    food: "Food",
    comedy: "Comedy",
    brainrot: "Brainrot",
    education: "Education",
    fitness: "Fitness",
    automotive: "Automotive",
    restoration: "Restoration",
    evolution: "Evolution",
    animal: "Animal",
    pov: "POV",
    sports: "Sports",
    motivation: "Motivation",
    transformation: "Transformation",
    explainer: "Explainer",
    cinematic: "Cinematic",
    anime: "Anime",
    custom: "Custom",
  };

  return labels[category] ?? category;
}


/*
 * =========================================================
 * TREND ICON
 * =========================================================
 */

function TrendIcon({
  trend,
}: {
  trend: TrendTemplate;
}) {
  const className = "h-7 w-7";

  switch (trend.id) {
    case "food-story":
      return (
        <Utensils className={className} />
      );

    case "brainrot-story":
      return <Brain className={className} />;

    case "street-cartoon-story":
      return (
        <MessageCircle
          className={className}
        />
      );

    case "talking-objects":
      return (
        <MessageCircle
          className={className}
        />
      );

    case "skeleton-shorts":
      return (
        <BookOpen className={className} />
      );

    case "anatomy-fitness":
      return (
        <Dumbbell className={className} />
      );

    case "weirdcore-story":
      return (
        <WandSparkles
          className={className}
        />
      );

    case "animal-micro-camera":
      return (
        <PawPrint className={className} />
      );

    case "reddit-story":
      return (
        <MessageCircle
          className={className}
        />
      );

    case "restoration-timelapse":
      return (
        <WandSparkles
          className={className}
        />
      );

    case "car-evolution":
      return <Car className={className} />;

    case "history-shorts":
      return (
        <History className={className} />
      );

    default:
      return (
        <Sparkles className={className} />
      );
  }
}


/*
 * =========================================================
 * FORMAT HELPERS
 * =========================================================
 */

function getDurationRange(
  trend: TrendTemplate
): string {
  if (!trend.durations.length) {
    return `${trend.defaultDurationSeconds}s`;
  }

  const durations = trend.durations
    .map((duration) => duration.totalSeconds)
    .sort((a, b) => a - b);

  const minimum = durations[0];

  const maximum =
    durations[durations.length - 1];

  if (minimum === maximum) {
    return `${minimum}s`;
  }

  return `${minimum}–${maximum}s`;
}

function getSceneRange(
  trend: TrendTemplate
): string {
  const sceneCounts = trend.durations
    .map((duration) => duration.sceneCount)
    .filter(
      (value): value is number =>
        typeof value === "number"
    )
    .sort((a, b) => a - b);

  if (!sceneCounts.length) {
    return "Dynamic";
  }

  const minimum = sceneCounts[0];

  const maximum =
    sceneCounts[sceneCounts.length - 1];

  if (minimum === maximum) {
    return `${minimum}`;
  }

  return `${minimum}–${maximum}`;
}

function getAudioLabel(
  trend: TrendTemplate
): string {
  switch (trend.defaultAudioMode) {
    case "native-audio":
      return "Native Audio";

    case "voice-over":
      return "Voice Over";

    case "none":
      return "Visual / Music";

    default:
      return trend.defaultAudioMode;
  }
}


/*
 * =========================================================
 * TREND CARD
 * =========================================================
 */

function TrendCard({
  trend,
}: {
  trend: TrendTemplate;
}) {
  return (
    <Link
      href={`/trends/${trend.id}`}
      className="group block"
    >
      <article
        className="
          flex h-full flex-col
          overflow-hidden
          rounded-2xl
          border border-zinc-800
          bg-zinc-950
          transition
          duration-200
          hover:-translate-y-1
          hover:border-emerald-500/60
          hover:shadow-xl
          hover:shadow-emerald-950/20
        "
      >
        {/* Visual header */}

        <div
          className="
            relative
            flex min-h-44
            items-center
            justify-center
            overflow-hidden
            border-b border-zinc-800
            bg-linear-to-br
            from-zinc-900
            via-zinc-950
            to-black
          "
        >
          <div
            className="
              absolute
              inset-0
              opacity-40
              bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.14),transparent_60%)]
            "
          />

          <div
            className="
              relative
              flex h-16 w-16
              items-center
              justify-center
              rounded-2xl
              border border-emerald-500/20
              bg-emerald-500/10
              text-emerald-400
              transition
              group-hover:scale-110
              group-hover:border-emerald-400/40
            "
          >
            <TrendIcon trend={trend} />
          </div>

          <div
            className="
              absolute
              left-4
              top-4
              rounded-full
              border border-zinc-700
              bg-black/60
              px-3 py-1
              text-xs
              font-medium
              text-zinc-300
              backdrop-blur
            "
          >
            {getCategoryLabel(
              trend.category
            )}
          </div>

          <div
            className="
              absolute
              bottom-4
              right-4
              rounded-full
              border border-zinc-700
              bg-black/60
              px-3 py-1
              text-xs
              text-zinc-300
              backdrop-blur
            "
          >
            {trend.defaultAspectRatio}
          </div>
        </div>

        {/* Content */}

        <div className="flex flex-1 flex-col p-5">
          <div>
            <h2
              className="
                text-lg
                font-semibold
                text-white
                transition
                group-hover:text-emerald-400
              "
            >
              {trend.name}
            </h2>

            <p
              className="
                mt-2
                line-clamp-3
                text-sm
                leading-6
                text-zinc-400
              "
            >
              {trend.description}
            </p>
          </div>

          {/* Production details */}

          <div
            className="
              mt-5
              grid grid-cols-3
              gap-2
            "
          >
            <TrendMetric
              label="Duration"
              value={getDurationRange(
                trend
              )}
            />

            <TrendMetric
              label="Scenes"
              value={getSceneRange(trend)}
            />

            <TrendMetric
              label="Audio"
              value={getAudioLabel(trend)}
            />
          </div>

          {/* Tags */}

          {trend.tags &&
            trend.tags.length > 0 && (
              <div
                className="
                  mt-4
                  flex
                  flex-wrap
                  gap-2
                "
              >
                {trend.tags
                  .slice(0, 3)
                  .map((tag) => (
                    <span
                      key={tag}
                      className="
                        rounded-full
                        bg-zinc-900
                        px-2.5 py-1
                        text-[11px]
                        text-zinc-500
                      "
                    >
                      #{tag}
                    </span>
                  ))}
              </div>
            )}

          {/* CTA */}

          <div
            className="
              mt-auto
              flex
              items-center
              justify-between
              border-t
              border-zinc-800
              pt-5
            "
          >
            <span
              className="
                text-sm
                font-medium
                text-zinc-300
              "
            >
              Build this format
            </span>

            <ArrowRight
              className="
                h-4 w-4
                text-zinc-500
                transition
                group-hover:translate-x-1
                group-hover:text-emerald-400
              "
            />
          </div>
        </div>
      </article>
    </Link>
  );
}


/*
 * =========================================================
 * METRIC
 * =========================================================
 */

function TrendMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        rounded-xl
        border border-zinc-800
        bg-zinc-900/60
        px-3 py-2.5
      "
    >
      <div
        className="
          text-[10px]
          uppercase
          tracking-wide
          text-zinc-600
        "
      >
        {label}
      </div>

      <div
        className="
          mt-1
          truncate
          text-xs
          font-medium
          text-zinc-300
        "
      >
        {value}
      </div>
    </div>
  );
}


/*
 * =========================================================
 * PAGE
 * =========================================================
 */

export default function TrendsPage() {
  const trends = TREND_REGISTRY;

  const categories = Array.from(
    new Set(
      trends.map(
        (trend) => trend.category
      )
    )
  );

  return (
    <AppShell>
      <main
        className="
          min-h-screen
          bg-black
          px-6
          py-8
          text-white
          lg:px-10
        "
      >
        <div
          className="
            mx-auto
            max-w-7xl
          "
        >
          {/* Header */}

          <section
            className="
              flex
              flex-col
              gap-6
              lg:flex-row
              lg:items-end
              lg:justify-between
            "
          >
            <div>
              <div
                className="
                  mb-3
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border border-emerald-500/20
                  bg-emerald-500/10
                  px-3 py-1.5
                  text-xs
                  font-medium
                  text-emerald-400
                "
              >
                <Sparkles className="h-3.5 w-3.5" />

                AI Creator OS Trends
              </div>

              <h1
                className="
                  text-3xl
                  font-bold
                  tracking-tight
                  sm:text-4xl
                "
              >
                Viral Production Formats
              </h1>

              <p
                className="
                  mt-3
                  max-w-2xl
                  text-sm
                  leading-6
                  text-zinc-400
                  sm:text-base
                "
              >
                Start with a reusable
                production format, customize
                the idea, and move directly
                into your AI video workflow.
              </p>
            </div>

            {/* Search shell */}

            <div
              className="
                flex
                w-full
                max-w-md
                items-center
                gap-3
                rounded-xl
                border border-zinc-800
                bg-zinc-950
                px-4 py-3
              "
            >
              <Search
                className="
                  h-4 w-4
                  shrink-0
                  text-zinc-600
                "
              />

              <span
                className="
                  text-sm
                  text-zinc-600
                "
              >
                Search and filters coming next
              </span>
            </div>
          </section>

          {/* Stats */}

          <section
            className="
              mt-8
              grid
              grid-cols-2
              gap-3
              sm:grid-cols-4
            "
          >
            <HeaderStat
              label="Formats"
              value={String(
                trends.length
              )}
            />

            <HeaderStat
              label="Categories"
              value={String(
                categories.length
              )}
            />

            <HeaderStat
              label="Workflow"
              value="End-to-End"
            />

            <HeaderStat
              label="Output"
              value="9:16 Ready"
            />
          </section>

          {/* Category chips */}

          <section
            className="
              mt-8
              flex
              flex-wrap
              gap-2
            "
          >
            <div
              className="
                rounded-full
                border border-emerald-500/40
                bg-emerald-500/10
                px-4 py-2
                text-xs
                font-medium
                text-emerald-400
              "
            >
              All Formats
            </div>

            {categories.map(
              (category) => (
                <div
                  key={category}
                  className="
                    rounded-full
                    border border-zinc-800
                    bg-zinc-950
                    px-4 py-2
                    text-xs
                    font-medium
                    text-zinc-400
                  "
                >
                  {getCategoryLabel(
                    category
                  )}
                </div>
              )
            )}
          </section>

          {/* Section heading */}

          <section
            className="
              mt-10
              flex
              items-center
              justify-between
            "
          >
            <div>
              <h2
                className="
                  text-xl
                  font-semibold
                "
              >
                Production Formats
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-zinc-500
                "
              >
                {trends.length} reusable
                formats available
              </p>
            </div>
          </section>

          {/* Trend grid */}

          {trends.length > 0 ? (
            <section
              className="
                mt-5
                grid
                gap-5
                md:grid-cols-2
                xl:grid-cols-3
              "
            >
              {trends.map((trend) => (
                <TrendCard
                  key={trend.id}
                  trend={trend}
                />
              ))}
            </section>
          ) : (
            <section
              className="
                mt-6
                rounded-2xl
                border
                border-dashed
                border-zinc-800
                bg-zinc-950
                p-12
                text-center
              "
            >
              <Sparkles
                className="
                  mx-auto
                  h-8 w-8
                  text-zinc-700
                "
              />

              <h2
                className="
                  mt-4
                  font-semibold
                  text-zinc-300
                "
              >
                No trends available
              </h2>

              <p
                className="
                  mt-2
                  text-sm
                  text-zinc-600
                "
              >
                Add formats to the Trend
                Registry to display them here.
              </p>
            </section>
          )}
        </div>
      </main>
    </AppShell>
  );
}


/*
 * =========================================================
 * HEADER STAT
 * =========================================================
 */

function HeaderStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        rounded-xl
        border border-zinc-800
        bg-zinc-950
        p-4
      "
    >
      <div
        className="
          text-xs
          text-zinc-500
        "
      >
        {label}
      </div>

      <div
        className="
          mt-1
          text-lg
          font-semibold
          text-zinc-200
        "
      >
        {value}
      </div>
    </div>
  );
}