"use client";

import {
  useState,
} from "react";

import {
  generateStoryboard,
} from "../services/generateStoryboard";

import {
  updateProject,
} from "@/lib/supabase/updateProject";

import type {
  TrendTimingContract,
} from "@/features/trends/utils/trendTimingContract";

import {
  buildStoryboardTimingInstructions,
  validateStoryboardTiming,
} from "@/features/trends/utils/trendTimingContract";

interface Props {
  provider?: string;

  model?: string;

  projectId?: string;

  initialScript?: string;

  initialStoryboard?: string;

  timingContract?:
    TrendTimingContract | null;
}

export default function StoryboardForm({
  provider = "Ollama",

  model = "qwen3:4b",

  projectId,

  initialScript = "",

  initialStoryboard = "",

  timingContract = null,
}: Props) {
  const [
    script,
    setScript,
  ] = useState(
    initialScript
  );

  const [
    storyboard,
    setStoryboard,
  ] = useState(
    initialStoryboard
  );

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    status,
    setStatus,
  ] = useState(
    initialStoryboard
      ? "Saved storyboard loaded."
      : ""
  );

  /*
   * Validate the current
   * storyboard against the
   * Trend Production Contract.
   */
  const timingValidation =
    validateStoryboardTiming(
      storyboard,
      timingContract
    );

  async function handleGenerate() {
    if (!script.trim()) {
      setError(
        "A script is required before generating a storyboard."
      );

      return;
    }

    setLoading(true);

    setError("");

    setStatus("");

    try {
      /*
       * Build strict timing
       * instructions from the
       * Trend Production Contract.
       */
      const timingInstructions =
        buildStoryboardTimingInstructions(
          timingContract
        );

      /*
       * Add the timing contract
       * directly to the AI input.
       */
      const productionInput =
        timingInstructions
          ? `
SCRIPT:

${script}

==============================

${timingInstructions}

==============================

STORYBOARD FORMAT REQUIREMENTS:

For every scene include:

Scene [number]
Duration: [seconds]s
Narration:
Visual:
Camera:
Motion:
Transition:

Follow the exact scene count and scene duration above.
Do not create additional scenes.
Do not combine scenes.
`.trim()
          : script;

      const data =
        await generateStoryboard(
          productionInput,
          provider,
          model
        );

      if (!data.success) {
        throw new Error(
          data.error ||
            "Storyboard generation failed."
        );
      }

      if (
        typeof data.response !==
          "string" ||
        !data.response.trim()
      ) {
        throw new Error(
          "AI returned an empty storyboard."
        );
      }

      const result =
        data.response.trim();

      /*
       * Put the result into the
       * editor first so the user
       * never loses the generation.
       */
      setStoryboard(
        result
      );

      /*
       * Validate exact scene
       * count and duration.
       */
      const validation =
        validateStoryboardTiming(
          result,
          timingContract
        );

      /*
       * If the Trend Contract
       * exists and validation
       * fails, keep the result
       * visible but do NOT
       * silently mark it ready.
       */
      if (
        validation &&
        !validation.valid
      ) {
        setError(
          validation.message
        );

        /*
         * Still save the draft
         * so generation isn't lost.
         */
        if (projectId) {
          await saveStoryboard(
            result
          );
        }

        setStatus(
          "Storyboard saved as a draft, but timing validation failed."
        );

        return;
      }

      if (projectId) {
        await saveStoryboard(
          result
        );

        if (validation) {
          setStatus(
            `Storyboard generated, validated, and saved. ${validation.expectedSceneCount} scenes × ${validation.expectedSceneDuration}s.`
          );
        } else {
          setStatus(
            "Storyboard generated and saved to project."
          );
        }
      } else {
        setStatus(
          validation
            ? "Storyboard generated and timing validated."
            : "Storyboard generated."
        );
      }
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Something went wrong."
        )
      );
    } finally {
      setLoading(false);
    }
  }

  async function saveStoryboard(
    content: string
  ) {
    if (!projectId) {
      return;
    }

    setSaving(true);

    try {
      await updateProject(
        projectId,
        {
          storyboard:
            content,
        }
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleSave() {
    if (!projectId) {
      setError(
        "This storyboard is not attached to a project."
      );

      return;
    }

    if (!storyboard.trim()) {
      setError(
        "There is no storyboard to save."
      );

      return;
    }

    setError("");

    setStatus("");

    try {
      await saveStoryboard(
        storyboard
      );

      /*
       * Give clear timing feedback
       * when manually saving.
       */
      if (
        timingValidation &&
        !timingValidation.valid
      ) {
        setStatus(
          "Storyboard saved as a draft."
        );

        setError(
          timingValidation.message
        );

        return;
      }

      if (
        timingValidation?.valid
      ) {
        setStatus(
          `Storyboard saved. Timing valid: ${timingValidation.expectedSceneCount} scenes × ${timingValidation.expectedSceneDuration}s.`
        );

        return;
      }

      setStatus(
        "Storyboard saved."
      );
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to save storyboard."
        )
      );
    }
  }

  async function handleCopy() {
    if (!storyboard.trim()) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        storyboard
      );

      setStatus(
        "Storyboard copied."
      );
    } catch {
      setError(
        "Unable to copy storyboard."
      );
    }
  }

  function handleDownload() {
    if (!storyboard.trim()) {
      return;
    }

    const blob =
      new Blob(
        [storyboard],
        {
          type:
            "text/plain",
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const anchor =
      document.createElement(
        "a"
      );

    anchor.href =
      url;

    anchor.download =
      "storyboard.txt";

    document.body.appendChild(
      anchor
    );

    anchor.click();

    anchor.remove();

    URL.revokeObjectURL(
      url
    );

    setStatus(
      "Storyboard downloaded."
    );
  }

  async function handleClear() {
    setStoryboard("");

    setError("");

    setStatus("");

    if (!projectId) {
      return;
    }

    try {
      await updateProject(
        projectId,
        {
          storyboard:
            null,
        }
      );

      setStatus(
        "Storyboard cleared."
      );
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to clear storyboard."
        )
      );
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[430px_minmax(0,1fr)]">
      {/* LEFT */}

      <div className="space-y-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
              Story Setup
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Script Input
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Use the project's
              script or paste a
              different script to
              convert it into
              visual production
              scenes.
            </p>
          </div>

          {/* TIMING CONTRACT */}

          {timingContract && (
            <div className="mt-5 rounded-lg border border-emerald-900/60 bg-emerald-950/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-500">
                    Timing Contract
                  </p>

                  <p className="mt-1 text-sm font-semibold text-emerald-300">
                    {
                      timingContract.sceneCount
                    }
                    {" scenes × "}
                    {
                      timingContract.sceneDurationSeconds
                    }
                    s
                  </p>
                </div>

                <span className="rounded-full border border-emerald-800 px-2 py-1 text-[10px] font-semibold text-emerald-400">
                  LOCKED
                </span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                <TimingMiniCard
                  label="Runtime"
                  value={`${timingContract.totalDurationSeconds}s`}
                />

                <TimingMiniCard
                  label="Scenes"
                  value={`${timingContract.sceneCount}`}
                />

                <TimingMiniCard
                  label="Each"
                  value={`${timingContract.sceneDurationSeconds}s`}
                />
              </div>
            </div>
          )}

          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Script
            </label>

            <textarea
              value={
                script
              }
              onChange={(
                event
              ) =>
                setScript(
                  event.target
                    .value
                )
              }
              rows={18}
              placeholder="Paste or write the script here..."
              className="input resize-y leading-7"
            />
          </div>

          <div className="mt-5 rounded-lg border border-zinc-800 bg-zinc-950 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Current AI
            </p>

            <p className="mt-1 text-sm font-medium text-zinc-200">
              {provider} ·{" "}
              {model}
            </p>

            <p className="mt-2 text-xs text-zinc-500">
              Local storyboard
              generation with
              Qwen through
              Ollama.
            </p>
          </div>

          {projectId && (
            <div className="mt-4 rounded-lg border border-emerald-900/60 bg-emerald-950/20 p-4">
              <p className="text-xs uppercase tracking-wide text-emerald-500">
                Project Mode
              </p>

              <p className="mt-1 text-sm text-emerald-300">
                Generated
                storyboard will
                be saved to this
                project.
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={
              handleGenerate
            }
            disabled={
              loading
            }
            className="mt-6 w-full rounded-lg bg-emerald-600 px-5 py-3 font-semibold transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "🎬 Generating..."
              : timingContract
                ? `🎬 Generate ${timingContract.sceneCount}-Scene Storyboard`
                : "🎬 Generate Storyboard"}
          </button>

          {saving && (
            <p className="mt-3 text-sm text-amber-400">
              Saving...
            </p>
          )}

          {status && (
            <div className="mt-4 rounded-lg border border-emerald-800 bg-emerald-950/30 p-4 text-sm text-emerald-400">
              {status}
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-lg border border-red-700 bg-red-950/50 p-4 text-sm text-red-300">
              {error}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h3 className="font-semibold">
            Storyboard Output
          </h3>

          <div className="mt-4 space-y-3 text-sm text-zinc-400">
            <p>
              ✓ Exact scene count
            </p>

            <p>
              ✓ Exact scene duration
            </p>

            <p>
              ✓ Scene breakdown
            </p>

            <p>
              ✓ Narration
            </p>

            <p>
              ✓ Visual action
            </p>

            <p>
              ✓ Camera framing
            </p>

            <p>
              ✓ Motion
            </p>

            <p>
              ✓ Transitions
            </p>

            <p>
              ✓ AI generation context
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT */}

      <div className="xl:sticky xl:top-6 xl:self-start">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                Production
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Storyboard Output
              </h2>
            </div>

            {storyboard && (
              <span
                className={`rounded-full border px-3 py-1 text-xs ${
                  timingValidation?.valid
                    ? "border-emerald-900 bg-emerald-950/30 text-emerald-400"
                    : timingContract
                      ? "border-red-900 bg-red-950/30 text-red-400"
                      : "border-emerald-900 bg-emerald-950/30 text-emerald-400"
                }`}
              >
                {timingValidation?.valid
                  ? "Validated"
                  : timingContract
                    ? "Needs Review"
                    : "Ready"}
              </span>
            )}
          </div>

          {/* TIMING VALIDATION */}

          {timingContract && (
            <div
              className={`mt-5 rounded-lg border p-4 ${
                timingValidation?.valid
                  ? "border-emerald-800 bg-emerald-950/30"
                  : storyboard
                    ? "border-red-800 bg-red-950/30"
                    : "border-zinc-800 bg-zinc-950"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Scene Timing Validation
                  </p>

                  <p className="mt-1 text-sm font-semibold text-zinc-200">
                    {
                      timingContract.sceneCount
                    }
                    {" scenes × "}
                    {
                      timingContract.sceneDurationSeconds
                    }
                    s
                    {" = "}
                    {
                      timingContract.totalDurationSeconds
                    }
                    s
                  </p>
                </div>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    timingValidation?.valid
                      ? "border-emerald-800 text-emerald-400"
                      : storyboard
                        ? "border-red-800 text-red-400"
                        : "border-zinc-700 text-zinc-500"
                  }`}
                >
                  {timingValidation?.valid
                    ? "✓ VALID"
                    : storyboard
                      ? "⚠ INVALID"
                      : "WAITING"}
                </span>
              </div>

              {timingValidation && (
                <>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
                      <p className="text-[10px] uppercase tracking-wide text-zinc-600">
                        Scenes
                      </p>

                      <p
                        className={`mt-1 text-sm font-semibold ${
                          timingValidation.sceneCountValid
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {
                          timingValidation.actualSceneCount
                        }
                        {" / "}
                        {
                          timingValidation.expectedSceneCount
                        }
                      </p>
                    </div>

                    <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
                      <p className="text-[10px] uppercase tracking-wide text-zinc-600">
                        Duration
                      </p>

                      <p
                        className={`mt-1 text-sm font-semibold ${
                          timingValidation.durationValid
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {
                          timingValidation.expectedSceneDuration
                        }
                        s each
                      </p>
                    </div>
                  </div>

                  <p
                    className={`mt-3 text-sm ${
                      timingValidation.valid
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {
                      timingValidation.message
                    }
                  </p>
                </>
              )}

              {!storyboard && (
                <p className="mt-3 text-sm text-zinc-500">
                  Generate the
                  storyboard to
                  validate its scene
                  count and timing.
                </p>
              )}
            </div>
          )}

          {!storyboard &&
            !loading && (
              <div className="mt-6 flex min-h-140 items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-950/50 p-8 text-center">
                <div>
                  <div className="text-4xl">
                    🎬
                  </div>

                  <h3 className="mt-4 font-semibold">
                    Your storyboard will appear here
                  </h3>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
                    Add a script and
                    generate the
                    production
                    storyboard.
                  </p>

                  {timingContract && (
                    <p className="mt-3 text-sm font-medium text-emerald-500">
                      Expected:{" "}
                      {
                        timingContract.sceneCount
                      }
                      {" scenes × "}
                      {
                        timingContract.sceneDurationSeconds
                      }
                      s
                    </p>
                  )}
                </div>
              </div>
            )}

          {loading && (
            <div className="mt-6 flex min-h-140 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950">
              <div className="text-center">
                <div className="text-4xl">
                  🎬
                </div>

                <p className="mt-4 font-semibold text-emerald-400">
                  Building storyboard...
                </p>

                <p className="mt-2 text-sm text-zinc-500">
                  {timingContract
                    ? `Building exactly ${timingContract.sceneCount} scenes at ${timingContract.sceneDurationSeconds}s each.`
                    : "Qwen is converting the script into production scenes."}
                </p>
              </div>
            </div>
          )}

          {storyboard && (
            <>
              <textarea
                value={
                  storyboard
                }
                onChange={(
                  event
                ) => {
                  setStoryboard(
                    event.target
                      .value
                  );

                  if (
                    projectId
                  ) {
                    setStatus(
                      "Unsaved changes."
                    );
                  }

                  setError("");
                }}
                rows={30}
                className="input mt-6 resize-y leading-7"
              />

              <div className="mt-5 flex flex-wrap gap-3">
                {projectId && (
                  <button
                    type="button"
                    onClick={
                      handleSave
                    }
                    disabled={
                      saving
                    }
                    className="rounded-lg bg-emerald-600 px-5 py-3 font-semibold transition hover:bg-emerald-500 disabled:opacity-50"
                  >
                    💾 Save
                  </button>
                )}

                <button
                  type="button"
                  onClick={
                    handleCopy
                  }
                  className="rounded-lg border border-zinc-700 px-5 py-3 text-zinc-300 transition hover:border-zinc-500"
                >
                  📋 Copy
                </button>

                <button
                  type="button"
                  onClick={
                    handleDownload
                  }
                  className="rounded-lg border border-zinc-700 px-5 py-3 text-zinc-300 transition hover:border-zinc-500"
                >
                  ⬇ Download
                </button>

                <button
                  type="button"
                  onClick={
                    handleClear
                  }
                  className="rounded-lg border border-red-800 px-5 py-3 text-red-400 transition hover:border-red-600"
                >
                  🗑 Clear
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid
            rgb(63 63 70);
          background:
            rgb(9 9 11);
          padding:
            0.75rem 1rem;
          color: white;
          outline: none;
        }

        .input:focus {
          border-color:
            rgb(16 185 129);
        }

        .input::placeholder {
          color:
            rgb(113 113 122);
        }
      `}</style>
    </div>
  );
}

function TimingMiniCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-emerald-900/40 bg-zinc-950/60 p-2">
      <p className="text-[9px] uppercase tracking-wide text-zinc-600">
        {
          label
        }
      </p>

      <p className="mt-1 text-sm font-bold text-zinc-300">
        {
          value
        }
      </p>
    </div>
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