"use client";

import { useMemo, useState } from "react";
import {
  Check,
  Clock3,
  Film,
  MessageSquare,
  MonitorPlay,
  Sparkles,
  Users,
  WandSparkles,
} from "lucide-react";

import type {
  TrendAudioOption,
  TrendDurationOption,
  TrendTemplate,
} from "@/features/trends/types";

/*
 * =========================================================
 * AI CREATOR OS — TREND CONFIGURATOR
 * =========================================================
 *
 * Converts creator selections into a configuration object.
 *
 * NEXT:
 * configuration
 *   -> resolveTrend()
 *   -> Production Contract
 *   -> createProject()
 */


/*
 * =========================================================
 * TYPES
 * =========================================================
 */

interface TrendConfiguratorProps {
  trend: TrendTemplate;
}

interface TrendFormState {
  topic: string;
  durationSeconds: number;
  audioMode: string;
  castId: string;
  storyOptionId: string;
  visualStyleId: string;
  videoEngineId: string;
  customInstructions: string;
}


/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

function getDefaultDuration(
  trend: TrendTemplate
): TrendDurationOption {
  return (
    trend.durations.find(
      (duration) =>
        duration.totalSeconds ===
        trend.defaultDurationSeconds
    ) ??
    trend.durations[0] ?? {
      label: `${trend.defaultDurationSeconds} Seconds`,
      totalSeconds:
        trend.defaultDurationSeconds,
    }
  );
}

function getDefaultAudioOption(
  trend: TrendTemplate
): TrendAudioOption | undefined {
  return trend.audioModes?.find(
    (audio) =>
      audio.id === trend.defaultAudioMode
  );
}

