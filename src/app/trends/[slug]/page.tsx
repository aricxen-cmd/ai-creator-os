import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  Film,
  LayoutTemplate,
  MessageSquare,
  MonitorPlay,
  Sparkles,
  Users,
  WandSparkles,
} from "lucide-react";

import TrendConfigurator from "@/features/trends/components/TrendConfigurator";

import AppShell from "@/components/layout/AppShell";
import {
  getTrendTemplate,
  TREND_REGISTRY,
} from "@/features/trends/registry";
import type {
  TrendDurationOption,
  TrendTemplate,
} from "@/features/trends/types";

/*
 * =========================================================
 * AI CREATOR OS — TREND DETAIL PAGE
 * =========================================================
 *
 * Route:
 *
 * /trends/[slug]
 *
 * Example:
 *
 * /trends/food-story
 * /trends/brainrot-story
 * /trends/talking-objects
 */


/*
 * =========================================================
 * NEXT.JS STATIC PARAMS
 * =========================================================
 */

export function generateStaticParams() {
  return TREND_REGISTRY.map((trend) => ({
    slug: trend.id,
  }));
}


/*
 * =========================================================
 * PAGE TYPES
 * =========================================================
 */

interface TrendPageProps {
  params: Promise<{
    slug: string;
  }>;
}


/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

function getAudioLabel(
  mode: TrendTemplate["defaultAudioMode"]
) {
  switch (mode) {
    case "native-audio":
      return "Native Audio";

    case "voice-over":
      return "Voice Over";

    case "none":
      return "Visual / Music";

    default:
      return mode;
  }
}

function getCategoryLabel(
  category: string
) {
  return category
    .split("-")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1)
    )
    .join(" ");
}

function formatDuration(
  duration: TrendDurationOption
) {
  if (
    duration.sceneCount &&
    duration.sceneDurationSeconds
  ) {
    return `${duration.sceneCount} scenes × ${duration.sceneDurationSeconds}s`;
  }

  if (duration.sceneCount) {
    return `${duration.sceneCount} scenes`;
  }

  return duration.exact
    ? "Exact timing"
    : "Dynamic timing";
}


/*
 * =========================================================
 * PAGE
 * =========================================================
 */

export default async function TrendDetailPage({
  params,
}: TrendPageProps) {
  const { slug } = await params;

  const trend = getTrendTemplate(slug);

  if (!trend) {
    notFound();
  }

  const defaultDuration =
    trend.durations.find(
      (duration) =>
        duration.totalSeconds ===
        trend.defaultDurationSeconds
    ) ?? trend.durations[0];

  return (
    <AppShell>
      <main className="min-h-screen bg-black px-6 py-8 text-white lg:px-10">
        <div className="mx-auto max-w-7xl">
          {/* Back */}

          <Link
            href="/trends"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />

            Back to Trends
          </Link>

          {/* Hero */}

          <section className="mt-6 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950">
            <div className="relative overflow-hidden px-6 py-10 sm:px-8 lg:px-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_45%)]" />

              <div className="relative max-w-4xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                    {getCategoryLabel(
                      trend.category
                    )}
                  </span>

                  <span className="rounded-full border border-zinc-800 bg-black/50 px-3 py-1 text-xs text-zinc-400">
                    {
                      trend.defaultAspectRatio
                    }
                  </span>

                  <span className="rounded-full border border-zinc-800 bg-black/50 px-3 py-1 text-xs text-zinc-400">
                    {getAudioLabel(
                      trend.defaultAudioMode
                    )}
                  </span>
                </div>

                <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  {trend.name}
                </h1>

                <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-400">
                  {trend.description}
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href="#trend-configurator"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400"
                  >
                    <Sparkles className="h-4 w-4" />

                    Configure Trend

                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/prompts"
                    className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-white"
                  >
                    <LayoutTemplate className="h-4 w-4" />

                    Prompt Vault
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Trend Configurator */}

<section className="mt-6">
  <TrendConfigurator trend={trend} />
