import type {
  Scene,
} from "@/features/scenes/types";

export interface SceneDurationSnapshot {
  sceneId: number;
  duration: string;
}

export interface SceneTimingRepairSnapshot {
  type: "scene-timing-repair";
  createdAt: string;
  previousDurations: SceneDurationSnapshot[];
}

export interface ProjectHistoryWithTiming {
  sceneTimingRepair?: SceneTimingRepairSnapshot;
  [key: string]: unknown;
}

/**
 * Creates a snapshot containing ONLY
 * the previous duration values.
 *
 * We do not duplicate complete scenes
 * into project history.
 */
export function createSceneTimingSnapshot(
  scenes: Scene[]
): SceneTimingRepairSnapshot {
  return {
    type: "scene-timing-repair",

    createdAt:
      new Date().toISOString(),

    previousDurations:
      scenes.map(
        (scene) => ({
          sceneId:
            scene.id,

          duration:
            scene.duration,
        })
      ),
  };
}

/**
 * Safely reads our timing snapshot
 * from project.history.
 */
export function readSceneTimingSnapshot(
  history: unknown
): SceneTimingRepairSnapshot | null {
  if (
    typeof history !== "object" ||
    history === null ||
    Array.isArray(history)
  ) {
    return null;
  }

  const projectHistory =
    history as ProjectHistoryWithTiming;

  const snapshot =
    projectHistory.sceneTimingRepair;

  if (
    !snapshot ||
    snapshot.type !==
      "scene-timing-repair" ||
    !Array.isArray(
      snapshot.previousDurations
    )
  ) {
    return null;
  }

  return snapshot;
}

/**
 * Adds/replaces the most recent timing
 * repair snapshot while preserving all
 * unrelated history data.
 */
export function writeSceneTimingSnapshot(
  history: unknown,
  snapshot: SceneTimingRepairSnapshot
): ProjectHistoryWithTiming {
  const existingHistory =
    typeof history === "object" &&
    history !== null &&
    !Array.isArray(history)
      ? (
          history as Record<
            string,
            unknown
          >
        )
      : {};

  return {
    ...existingHistory,

    sceneTimingRepair:
      snapshot,
  };
}

/**
 * Removes ONLY our timing-repair
 * snapshot after a successful undo.
 *
 * Other project history is preserved.
 */
export function clearSceneTimingSnapshot(
  history: unknown
): ProjectHistoryWithTiming {
  if (
    typeof history !== "object" ||
    history === null ||
    Array.isArray(history)
  ) {
    return {};
  }

  const {
    sceneTimingRepair:
      _sceneTimingRepair,
    ...remainingHistory
  } =
    history as Record<
      string,
      unknown
    >;

  return remainingHistory;
}

/**
 * Restores duration values from the
 * saved snapshot.
 *
 * IMPORTANT:
 * Only scene.duration is changed.
 */
export function restoreSceneDurations(
  scenes: Scene[],
  snapshot: SceneTimingRepairSnapshot
): Scene[] {
  const previousDurationMap =
    new Map<
      number,
      string
    >(
      snapshot.previousDurations.map(
        (item) => [
          item.sceneId,
          item.duration,
        ]
      )
    );

  return scenes.map(
    (scene) => {
      const previousDuration =
        previousDurationMap.get(
          scene.id
        );

      if (
        previousDuration ===
        undefined
      ) {
        return scene;
      }

      return {
        ...scene,

        duration:
          previousDuration,
      };
    }
  );
}