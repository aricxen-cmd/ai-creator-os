export interface TrendTimingContract {
  formatId: string;
  durationLabel: string;
  totalDurationSeconds: number;
  sceneCount: number;
  sceneDurationSeconds: number;
  exact: boolean;
  description: string;
}

interface TimingRule {
  duration: number;
  sceneCount: number;
  sceneDuration: number;
}

/*
 * Exact timing rules already established
 * by the Trend Contract / Scene Contract work.
 */
const timingRules: Record<
  string,
  TimingRule[]
> = {
  brainrot: [
    {
      duration: 35,
      sceneCount: 7,
      sceneDuration: 5,
    },
    {
      duration: 45,
      sceneCount: 9,
      sceneDuration: 5,
    },
    {
      duration: 65,
      sceneCount: 13,
      sceneDuration: 5,
    },
  ],

  "clay-story": [
    {
      duration: 42,
      sceneCount: 7,
      sceneDuration: 6,
    },
    {
      duration: 54,
      sceneCount: 9,
      sceneDuration: 6,
    },
    {
      duration: 60,
      sceneCount: 10,
      sceneDuration: 6,
    },
  ],

  "animal-haircut": [
    {
      duration: 10,
      sceneCount: 1,
      sceneDuration: 10,
    },
    {
      duration: 20,
      sceneCount: 2,
      sceneDuration: 10,
    },
  ],

  "anatomy-fitness": [
    {
      duration: 15,
      sceneCount: 3,
      sceneDuration: 5,
    },
    {
      duration: 20,
      sceneCount: 4,
      sceneDuration: 5,
    },
    {
      duration: 25,
      sceneCount: 5,
      sceneDuration: 5,
    },
    {
      duration: 30,
      sceneCount: 6,
      sceneDuration: 5,
    },
    {
      duration: 35,
      sceneCount: 7,
      sceneDuration: 5,
    },
    {
      duration: 40,
      sceneCount: 8,
      sceneDuration: 5,
    },
    {
      duration: 45,
      sceneCount: 9,
      sceneDuration: 5,
    },
    {
      duration: 65,
      sceneCount: 13,
      sceneDuration: 5,
    },
  ],

  "car-evolution": [
    {
      duration: 20,
      sceneCount: 2,
      sceneDuration: 10,
    },
    {
      duration: 30,
      sceneCount: 3,
      sceneDuration: 10,
    },
    {
      duration: 40,
      sceneCount: 4,
      sceneDuration: 10,
    },
    {
      duration: 60,
      sceneCount: 6,
      sceneDuration: 10,
    },
  ],
};

export function parseDurationSeconds(
  value: unknown
) {
  if (
    typeof value !== "string"
  ) {
    return 0;
  }

  const match =
    value.match(/\d+/);

  return match
    ? Number(match[0])
    : 0;
}

export function getTrendTimingContract(
  trend: Record<
    string,
    unknown
  > | null
): TrendTimingContract | null {
  if (!trend) {
    return null;
  }

  const formatId =
    typeof trend.trendFormatId ===
    "string"
      ? trend.trendFormatId
      : "";

  const durationLabel =
    typeof trend.duration ===
    "string"
      ? trend.duration
      : "";

  const totalDurationSeconds =
    parseDurationSeconds(
      durationLabel
    );

  if (
    !formatId ||
    !totalDurationSeconds
  ) {
    return null;
  }

  const rules =
    timingRules[
      formatId
    ] ?? [];

  const exactRule =
    rules.find(
      (rule) =>
        rule.duration ===
        totalDurationSeconds
    );

  if (exactRule) {
    return {
      formatId,

      durationLabel,

      totalDurationSeconds,

      sceneCount:
        exactRule.sceneCount,

      sceneDurationSeconds:
        exactRule.sceneDuration,

      exact: true,

      description:
        `${exactRule.sceneCount} scenes × ${exactRule.sceneDuration}s = ${totalDurationSeconds}s`,
    };
  }

  /*
   * Generic deterministic fallback.
   *
   * New trend formats currently use
   * 5-second production beats unless
   * an explicit format rule exists.
   */
  const sceneDurationSeconds =
    5;

  const sceneCount =
    Math.max(
      1,
      Math.ceil(
        totalDurationSeconds /
          sceneDurationSeconds
      )
    );

  return {
    formatId,

    durationLabel,

    totalDurationSeconds,

    sceneCount,

    sceneDurationSeconds,

    exact:
      totalDurationSeconds %
        sceneDurationSeconds ===
      0,

    description:
      `${sceneCount} scenes × ${sceneDurationSeconds}s`,
  };
}

