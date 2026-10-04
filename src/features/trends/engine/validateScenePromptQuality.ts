import type {
  Scene,
} from "@/features/scenes/types";

export interface ScenePromptQualityResult {
  pass: boolean;

  errors: string[];

  warnings: string[];
}

export function validateScenePromptQuality(
  scene: Scene
): ScenePromptQualityResult {
  const errors: string[] = [];

  const warnings: string[] = [];

  if (!scene.visual?.trim()) {
    errors.push(
      "Visual description is missing."
    );
  }

  if (!scene.imagePrompt?.trim()) {
    errors.push(
      "Image prompt is missing."
    );
  }

  if (!scene.videoPrompt?.trim()) {
    errors.push(
      "Video prompt is missing."
    );
  }

  if (!scene.camera?.trim()) {
    warnings.push(
      "Camera direction is missing."
    );
  }

  if (!scene.motion?.trim()) {
    warnings.push(
      "Motion direction is missing."
    );
  }

  if (!scene.duration?.trim()) {
    warnings.push(
      "Scene duration is missing."
    );
  }

  if (!scene.transition?.trim()) {
    warnings.push(
      "Transition or scene handoff is missing."
    );
  }

  if (
    scene.imagePrompt &&
    scene.imagePrompt.trim().length <
      80
  ) {
    warnings.push(
      "Image prompt may be too short for reliable visual consistency."
    );
  }

  if (
    scene.videoPrompt &&
    scene.videoPrompt.trim().length <
      80
  ) {
    warnings.push(
      "Video prompt may be too short for reliable animation direction."
    );
  }

  return {
    pass:
      errors.length === 0,

    errors,

    warnings,
  };
}