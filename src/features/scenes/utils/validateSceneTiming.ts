import type {
  Scene,
} from "@/features/scenes/types";

import type {
  TrendTimingContract,
} from "@/features/trends/utils/trendTimingContract";

export interface SceneTimingIssue {
  sceneId: number;

  sceneNumber: number;

  title: string;

  actualDuration: number;

  expectedDuration: number;

  message: string;
}

export interface SceneTimingResult {
  valid: boolean;

  expectedSceneCount: number;

  actualSceneCount: number;

  expectedSceneDuration: number;

  expectedTotalDuration: number;

  actualTotalDuration: number;

  sceneCountValid: boolean;

  totalDurationValid: boolean;

  durationValid: boolean;

  mismatchedScenes:
    SceneTimingIssue[];

  missingSceneCount: number;

  extraSceneCount: number;
}

export function parseSceneDuration(
  duration: unknown
) {
  if (
    typeof duration ===
    "number" &&
    Number.isFinite(duration)
  ) {
    return duration;
  }

  if (
    typeof duration !==
    "string"
  ) {
    return 0;
  }

  const match =
    duration.match(
      /(\d+(?:\.\d+)?)/
    );

  if (!match) {
    return 0;
  }

  const value =
    Number(match[1]);

  return Number.isFinite(
    value
  )
    ? value
    : 0;
}

export function validateSceneTiming(
  scenes: Scene[],
  contract:
    TrendTimingContract | null
): SceneTimingResult | null {
  if (!contract) {
    return null;
  }

  const expectedSceneCount =
    contract.sceneCount;

  const expectedSceneDuration =
    contract.sceneDurationSeconds;

  const expectedTotalDuration =
    contract.totalDurationSeconds;

  const actualSceneCount =
    scenes.length;

  const mismatchedScenes:
    SceneTimingIssue[] = [];

  let actualTotalDuration =
    0;

  scenes.forEach(
    (
      scene,
      index
    ) => {
      const actualDuration =
        parseSceneDuration(
          scene.duration
        );

      actualTotalDuration +=
        actualDuration;

      if (
        actualDuration !==
        expectedSceneDuration
      ) {
        mismatchedScenes.push(
          {
            sceneId:
              scene.id,

            sceneNumber:
              index + 1,

            title:
              scene.title ||
              `Scene ${index + 1}`,

            actualDuration,

            expectedDuration:
              expectedSceneDuration,

            message:
              actualDuration > 0
                ? `Scene ${index + 1} is ${actualDuration}s but should be ${expectedSceneDuration}s.`
                : `Scene ${index + 1} has no valid duration and should be ${expectedSceneDuration}s.`,
          }
        );
      }
    }
  );

  const sceneCountValid =
    actualSceneCount ===
    expectedSceneCount;

  const durationValid =
    mismatchedScenes.length ===
    0;

  const totalDurationValid =
    actualTotalDuration ===
    expectedTotalDuration;

  return {
    valid:
      sceneCountValid &&
      durationValid &&
      totalDurationValid,

    expectedSceneCount,

    actualSceneCount,

    expectedSceneDuration,

    expectedTotalDuration,

    actualTotalDuration,

    sceneCountValid,

    totalDurationValid,

    durationValid,

    mismatchedScenes,

    missingSceneCount:
      Math.max(
        0,
        expectedSceneCount -
          actualSceneCount
      ),

    extraSceneCount:
      Math.max(
        0,
        actualSceneCount -
          expectedSceneCount
      ),
  };
}