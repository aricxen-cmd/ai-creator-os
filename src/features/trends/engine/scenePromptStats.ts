import type {
  Scene,
} from "@/features/scenes/types";

import {
  validateScenePromptQuality,
} from "./validateScenePromptQuality";

export interface ScenePromptStats {
  totalScenes: number;

  readyScenes: number;

  needsWorkScenes: number;

  imagePrompts: number;

  videoPrompts: number;

  voicePrompts: number;

  narrationScenes: number;

  completionPercent: number;
}

export function getScenePromptStats(
  scenes: Scene[]
): ScenePromptStats {
  const totalScenes =
    scenes.length;

  const readyScenes =
    scenes.filter(
      (scene) =>
        validateScenePromptQuality(
          scene
        ).pass
    ).length;

  const needsWorkScenes =
    totalScenes -
    readyScenes;

  const imagePrompts =
    scenes.filter(
      (scene) =>
        Boolean(
          scene.imagePrompt?.trim()
        )
    ).length;

  const videoPrompts =
    scenes.filter(
      (scene) =>
        Boolean(
          scene.videoPrompt?.trim()
        )
    ).length;

  const voicePrompts =
    scenes.filter(
      (scene) =>
        Boolean(
          scene.voicePrompt?.trim()
        )
    ).length;

  const narrationScenes =
    scenes.filter(
      (scene) =>
        Boolean(
          scene.narration?.trim()
        )
    ).length;

  const completionPercent =
    totalScenes === 0
      ? 0
      : Math.round(
          (
            readyScenes /
            totalScenes
          ) * 100
        );

  return {
    totalScenes,

    readyScenes,

    needsWorkScenes,

    imagePrompts,

    videoPrompts,

    voicePrompts,

    narrationScenes,

    completionPercent,
  };
}