export function readTrendFromSettings(
  settings: unknown
):
  | Record<
      string,
      unknown
    >
  | null {
  if (
    !settings ||
    typeof settings !==
      "object" ||
    Array.isArray(
      settings
    )
  ) {
    return null;
  }

  const object =
    settings as Record<
      string,
      unknown
    >;

  if (
    object.trend &&
    typeof object.trend ===
      "object" &&
    !Array.isArray(
      object.trend
    )
  ) {
    return object.trend as Record<
      string,
      unknown
    >;
  }

  if (
    typeof object.trendFormatId ===
      "string"
  ) {
    return {
      trendFormatId:
        object.trendFormatId,

      trendFormatTitle:
        object.trendFormatTitle,

      duration:
        object.duration,

      structureFamily:
        object.structureFamily,

      audioMode:
        object.audioMode,

      style:
        object.style,

      productionRules:
        object.productionRules,

      options:
        object.trendOptions,
    };
  }

  return null;
}

export function buildStoryboardTimingInstructions(
  contract:
    TrendTimingContract | null
) {
  if (!contract) {
    return "";
  }

  return `
STRICT TIMING CONTRACT

Total runtime:
${contract.totalDurationSeconds} seconds

Exact scene count:
${contract.sceneCount}

Exact duration per scene:
${contract.sceneDurationSeconds} seconds

REQUIRED:
- Return exactly ${contract.sceneCount} scenes.
- Number scenes from 1 through ${contract.sceneCount}.
- Every scene must explicitly say "Duration: ${contract.sceneDurationSeconds}s".
- Do not create extra scenes.
- Do not merge scenes.
- Do not omit scenes.
- Keep every scene within its assigned ${contract.sceneDurationSeconds}-second beat.
- The storyboard must total exactly ${contract.totalDurationSeconds} seconds.
`.trim();
}

export interface SceneTimingValidation {
  valid: boolean;

  expectedSceneCount: number;

  actualSceneCount: number;

  expectedSceneDuration: number;

  totalDurationSeconds: number;

  sceneCountValid: boolean;

  durationValid: boolean;

  message: string;
}

export function validateStoryboardTiming(
  storyboard: string,
  contract:
    TrendTimingContract | null
): SceneTimingValidation | null {
  if (!contract) {
    return null;
  }

  /*
   * Storyboard generator uses numbered
   * Scene headings. Count only headings,
   * not every mention of the word scene.
   */
  const sceneMatches =
    storyboard.match(
      /(?:^|\n)\s*(?:#{1,4}\s*)?(?:scene\s*)?#?\s*\d+\s*(?:[-:.)]|$)/gim
    ) ?? [];

  let actualSceneCount =
    sceneMatches.length;

  /*
   * Fallback for outputs such as:
   * Scene 1
   * Scene 2
   */
  if (
    actualSceneCount === 0
  ) {
    actualSceneCount =
      (
        storyboard.match(
          /(?:^|\n)\s*(?:#{1,4}\s*)?scene\s+\d+/gim
        ) ?? []
      ).length;
  }

  const durationMatches =
    [
      ...storyboard.matchAll(
        /duration\s*:\s*(\d+(?:\.\d+)?)\s*s(?:ec(?:ond)?s?)?/gi
      ),
    ];

  const durations =
    durationMatches.map(
      (match) =>
        Number(
          match[1]
        )
    );

  const sceneCountValid =
    actualSceneCount ===
    contract.sceneCount;

  const durationValid =
    durations.length ===
      contract.sceneCount &&
    durations.every(
      (duration) =>
        duration ===
        contract.sceneDurationSeconds
    );

  const valid =
    sceneCountValid &&
    durationValid;

  let message =
    `Expected ${contract.sceneCount} scenes × ${contract.sceneDurationSeconds}s.`;

  if (valid) {
    message =
      `Timing locked: ${contract.sceneCount} scenes × ${contract.sceneDurationSeconds}s = ${contract.totalDurationSeconds}s.`;
  } else if (
    !sceneCountValid
  ) {
    message =
      `Scene count mismatch: expected ${contract.sceneCount}, found ${actualSceneCount}.`;
  } else if (
    !durationValid
  ) {
    message =
      `Scene durations do not match the required ${contract.sceneDurationSeconds}s per scene.`;
  }

  return {
    valid,

    expectedSceneCount:
      contract.sceneCount,

    actualSceneCount,

    expectedSceneDuration:
      contract.sceneDurationSeconds,

    totalDurationSeconds:
      contract.totalDurationSeconds,

    sceneCountValid,

    durationValid,

    message,
  };
}