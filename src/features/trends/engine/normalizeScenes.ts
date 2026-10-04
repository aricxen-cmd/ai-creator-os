import type {
  Scene,
} from "@/features/scenes/types";

import type {
  SceneContract,
} from "./sceneContracts";

export interface NormalizeScenesResult {
  scenes: Scene[];

  changed: boolean;

  added: number;

  removed: number;
}

export function normalizeScenes(
  scenes: Scene[],
  contract: SceneContract
): NormalizeScenesResult {
  if (
    contract.expectedScenes <= 0
  ) {
    return {
      scenes:
        reindexScenes(
          scenes
        ),

      changed: false,

      added: 0,

      removed: 0,
    };
  }

  const target =
    contract.expectedScenes;

  const originalCount =
    scenes.length;

  let normalized =
    [...scenes];

  /*
   * TOO MANY SCENES
   *
   * Keep only the number required
   * by the active Trend contract.
   */
  if (
    normalized.length >
    target
  ) {
    normalized =
      normalized.slice(
        0,
        target
      );
  }

  /*
   * TOO FEW SCENES
   *
   * Add structured placeholder
   * scenes until the exact
   * contract count is reached.
   *
   * These placeholders will later
   * be filled by the Phase 5 AI
   * repair/generation step.
   */
  while (
    normalized.length <
    target
  ) {
    const index =
      normalized.length;

    normalized.push(
      createContractScene(
        index + 1,
        contract
      )
    );
  }

  normalized =
    reindexScenes(
      normalized
    );

  return {
    scenes:
      normalized,

    changed:
      originalCount !==
      normalized.length,

    added:
      Math.max(
        0,
        target -
          originalCount
      ),

    removed:
      Math.max(
        0,
        originalCount -
          target
      ),
  };
}

function createContractScene(
  id: number,
  contract: SceneContract
): Scene {
  const role =
    getSceneRole(
      id,
      contract
    );

  const duration =
    contract.secondsPerScene
      ? `${contract.secondsPerScene}s`
      : "";

  return {
    id,

    title:
      role ||
      `Scene ${id}`,

    narration:
      contract.narrationRequired
        ? `[Generate narration for ${role || `Scene ${id}`}]`
        : "",

    visual:
      `[Generate contract-compliant visual for ${
        role ||
        `Scene ${id}`
      }]`,

    camera:
      "",

    motion:
      "",

    duration,

    transition:
      id <
      contract.expectedScenes
        ? "Continue into the next scene with a clear visual handoff."
        : "Final hold / ending.",

    imagePrompt:
      "",

    videoPrompt:
      "",

    voicePrompt:
      contract.nativeAudioRequired
        ? "[Generate native audio instructions]"
        : "",
  };
}

function getSceneRole(
  id: number,
  contract: SceneContract
) {
  const total =
    contract.expectedScenes;

  if (
    total <= 0
  ) {
    return "";
  }

  /*
   * FORMAT-SPECIFIC ROLES
   */

  switch (
    contract.formatId
  ) {
    case "brainrot":
      return getBrainrotRole(
        id,
        total
      );

    case "clay-story":
      return getClayRole(
        id,
        total
      );

    case "animal-haircut":
      return getHaircutRole(
        id,
        total
      );

    case "anatomy-fitness":
      return getAnatomyRole(
        id,
        total
      );

    case "car-evolution":
      return getCarRole(
        id,
        total
      );

    default:
      return getGenericRole(
        id,
        total
      );
  }
}

function getBrainrotRole(
  id: number,
  total: number
) {
  if (id === 1) {
    return "Hook";
  }

  if (id === total) {
    return "Karma / Payoff";
  }

  if (
    id === total - 1
  ) {
    return "Final Escalation";
  }

  if (
    id <=
    Math.ceil(
      total * 0.4
    )
  ) {
    return "Escalation";
  }

  return "Consequence";
}

function getClayRole(
  id: number,
  total: number
) {
  if (id === 1) {
    return "Hook";
  }

  if (id === total) {
    return "Payoff / Cliffhanger";
  }

  if (
    id === total - 1
  ) {
    return "Reveal";
  }

  if (
    id <=
    Math.ceil(
      total / 2
    )
  ) {
    return "Conflict";
  }

  return "Escalation";
}

function getHaircutRole(
  id: number,
  total: number
) {
  if (
    total === 1
  ) {
    return "Before → Hero Transformation";
  }

  if (id === 1) {
    return "Before → Mid-Cut";
  }

  if (id === total) {
    return "Styling → Hero Reveal";
  }

  return "Grooming Progress";
}

function getAnatomyRole(
  id: number,
  total: number
) {
  if (id === 1) {
    return "Hook";
  }

  if (id === total) {
    return "Hero Shot";
  }

  if (id === 2) {
    return "Diagnosis";
  }

  if (
    id === total - 1
  ) {
    return "Progress";
  }

  return "Exercise";
}

function getCarRole(
  id: number,
  total: number
) {
  if (id === 1) {
    return "Starting Era";
  }

  if (id === total) {
    return "Final Era";
  }

  return "Mechanical Evolution";
}

function getGenericRole(
  id: number,
  total: number
) {
  if (id === 1) {
    return "Hook";
  }

  if (id === total) {
    return "Ending";
  }

  return `Scene ${id}`;
}

function reindexScenes(
  scenes: Scene[]
) {
  return scenes.map(
    (
      scene,
      index
    ) => ({
      ...scene,

      id:
        index + 1,

      title:
        scene.title?.trim() ||
        `Scene ${index + 1}`,
    })
  );
}