function formatAudioMode(mode: string) {
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


/*
 * =========================================================
 * COMPONENT
 * =========================================================
 */

export default function TrendConfigurator({
  trend,
}: TrendConfiguratorProps) {
  const defaultDuration =
    getDefaultDuration(trend);

  const defaultAudio =
    getDefaultAudioOption(trend);

  const [form, setForm] =
    useState<TrendFormState>({
      topic: "",

      durationSeconds:
        defaultDuration.totalSeconds,

      audioMode:
        defaultAudio?.id ??
        trend.defaultAudioMode,

      castId:
        trend.castOptions?.[0]?.id ?? "",

      storyOptionId:
        trend.storyOptions?.[0]?.id ?? "",

      visualStyleId:
        trend.visualStyles?.[0]?.id ?? "",

      videoEngineId:
        trend.videoEngines?.[0]?.id ?? "",

      customInstructions: "",
    });

  const selectedDuration = useMemo(
    () =>
      trend.durations.find(
        (duration) =>
          duration.totalSeconds ===
          form.durationSeconds
      ) ?? defaultDuration,
    [
      defaultDuration,
      form.durationSeconds,
      trend.durations,
    ]
  );

  const selectedStory =
    trend.storyOptions?.find(
      (story) =>
        story.id === form.storyOptionId
    );

  const selectedCast =
    trend.castOptions?.find(
      (cast) =>
        cast.id === form.castId
    );

  const selectedVisualStyle =
    trend.visualStyles?.find(
      (style) =>
        style.id === form.visualStyleId
    );

  const selectedVideoEngine =
    trend.videoEngines?.find(
      (engine) =>
        engine.id === form.videoEngineId
    );

  function updateField<
    K extends keyof TrendFormState
  >(
    key: K,
    value: TrendFormState[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleContinue() {
    /*
     * Supabase connection comes next.
     *
     * For now this proves that the complete
     * configuration can be resolved safely.
     */

    const configuration = {
      trendId: trend.id,

      topic: form.topic.trim(),

      durationSeconds:
        form.durationSeconds,

      aspectRatio:
        trend.defaultAspectRatio,

      audioMode: form.audioMode,

      castId:
        form.castId || undefined,

      storyOptionId:
        form.storyOptionId || undefined,

      visualStyleId:
        form.visualStyleId || undefined,

      videoEngineId:
        form.videoEngineId || undefined,

      customInstructions:
        form.customInstructions.trim() ||
        undefined,
    };

    console.log(
      "Trend Configuration:",
      configuration
    );
  }

  const canContinue =
    form.topic.trim().length > 0;

  return (
    <section
      id="trend-configurator"
      className="rounded-3xl border border-zinc-800 bg-zinc-950"
    >
      {/* Header */}

      <div className="border-b border-zinc-800 px-6 py-6 sm:px-8">
        <div className="flex items-center gap-2 text-emerald-400">
          <Sparkles className="h-4 w-4" />

          <span className="text-xs font-semibold uppercase tracking-wider">
            Trend Studio
          </span>
        </div>

        <h2 className="mt-3 text-2xl font-semibold text-white">
          Configure {trend.name}
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
          Choose the production settings
          before creating the project.
          These selections will become the
          production contract used by the
          downstream workflow.
        </p>
      </div>

      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_360px]">
        {/* ============================================= */}
        {/* FORM */}
        {/* ============================================= */}

        <div className="space-y-8">
          {/* Topic */}

          <FieldSection
            title="Video Topic"
            description="What should this video be about?"
            icon={
              <Sparkles className="h-5 w-5" />
            }
          >
            <textarea
              value={form.topic}
              onChange={(event) =>
                updateField(
                  "topic",
                  event.target.value
                )
              }
              placeholder={`Example: Create a ${trend.name} video about...`}
              rows={4}
              className="w-full resize-none rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-emerald-500"
            />
          </FieldSection>

          {/* Duration */}

          <FieldSection
            title="Duration"
            description="Choose the production timing contract."
            icon={
              <Clock3 className="h-5 w-5" />
            }
          >
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {trend.durations.map(
                (duration) => {
                  const selected =
                    form.durationSeconds ===
                    duration.totalSeconds;

                  return (
                    <button
                      key={
                        duration.totalSeconds
                      }
                      type="button"
                      onClick={() =>
                        updateField(
                          "durationSeconds",
                          duration.totalSeconds
                        )
                      }
                      className={`relative rounded-xl border p-4 text-left transition ${
                        selected
                          ? "border-emerald-500 bg-emerald-500/10"
                          : "border-zinc-800 bg-black/30 hover:border-zinc-700"
                      }`}
                    >
                      {selected && (
                        <SelectedCheck />
                      )}

                      <div className="font-medium text-zinc-200">
                        {duration.label}
                      </div>

                      <div className="mt-2 text-xs leading-5 text-zinc-500">
                        {duration.sceneCount
                          ? `${duration.sceneCount} scenes`
                          : "Dynamic scenes"}

                        {duration.sceneDurationSeconds
                          ? ` × ${duration.sceneDurationSeconds}s`
                          : ""}
                      </div>

                      <div className="mt-2 text-[11px] text-zinc-600">
                        {duration.exact
                          ? "Exact timing"
                          : "Flexible timing"}
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          </FieldSection>

          {/* Audio */}

          {trend.audioModes &&
            trend.audioModes.length > 0 && (
              <FieldSection
                title="Audio Mode"
                description="Choose how the story is heard."
                icon={
                  <MessageSquare className="h-5 w-5" />
                }
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  {trend.audioModes.map(
                    (audio) => {
                      const selected =
                        form.audioMode ===
                        audio.id;

                      return (
                        <OptionButton
                          key={audio.id}
                          selected={selected}
                          title={audio.label}
                          description={
                            audio.description
                          }
                          onClick={() =>
                            updateField(
                              "audioMode",
                              audio.id
                            )
                          }
                        />
                      );
                    }
                  )}
                </div>
              </FieldSection>
            )}

          {/* Story Engine */}

          {trend.storyOptions &&
            trend.storyOptions.length > 0 && (
              <FieldSection
                title="Story Engine"
                description="Choose the narrative structure."
                icon={
                  <WandSparkles className="h-5 w-5" />
                }
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  {trend.storyOptions.map(
                    (story) => (
                      <OptionButton
                        key={story.id}
                        selected={
                          form.storyOptionId ===
                          story.id
                        }
                        title={story.label}
                        description={
                          story.description
                        }
                        onClick={() =>
                          updateField(
                            "storyOptionId",
                            story.id
                          )
                        }
                      />
                    )
                  )}
                </div>
              </FieldSection>
            )}

          {/* Cast */}

          {trend.castOptions &&
            trend.castOptions.length > 0 && (
              <FieldSection
                title="Cast"
                description="Choose the cast pack for this production."
                icon={
                  <Users className="h-5 w-5" />
                }
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  {trend.castOptions.map(
                    (cast) => (
                      <OptionButton
                        key={cast.id}
                        selected={
                          form.castId ===
                          cast.id
                        }
                        title={cast.label}
                        description={
                          cast.description
                        }
                        onClick={() =>
                          updateField(
                            "castId",
                            cast.id
                          )
                        }
                      />
                    )
                  )}
                </div>
              </FieldSection>
            )}

          {/* Visual Style */}

          {trend.visualStyles &&
            trend.visualStyles.length >
              0 && (
              <FieldSection
                title="Visual Style"
                description="Choose the visual treatment."
                icon={
                  <Film className="h-5 w-5" />
                }
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  {trend.visualStyles.map(
                    (style) => (
                      <OptionButton
                        key={style.id}
                        selected={
                          form.visualStyleId ===
                          style.id
                        }
                        title={style.label}
                        description={
                          style.description
                        }
                        onClick={() =>
                          updateField(
                            "visualStyleId",
                            style.id
                          )
                        }
                      />
                    )
                  )}
                </div>
              </FieldSection>
            )}

          {/* Video Engine */}

          {trend.videoEngines &&
            trend.videoEngines.length > 0 && (
              <FieldSection
                title="Video Engine"
                description="Choose the generation engine."
                icon={
                  <MonitorPlay className="h-5 w-5" />
                }
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  {trend.videoEngines.map(
                    (engine) => (
                      <OptionButton
                        key={engine.id}
                        selected={
                          form.videoEngineId ===
                          engine.id
                        }
                        title={engine.label}
                        description={
                          engine.description
                        }
                        onClick={() =>
                          updateField(
                            "videoEngineId",
                            engine.id
                          )
                        }
                      />
                    )
                  )}
                </div>
              </FieldSection>
            )}

          {/* Instructions */}

          {trend.allowCustomInstructions !==
            false && (
            <FieldSection
              title="Creator Instructions"
              description="Optional instructions unique to this video."
              icon={
                <MessageSquare className="h-5 w-5" />
              }
            >
              <textarea
                value={
                  form.customInstructions
                }
                onChange={(event) =>
                  updateField(
                    "customInstructions",
                    event.target.value
                  )
                }
                placeholder="Example: Make the opening more mysterious and end with a strong reveal..."
                rows={4}
                className="w-full resize-none rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-emerald-500"
              />
            </FieldSection>
          )}
        </div>

        {/* ============================================= */}
        {/* SUMMARY */}
        {/* ============================================= */}

        <aside>
          <div className="sticky top-6 rounded-2xl border border-zinc-800 bg-black/50 p-5">
            <div className="flex items-center gap-2">
              <Film className="h-4 w-4 text-emerald-400" />

              <h3 className="font-semibold text-zinc-200">
                Production Contract
              </h3>
            </div>

            <p className="mt-2 text-xs leading-5 text-zinc-600">
              Live preview of the production
              settings that will be sent into
              the project.
            </p>

            <div className="mt-5 space-y-3">
              <SummaryRow
                label="Format"
                value={trend.name}
              />

              <SummaryRow
                label="Runtime"
                value={`${selectedDuration.totalSeconds}s`}
              />

              <SummaryRow
                label="Scenes"
                value={
                  selectedDuration.sceneCount
                    ? String(
                        selectedDuration.sceneCount
                      )
                    : "Dynamic"
                }
              />

              <SummaryRow
                label="Scene Duration"
                value={
                  selectedDuration.sceneDurationSeconds
                    ? `${selectedDuration.sceneDurationSeconds}s`
                    : "Dynamic"
                }
              />

              <SummaryRow
                label="Timing"
                value={
                  selectedDuration.exact
                    ? "Exact"
                    : "Flexible"
                }
              />

              <SummaryRow
                label="Aspect Ratio"
                value={
                  trend.defaultAspectRatio
                }
              />

              <SummaryRow
                label="Audio"
                value={formatAudioMode(
                  form.audioMode
                )}
              />

              {selectedStory && (
                <SummaryRow
                  label="Story"
                  value={
                    selectedStory.label
                  }
                />
              )}

              {selectedCast && (
                <SummaryRow
                  label="Cast"
                  value={selectedCast.label}
                />
              )}

              {selectedVisualStyle && (
                <SummaryRow
                  label="Visual"
                  value={
                    selectedVisualStyle.label
                  }
                />
              )}

              {selectedVideoEngine && (
                <SummaryRow
                  label="Engine"
                  value={
                    selectedVideoEngine.label
                  }
                />
              )}
            </div>

            {/* Topic preview */}

            <div className="mt-5 border-t border-zinc-800 pt-5">
              <div className="text-[11px] font-medium uppercase tracking-wide text-zinc-600">
                Topic
              </div>

              <p className="mt-2 text-sm leading-5 text-zinc-400">
                {form.topic.trim() ||
                  "Enter a topic to continue."}
              </p>
            </div>

            {/* Continue */}

            <button
              type="button"
              disabled={!canContinue}
              onClick={handleContinue}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-600"
            >
              <Sparkles className="h-4 w-4" />

              Create Production
            </button>

            <p className="mt-3 text-center text-[11px] leading-4 text-zinc-700">
              Project creation will be connected
              in the next step.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}


/*
 * =========================================================
 * FIELD SECTION
 * =========================================================
 */

function FieldSection({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-start gap-3">
        <div className="mt-0.5 text-emerald-400">
          {icon}
        </div>

        <div>
          <h3 className="font-medium text-zinc-200">
            {title}
          </h3>

          <p className="mt-1 text-xs text-zinc-600">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}


/*
 * =========================================================
 * OPTION BUTTON
 * =========================================================
 */

function OptionButton({
  selected,
  title,
  description,
  onClick,
}: {
  selected: boolean;
  title: string;
  description?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative rounded-xl border p-4 text-left transition ${
        selected
          ? "border-emerald-500 bg-emerald-500/10"
          : "border-zinc-800 bg-black/30 hover:border-zinc-700"
      }`}
    >
      {selected && <SelectedCheck />}

      <div className="pr-7 text-sm font-medium text-zinc-200">
        {title}
      </div>

      {description && (
        <p className="mt-2 text-xs leading-5 text-zinc-500">
          {description}
        </p>
      )}
    </button>
  );
}


/*
 * =========================================================
 * SELECTED CHECK
 * =========================================================
 */

function SelectedCheck() {
  return (
    <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-black">
      <Check className="h-3 w-3" />
    </div>
  );
}


/*
 * =========================================================
 * SUMMARY ROW
 * =========================================================
 */

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-zinc-900 bg-zinc-950 px-3 py-2.5">
      <span className="text-xs text-zinc-600">
        {label}
      </span>

      <span className="text-right text-xs font-medium text-zinc-300">
        {value}
      </span>
    </div>
  );
}