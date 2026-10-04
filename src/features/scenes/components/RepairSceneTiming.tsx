"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import type {
  Scene,
} from "@/features/scenes/types";

import type {
  TrendTimingContract,
} from "@/features/trends/utils/trendTimingContract";

import {
  validateSceneTiming,
} from "@/features/scenes/utils/validateSceneTiming";

import {
  repairSceneTiming,
} from "@/features/scenes/utils/repairSceneTiming";

import {
  clearSceneTimingSnapshot,
  createSceneTimingSnapshot,
  readSceneTimingSnapshot,
  restoreSceneDurations,
  writeSceneTimingSnapshot,
} from "@/features/scenes/utils/sceneTimingHistory";

import {
  updateProject,
} from "@/lib/supabase/updateProject";

interface Props {
  projectId: string;

  scenes: Scene[];

  timingContract:
    TrendTimingContract | null;

  history?: unknown;
}

export default function RepairSceneTiming({
  projectId,
  scenes,
  timingContract,
  history,
}: Props) {
  const router =
    useRouter();

  const [
    repairing,
    setRepairing,
  ] = useState(false);

  const [
    undoing,
    setUndoing,
  ] = useState(false);

  const [
    confirmOpen,
    setConfirmOpen,
  ] = useState(false);

  const [
    undoConfirmOpen,
    setUndoConfirmOpen,
  ] = useState(false);

  const [
    status,
    setStatus,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const validation =
    validateSceneTiming(
      scenes,
      timingContract
    );

  const undoSnapshot =
    readSceneTimingSnapshot(
      history
    );

  const canUndo =
    Boolean(
      undoSnapshot &&
      undoSnapshot
        .previousDurations
        .length > 0
    );

  const mismatchedScenes =
    validation
      ?.mismatchedScenes ??
    [];

  const mismatchedCount =
    mismatchedScenes.length;

  /*
   * Opens the repair confirmation.
   */
  function handleOpenConfirmation() {
    setError("");

    setStatus("");

    if (
      mismatchedCount ===
      0
    ) {
      setStatus(
        "No scene durations need repair."
      );

      return;
    }

    setConfirmOpen(true);
  }

  function handleCancelRepair() {
    if (repairing) {
      return;
    }

    setConfirmOpen(false);
  }

  /*
   * Opens the undo confirmation.
   */
  function handleOpenUndo() {
    setError("");

    setStatus("");

    if (!canUndo) {
      setStatus(
        "There is no timing repair to undo."
      );

      return;
    }

    setUndoConfirmOpen(true);
  }

  function handleCancelUndo() {
    if (undoing) {
      return;
    }

    setUndoConfirmOpen(false);
  }

  /*
   * Performs timing repair.
   *
   * STEP 1:
   * Save previous durations.
   *
   * STEP 2:
   * Repair duration fields.
   *
   * STEP 3:
   * Persist both scenes and history.
   */
  async function handleConfirmRepair() {
    if (
      !timingContract
    ) {
      return;
    }

    setRepairing(true);

    setError("");

    setStatus("");

    try {
      const result =
        repairSceneTiming(
          scenes,
          timingContract
        );

      if (!result.changed) {
        setConfirmOpen(false);

        setStatus(
          "No scene durations needed repair."
        );

        return;
      }

      /*
       * Store the ORIGINAL durations
       * before saving repaired scenes.
       */
      const snapshot =
        createSceneTimingSnapshot(
          scenes
        );

      const nextHistory =
        writeSceneTimingSnapshot(
          history,
          snapshot
        );

      /*
       * Save scenes + undo history
       * together.
       */
      await updateProject(
        projectId,
        {
          scenes:
            result.scenes,

          history:
            nextHistory,
        }
      );

      setConfirmOpen(false);

      setStatus(
        `${result.repairedCount} scene${
          result.repairedCount ===
          1
            ? ""
            : "s"
        } repaired. Previous durations were saved for undo.`
      );

      router.refresh();
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Unable to repair scene timing."
        )
      );
    } finally {
      setRepairing(false);
    }
  }

  /*
   * Restores previous durations.
   *
   * No other scene content is changed.
   */
  async function handleConfirmUndo() {
    if (!undoSnapshot) {
      return;
    }

    setUndoing(true);

    setError("");

    setStatus("");

    try {
      const restoredScenes =
        restoreSceneDurations(
          scenes,
          undoSnapshot
        );

      const nextHistory =
        clearSceneTimingSnapshot(
          history
        );

      /*
       * Restore durations and remove
       * the consumed undo snapshot.
       */
      await updateProject(
        projectId,
        {
          scenes:
            restoredScenes,

          history:
            nextHistory,
        }
      );

      setUndoConfirmOpen(false);

      setStatus(
        "Last timing repair undone. Previous scene durations were restored."
      );

      router.refresh();
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Unable to undo the timing repair."
        )
      );
    } finally {
      setUndoing(false);
    }
  }

  /*
   * No timing contract and no undo
   * snapshot means there is nothing
   * useful for this panel to display.
   */
  if (
    !timingContract &&
    !canUndo
  ) {
    return null;
  }

  if (scenes.length === 0) {
    return null;
  }

  return (
    <>
      <section className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-6">

        {/* HEADER */}

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-500">
              Timing Repair
            </p>

            <h2 className="mt-2 text-xl font-bold text-zinc-100">
              🔧 Scene Timing Repair
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
              Repair scene durations
              to the production
              contract or restore the
              durations from the last
              timing repair.
            </p>
          </div>

          {validation?.valid ? (
            <span className="rounded-full border border-emerald-800 bg-emerald-950/30 px-3 py-1 text-xs font-semibold text-emerald-400">
              ✓ READY
            </span>
          ) : (
            <span className="rounded-full border border-amber-800 bg-amber-950/30 px-3 py-1 text-xs font-semibold text-amber-400">
              {
                mismatchedCount
              }
              {" TO REPAIR"}
            </span>
          )}
        </div>

        {/* METRICS */}

        {timingContract && (
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <RepairMetric
              label="Mismatched"
              value={
                `${mismatchedCount}`
              }
            />

            <RepairMetric
              label="Target Duration"
              value={
                `${timingContract.sceneDurationSeconds}s`
              }
            />

            <RepairMetric
              label="Target Runtime"
              value={
                `${timingContract.totalDurationSeconds}s`
              }
            />
          </div>
        )}

        {/* PROPOSED REPAIRS */}

        {mismatchedCount >
          0 && (
          <div className="mt-5 rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Proposed Changes
            </p>

            <div className="mt-3 space-y-2">
              {mismatchedScenes.map(
                (
                  issue
                ) => (
                  <div
                    key={
                      `${issue.sceneId}-${issue.sceneNumber}`
                    }
                    className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-zinc-300">
                        Scene{" "}
                        {
                          issue.sceneNumber
                        }
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        {
                          issue.title
                        }
                      </p>
                    </div>

                    <DurationChange
                      from={
                        issue.actualDuration
                      }
                      to={
                        issue.expectedDuration
                      }
                    />
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* UNDO AVAILABLE */}

        {undoSnapshot && (
          <div className="mt-5 rounded-lg border border-blue-900/60 bg-blue-950/20 p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-blue-400">
                  ↩ Undo available
                </p>

                <p className="mt-1 text-sm text-zinc-500">
                  Previous durations
                  from the last timing
                  repair are stored.
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  Saved{" "}
                  {
                    formatSnapshotDate(
                      undoSnapshot.createdAt
                    )
                  }
                </p>
              </div>

              <button
                type="button"
                onClick={
                  handleOpenUndo
                }
                disabled={
                  repairing ||
                  undoing
                }
                className="rounded-lg border border-blue-800 bg-blue-950/30 px-4 py-2 font-semibold text-blue-300 transition hover:bg-blue-900/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ↩ Undo Last Repair
              </button>
            </div>
          </div>
        )}

        {/* ACTIONS */}

        {mismatchedCount >
          0 && (
          <button
            type="button"
            onClick={
              handleOpenConfirmation
            }
            disabled={
              repairing ||
              undoing
            }
            className="mt-5 rounded-lg bg-amber-600 px-5 py-3 font-semibold text-white transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {`🔧 Review & Repair ${mismatchedCount} Scene${
              mismatchedCount ===
              1
                ? ""
                : "s"
            }`}
          </button>
        )}

        {validation?.valid &&
          !canUndo && (
          <div className="mt-5 rounded-lg border border-emerald-900/60 bg-emerald-950/20 p-4 text-sm text-emerald-400">
            ✓ All scene durations
            match the production
            contract.
          </div>
        )}

        {status && (
          <div className="mt-4 rounded-lg border border-emerald-800 bg-emerald-950/30 p-4 text-sm text-emerald-400">
            {
              status
            }
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-lg border border-red-800 bg-red-950/30 p-4 text-sm text-red-400">
            {
              error
            }
          </div>
        )}
      </section>

      {/* =============================== */}
      {/* REPAIR CONFIRMATION             */}
      {/* =============================== */}

      {confirmOpen &&
        timingContract && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl">
            <div className="border-b border-zinc-800 p-6">
              <h2 className="text-2xl font-bold text-white">
                Repair Scene Timing?
              </h2>

              <p className="mt-2 text-sm text-zinc-400">
                The current durations
                will be stored so this
                repair can be undone.
              </p>
            </div>

            <div className="max-h-[55vh] overflow-y-auto p-6">
              <div className="space-y-3">
                {mismatchedScenes.map(
                  (
                    issue
                  ) => (
                    <div
                      key={
                        `confirm-${issue.sceneId}-${issue.sceneNumber}`
                      }
                      className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-zinc-800 bg-zinc-950 p-4"
                    >
                      <div>
                        <p className="font-semibold text-white">
                          Scene{" "}
                          {
                            issue.sceneNumber
                          }
                        </p>

                        <p className="mt-1 text-sm text-zinc-500">
                          {
                            issue.title
                          }
                        </p>
                      </div>

                      <DurationChange
                        from={
                          issue.actualDuration
                        }
                        to={
                          issue.expectedDuration
                        }
                      />
                    </div>
                  )
                )}
              </div>

              <div className="mt-6 rounded-lg border border-emerald-900/60 bg-emerald-950/20 p-4">
                <p className="font-semibold text-emerald-400">
                  ✓ Previous durations
                  will be saved
                </p>

                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Only scene duration
                  values are repaired.
                  All scene content,
                  prompts, and assets
                  remain unchanged.
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-zinc-800 p-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={
                  handleCancelRepair
                }
                disabled={
                  repairing
                }
                className="rounded-lg border border-zinc-700 px-5 py-3 font-semibold text-zinc-300"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleConfirmRepair
                }
                disabled={
                  repairing
                }
                className="rounded-lg bg-amber-600 px-5 py-3 font-semibold text-white disabled:opacity-50"
              >
                {repairing
                  ? "🔧 Repairing..."
                  : "Confirm Repair"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =============================== */}
      {/* UNDO CONFIRMATION               */}
      {/* =============================== */}

      {undoConfirmOpen &&
        undoSnapshot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl">
            <div className="border-b border-zinc-800 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-400">
                Undo Timing Repair
              </p>

              <h2 className="mt-2 text-2xl font-bold text-white">
                Restore Previous
                Durations?
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-400">
                These scene durations
                will be restored to
                their values before
                the last timing repair.
              </p>
            </div>

            <div className="max-h-[55vh] overflow-y-auto p-6">
              <div className="space-y-3">
                {undoSnapshot
                  .previousDurations
                  .map(
                    (
                      previous
                    ) => {
                      const scene =
                        scenes.find(
                          (
                            item
                          ) =>
                            item.id ===
                            previous.sceneId
                        );

                      if (!scene) {
                        return null;
                      }

                      if (
                        scene.duration ===
                        previous.duration
                      ) {
                        return null;
                      }

                      return (
                        <div
                          key={
                            `undo-${previous.sceneId}`
                          }
                          className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-zinc-800 bg-zinc-950 p-4"
                        >
                          <div>
                            <p className="font-semibold text-white">
                              {
                                scene.title
                              }
                            </p>

                            <p className="mt-1 text-xs text-zinc-500">
                              Scene ID{" "}
                              {
                                scene.id
                              }
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm font-semibold text-zinc-400">
                              {
                                scene.duration
                              }
                            </span>

                            <span className="text-zinc-600">
                              →
                            </span>

                            <span className="rounded-md border border-blue-900 bg-blue-950/30 px-3 py-1.5 text-sm font-semibold text-blue-400">
                              {
                                previous.duration
                              }
                            </span>
                          </div>
                        </div>
                      );
                    }
                  )}
              </div>

              <div className="mt-6 rounded-lg border border-blue-900/60 bg-blue-950/20 p-4">
                <p className="font-semibold text-blue-400">
                  ↩ Duration-only undo
                </p>

                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Titles, narration,
                  visuals, prompts,
                  transitions, and
                  assets will not be
                  changed.
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-zinc-800 p-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={
                  handleCancelUndo
                }
                disabled={
                  undoing
                }
                className="rounded-lg border border-zinc-700 px-5 py-3 font-semibold text-zinc-300"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleConfirmUndo
                }
                disabled={
                  undoing
                }
                className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white disabled:opacity-50"
              >
                {undoing
                  ? "↩ Restoring..."
                  : "↩ Confirm Undo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function RepairMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-600">
        {
          label
        }
      </p>

      <p className="mt-2 text-xl font-bold text-zinc-200">
        {
          value
        }
      </p>
    </div>
  );
}

function DurationChange({
  from,
  to,
}: {
  from: number;
  to: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="rounded-md border border-red-900 bg-red-950/30 px-3 py-1.5 text-sm font-semibold text-red-400">
        {
          from
        }
        s
      </span>

      <span className="text-zinc-600">
        →
      </span>

      <span className="rounded-md border border-emerald-900 bg-emerald-950/30 px-3 py-1.5 text-sm font-semibold text-emerald-400">
        {
          to
        }
        s
      </span>
    </div>
  );
}

function formatSnapshotDate(
  value: string
) {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toLocaleString();
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