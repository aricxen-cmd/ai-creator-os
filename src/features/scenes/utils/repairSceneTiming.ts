import type {
  Scene,
} from "@/features/scenes/types";

import type {
  TrendTimingContract,
} from "@/features/trends/utils/trendTimingContract";

import {
  parseSceneDuration,
} from "@/features/scenes/utils/validateSceneTiming";

export interface SceneTimingRepairResult {
  scenes: Scene[];

  repairedSceneIds: number[];

  repairedCount: number;

  changed: boolean;
}

/**
 * Repairs scene duration values so
 * they match the Trend Production
 * Contract.
 *
 * IMPORTANT:
 * This function changes ONLY the
 * duration field.
 *
 * It preserves:
 * - title
 * - narration
 * - visual
 * - camera
 * - motion
 * - transition
 * - imagePrompt
 * - videoPrompt
 * - voicePrompt
 * - assets
 */
export function repairSceneTiming(
  scenes: Scene[],
  contract:
    TrendTimingContract | null
): SceneTimingRepairResult {
  /*
   * No contract means there is
   * nothing to repair.
   */
  if (!contract) {
    return {
      scenes,
      repairedSceneIds: [],
      repairedCount: 0,
      changed: false,
    };
  }

  const expectedDuration =
    contract.sceneDurationSeconds;

  const repairedSceneIds:
    number[] = [];

  /*
   * Create a new scene array.
   *
   * Original scene objects are
   * preserved unless their duration
   * needs to change.
   */
  const repairedScenes =
    scenes.map(
      (scene) => {
        const actualDuration =
          parseSceneDuration(
            scene.duration
          );

        /*
         * Already correct.
         */
        if (
          actualDuration ===
          expectedDuration
        ) {
          return scene;
        }

        repairedSceneIds.push(
          scene.id
        );

        /*
         * Spread the complete original
         * scene first.
         *
         * Then overwrite ONLY duration.
         */
        return {
          ...scene,

          duration:
            `${expectedDuration}s`,
        };
      }
    );

  return {
    scenes:
      repairedScenes,

    repairedSceneIds,

    repairedCount:
      repairedSceneIds.length,

    changed:
      repairedSceneIds.length >
      0,
  };
}