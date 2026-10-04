import type {
  Scene,
} from "@/features/scenes/types";

import type {
  TrendTimingContract,
} from "@/features/trends/utils/trendTimingContract";

import {
  validateSceneTiming,
} from "@/features/scenes/utils/validateSceneTiming";

interface Props {
  scenes: Scene[];

  timingContract:
    TrendTimingContract | null;
}

export default function SceneTimingStatus({
  scenes,
  timingContract,
}: Props) {
  if (!timingContract) {
    return null;
  }

  const validation =
    validateSceneTiming(
      scenes,
      timingContract
    );

  if (!validation) {
    return null;
  }

  const statusLabel =
    validation.valid
      ? "VALID"
      : scenes.length === 0
        ? "WAITING"
        : "NEEDS REPAIR";

  return (
    <section
      className={`rounded-xl border p-6 ${
        validation.valid
          ? "border-emerald-900/60 bg-emerald-950/10"
          : scenes.length === 0
            ? "border-zinc-800 bg-zinc-900"
            : "border-amber-900/60 bg-amber-950/10"
      }`}
    >
      {/* HEADER */}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            Trend Production Contract
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            ⏱ Scene Timing Status
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            Scene count and timing
            are checked against
            the production contract
            before assets and export.
          </p>
        </div>

        <StatusBadge
          valid={
            validation.valid
          }
          waiting={
            scenes.length === 0
          }
          label={
            statusLabel
          }
        />
      </div>

      {/* CONTRACT */}

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Scene Count"
          actual={
            `${validation.actualSceneCount}`
          }
          expected={
            `${validation.expectedSceneCount}`
          }
          valid={
            validation.sceneCountValid
          }
        />

        <MetricCard
          label="Per Scene"
          actual={
            validation.durationValid
              ? `${validation.expectedSceneDuration}s`
              : "Mismatch"
          }
          expected={
            `${validation.expectedSceneDuration}s`
          }
          valid={
            validation.durationValid
          }
        />

        <MetricCard
          label="Total Duration"
          actual={
            `${validation.actualTotalDuration}s`
          }
          expected={
            `${validation.expectedTotalDuration}s`
          }
          valid={
            validation.totalDurationValid
          }
        />

        <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-600">
            Contract
          </p>

          <p className="mt-2 text-lg font-bold text-zinc-200">
            {
              validation.expectedSceneCount
            }
            {" × "}
            {
              validation.expectedSceneDuration
            }
            s
          </p>

          <p className="mt-1 text-xs text-zinc-500">
            {
              validation.expectedTotalDuration
            }
            s target runtime
          </p>
        </div>
      </div>

      {/* VALID */}

      {validation.valid && (
        <div className="mt-5 rounded-lg border border-emerald-800 bg-emerald-950/30 p-4">
          <p className="font-semibold text-emerald-400">
            ✓ Scene timing matches
            the Trend Production
            Contract.
          </p>

          <p className="mt-1 text-sm text-emerald-300/70">
            {
              validation.actualSceneCount
            }
            {" scenes × "}
            {
              validation.expectedSceneDuration
            }
            {"s = "}
            {
              validation.actualTotalDuration
            }
            s.
          </p>
        </div>
      )}

      {/* NO SCENES */}

      {scenes.length === 0 && (
        <div className="mt-5 rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
          <p className="font-medium text-zinc-300">
            Waiting for scenes.
          </p>

          <p className="mt-1 text-sm text-zinc-500">
            This production requires
            exactly{" "}
            {
              validation.expectedSceneCount
            }
            {" scenes at "}
            {
              validation.expectedSceneDuration
            }
            s each.
          </p>
        </div>
      )}

      {/* SCENE COUNT PROBLEM */}

      {scenes.length > 0 &&
        !validation.sceneCountValid && (
          <div className="mt-5 rounded-lg border border-amber-800/70 bg-amber-950/20 p-4">
            <p className="font-semibold text-amber-400">
              ⚠ Scene count mismatch
            </p>

            <p className="mt-1 text-sm text-zinc-400">
              Expected{" "}
              {
                validation.expectedSceneCount
              }
              {" scenes, but found "}
              {
                validation.actualSceneCount
              }
              .
            </p>

            {validation.missingSceneCount >
              0 && (
              <p className="mt-2 text-sm text-amber-300">
                Missing{" "}
                {
                  validation.missingSceneCount
                }
                {" scene"}
                {
                  validation.missingSceneCount ===
                  1
                    ? ""
                    : "s"
                }
                .
              </p>
            )}

            {validation.extraSceneCount >
              0 && (
              <p className="mt-2 text-sm text-amber-300">
                {
                  validation.extraSceneCount
                }
                {" extra scene"}
                {
                  validation.extraSceneCount ===
                  1
                    ? ""
                    : "s"
                }
                .
              </p>
            )}
          </div>
        )}

      {/* MISMATCHED SCENES */}

      {validation.mismatchedScenes
        .length > 0 && (
        <div className="mt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-400">
                Duration Problems
              </p>

              <h3 className="mt-1 font-semibold text-zinc-200">
                {
                  validation
                    .mismatchedScenes
                    .length
                }
                {" scene"}
                {
                  validation
                    .mismatchedScenes
                    .length ===
                  1
                    ? ""
                    : "s"
                }
                {" need attention"}
              </h3>
            </div>

            <span className="rounded-full border border-red-900 bg-red-950/30 px-3 py-1 text-xs font-semibold text-red-400">
              {
                validation
                  .mismatchedScenes
                  .length
              }
              {" mismatched"}
            </span>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {validation.mismatchedScenes.map(
              (
                issue
              ) => (
                <div
                  key={
                    `${issue.sceneId}-${issue.sceneNumber}`
                  }
                  className="rounded-lg border border-red-900/60 bg-red-950/20 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-red-500">
                        Scene{" "}
                        {
                          issue.sceneNumber
                        }
                      </p>

                      <p className="mt-1 font-medium text-zinc-200">
                        {
                          issue.title
                        }
                      </p>
                    </div>

                    <span className="rounded-md border border-red-900 bg-zinc-950 px-2 py-1 text-xs font-semibold text-red-400">
                      {
                        issue.actualDuration
                      }
                      {"s → "}
                      {
                        issue.expectedDuration
                      }
                      s
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-zinc-400">
                    {
                      issue.message
                    }
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* PRODUCTION WARNING */}

      {scenes.length > 0 &&
        !validation.valid && (
          <div className="mt-5 border-t border-zinc-800 pt-4">
            <p className="text-sm font-medium text-amber-400">
              Production timing is
              not ready.
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Fix the scene count
              and highlighted scene
              durations before
              treating this production
              as timing-complete.
            </p>
          </div>
        )}
    </section>
  );
}

function MetricCard({
  label,
  actual,
  expected,
  valid,
}: {
  label: string;

  actual: string;

  expected: string;

  valid: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        valid
          ? "border-emerald-900/60 bg-emerald-950/10"
          : "border-red-900/60 bg-red-950/10"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-600">
          {
            label
          }
        </p>

        <span
          className={
            valid
              ? "text-xs text-emerald-400"
              : "text-xs text-red-400"
          }
        >
          {valid
            ? "✓"
            : "⚠"}
        </span>
      </div>

      <p className="mt-2 text-xl font-bold text-zinc-200">
        {
          actual
        }
      </p>

      <p className="mt-1 text-xs text-zinc-500">
        Expected:{" "}
        {
          expected
        }
      </p>
    </div>
  );
}

function StatusBadge({
  valid,
  waiting,
  label,
}: {
  valid: boolean;

  waiting: boolean;

  label: string;
}) {
  const classes =
    valid
      ? "border-emerald-800 bg-emerald-950/40 text-emerald-400"
      : waiting
        ? "border-zinc-700 bg-zinc-950 text-zinc-500"
        : "border-amber-800 bg-amber-950/30 text-amber-400";

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-semibold ${classes}`}
    >
      {
        label
      }
    </span>
  );
}