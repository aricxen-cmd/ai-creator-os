import type {
  Scene,
} from "@/features/scenes/types";

import type {
  SceneContract,
  SceneContractValidation,
} from "./sceneContracts";

export function validateSceneContract(
  scenes: Scene[],
  contract: SceneContract
): SceneContractValidation {
  const errors: string[] =
    [];

  const warnings: string[] =
    [];

  const actualScenes =
    scenes.length;

  if (
    contract.expectedScenes >
      0 &&
    actualScenes !==
      contract.expectedScenes
  ) {
    errors.push(
      `Expected ${contract.expectedScenes} scenes, but found ${actualScenes}.`
    );
  }

  if (
    contract.narrationRequired
  ) {
    const missingNarration =
      scenes.filter(
        (scene) =>
          !scene.narration?.trim()
      );

    if (
      missingNarration.length
    ) {
      errors.push(
        `${missingNarration.length} scene(s) are missing narration.`
      );
    }
  }

  const missingVisual =
    scenes.filter(
      (scene) =>
        !scene.visual?.trim()
    );

  if (
    missingVisual.length
  ) {
    errors.push(
      `${missingVisual.length} scene(s) are missing visual descriptions.`
    );
  }

  const missingCamera =
    scenes.filter(
      (scene) =>
        !scene.camera?.trim()
    );

  if (
    missingCamera.length
  ) {
    warnings.push(
      `${missingCamera.length} scene(s) are missing camera instructions.`
    );
  }

  const missingMotion =
    scenes.filter(
      (scene) =>
        !scene.motion?.trim()
    );

  if (
    missingMotion.length
  ) {
    warnings.push(
      `${missingMotion.length} scene(s) are missing motion instructions.`
    );
  }

  if (
    contract.secondsPerScene
  ) {
    const durationProblems =
      scenes.filter(
        (scene) => {
          if (
            !scene.duration
          ) {
            return true;
          }

          const value =
            parseFloat(
              scene.duration
            );

          if (
            Number.isNaN(
              value
            )
          ) {
            return true;
          }

          return (
            Math.abs(
              value -
                contract.secondsPerScene!
            ) > 1
          );
        }
      );

    if (
      durationProblems.length
    ) {
      warnings.push(
        `${durationProblems.length} scene(s) do not match the expected ~${contract.secondsPerScene}s duration.`
      );
    }
  }

  if (
    contract.continuityRequired &&
    scenes.length > 1
  ) {
    const withoutTransition =
      scenes
        .slice(
          0,
          -1
        )
        .filter(
          (scene) =>
            !scene.transition?.trim()
        );

    if (
      withoutTransition.length
    ) {
      warnings.push(
        `${withoutTransition.length} scene(s) have no transition/handoff information.`
      );
    }
  }

  return {
    pass:
      errors.length === 0,

    expectedScenes:
      contract.expectedScenes,

    actualScenes,

    errors,

    warnings,
  };
}