</section>

          {/* Default production contract */}

          <section className="mt-6">
            <div>
              <div className="flex items-center gap-2">
                <Film className="h-5 w-5 text-emerald-400" />

                <h2 className="text-xl font-semibold">
                  Default Production Contract
                </h2>
              </div>

              <p className="mt-1 text-sm text-zinc-500">
                These settings become
                authoritative when this trend
                enters the production pipeline.
              </p>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                icon={
                  <Clock3 className="h-4 w-4" />
                }
                label="Runtime"
                value={`${trend.defaultDurationSeconds}s`}
              />

              <MetricCard
                icon={
                  <Film className="h-4 w-4" />
                }
                label="Scenes"
                value={
                  defaultDuration?.sceneCount
                    ? String(
                        defaultDuration.sceneCount
                      )
                    : "Dynamic"
                }
              />

              <MetricCard
                icon={
                  <MonitorPlay className="h-4 w-4" />
                }
                label="Scene Duration"
                value={
                  defaultDuration?.sceneDurationSeconds
                    ? `${defaultDuration.sceneDurationSeconds}s`
                    : "Dynamic"
                }
              />

              <MetricCard
                icon={
                  <MessageSquare className="h-4 w-4" />
                }
                label="Audio"
                value={getAudioLabel(
                  trend.defaultAudioMode
                )}
              />
            </div>
          </section>

          {/* Main configuration information */}

          <section className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
            {/* Left */}

            <div className="space-y-6">
              {/* Duration */}

              <Panel
                title="Duration Options"
                description="Available production contracts for this format."
                icon={
                  <Clock3 className="h-5 w-5" />
                }
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  {trend.durations.map(
                    (duration) => {
                      const isDefault =
                        duration.totalSeconds ===
                        trend.defaultDurationSeconds;

                      return (
                        <div
                          key={
                            duration.totalSeconds
                          }
                          className={`rounded-xl border p-4 ${
                            isDefault
                              ? "border-emerald-500/40 bg-emerald-500/5"
                              : "border-zinc-800 bg-black/30"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="font-medium text-zinc-200">
                                {
                                  duration.label
                                }
                              </div>

                              <div className="mt-1 text-sm text-zinc-500">
                                {formatDuration(
                                  duration
                                )}
                              </div>
                            </div>

                            {isDefault && (
                              <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-emerald-400">
                                Default
                              </span>
                            )}
                          </div>

                          <div className="mt-3 text-xs text-zinc-600">
                            {duration.exact
                              ? "Exact production timing"
                              : "Flexible production timing"}
                          </div>

                          {duration.description && (
                            <p className="mt-3 text-xs leading-5 text-zinc-500">
                              {
                                duration.description
                              }
                            </p>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              </Panel>

              {/* Story options */}

              {trend.storyOptions &&
                trend.storyOptions.length >
                  0 && (
                  <Panel
                    title="Story Engines"
                    description="Story structures available for this format."
                    icon={
                      <WandSparkles className="h-5 w-5" />
                    }
                  >
                    <div className="grid gap-3 sm:grid-cols-2">
                      {trend.storyOptions.map(
                        (story) => (
                          <OptionCard
                            key={story.id}
                            title={story.label}
                            description={
                              story.description
                            }
                          />
                        )
                      )}
                    </div>
                  </Panel>
                )}

              {/* Cast */}

              {trend.castOptions &&
                trend.castOptions.length >
                  0 && (
                  <Panel
                    title="Cast Options"
                    description="Available character packs and cast locks."
                    icon={
                      <Users className="h-5 w-5" />
                    }
                  >
                    <div className="grid gap-3 sm:grid-cols-2">
                      {trend.castOptions.map(
                        (cast) => (
                          <OptionCard
                            key={cast.id}
                            title={cast.label}
                            description={
                              cast.description
                            }
                          />
                        )
                      )}
                    </div>
                  </Panel>
                )}

              {/* Visual styles */}

              {trend.visualStyles &&
                trend.visualStyles.length >
                  0 && (
                  <Panel
                    title="Visual Styles"
                    description="Available visual treatments for this production format."
                    icon={
                      <Sparkles className="h-5 w-5" />
                    }
                  >
                    <div className="grid gap-3 sm:grid-cols-2">
                      {trend.visualStyles.map(
                        (style) => (
                          <OptionCard
                            key={style.id}
                            title={style.label}
                            description={
                              style.description
                            }
                          />
                        )
                      )}
                    </div>
                  </Panel>
                )}
            </div>

            {/* Right */}

            <aside className="space-y-6">
              {/* Production rules */}

              <Panel
                title="Production Rules"
                description="Rules passed downstream into script, storyboard, and scene generation."
                icon={
                  <Film className="h-5 w-5" />
                }
              >
                {trend.instructions &&
                trend.instructions.length >
                  0 ? (
                  <div className="space-y-3">
                    {trend.instructions.map(
                      (
                        instruction,
                        index
                      ) => (
                        <div
                          key={`${trend.id}-rule-${index}`}
                          className="flex gap-3"
                        >
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-[11px] font-semibold text-emerald-400">
                            {index + 1}
                          </div>

                          <p className="pt-0.5 text-sm leading-5 text-zinc-400">
                            {instruction}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500">
                    No additional format
                    rules.
                  </p>
                )}
              </Panel>

              {/* Pipeline */}

              <Panel
                title="Production Pipeline"
                description="Where this Trend goes after configuration."
                icon={
                  <ArrowRight className="h-5 w-5" />
                }
              >
                <Pipeline />
              </Panel>

              {/* Tags */}

              {trend.tags &&
                trend.tags.length > 0 && (
                  <Panel
                    title="Tags"
                    icon={
                      <Sparkles className="h-5 w-5" />
                    }
                  >
                    <div className="flex flex-wrap gap-2">
                      {trend.tags.map(
                        (tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-zinc-800 bg-black/40 px-3 py-1.5 text-xs text-zinc-500"
                          >
                            #{tag}
                          </span>
                        )
                      )}
                    </div>
                  </Panel>
                )}
            </aside>
          </section>
        </div>
      </main>
    </AppShell>
  );
}


/*
 * =========================================================
 * PANEL
 * =========================================================
 */

function Panel({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-emerald-400">
          {icon}
        </div>

        <div>
          <h2 className="font-semibold text-zinc-200">
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-sm leading-5 text-zinc-500">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5">
        {children}
      </div>
    </section>
  );
}


/*
 * =========================================================
 * OPTION CARD
 * =========================================================
 */

function OptionCard({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-black/30 p-4">
      <div className="text-sm font-medium text-zinc-200">
        {title}
      </div>

      {description && (
        <p className="mt-2 text-xs leading-5 text-zinc-500">
          {description}
        </p>
      )}
    </div>
  );
}


/*
 * =========================================================
 * METRIC CARD
 * =========================================================
 */

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
      <div className="flex items-center gap-2 text-zinc-500">
        {icon}

        <span className="text-xs">
          {label}
        </span>
      </div>

      <div className="mt-2 text-lg font-semibold text-zinc-200">
        {value}
      </div>
    </div>
  );
}


/*
 * =========================================================
 * PIPELINE
 * =========================================================
 */

function Pipeline() {
  const stages = [
    "Trend Configuration",
    "Production Contract",
    "Create Project",
    "Research",
    "Script",
    "Storyboard",
    "Scenes",
    "Assets",
    "Timeline",
    "Export",
  ];

  return (
    <div className="space-y-2">
      {stages.map((stage, index) => (
        <div
          key={stage}
          className="flex items-center gap-3"
        >
          <div
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${
              index < 2
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-zinc-900 text-zinc-600"
            }`}
          >
            {index + 1}
          </div>

          <span
            className={`text-sm ${
              index < 2
                ? "text-zinc-300"
                : "text-zinc-500"
            }`}
          >
            {stage}
          </span>
        </div>
      ))}
    </div>
  );
}