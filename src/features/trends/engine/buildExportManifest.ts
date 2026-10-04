import type {
  Scene,
} from "@/features/scenes/types";

import type {
  TrendProjectSettings,
} from "../utils/projectTrendContract";

import {
  validateScenePromptQuality,
} from "./validateScenePromptQuality";

export interface ExportManifest {
  version: string;

  createdAt: string;

  projectId: string;

  projectTitle: string;

  trendFormat?: string;

  topic?: string;

  duration?: string;

  readySceneCount: number;

  skippedSceneCount: number;

  scenes: {
    id: number;

    title: string;

    duration: string;

    imagePrompt: string;

    videoPrompt: string;

    voicePrompt: string;

    narration: string;
  }[];
}

interface BuildExportManifestInput {
  projectId: string;

  projectTitle: string;

  scenes: Scene[];

  settings:
    TrendProjectSettings | null;
}

export function buildExportManifest({
  projectId,
  projectTitle,
  scenes,
  settings,
}: BuildExportManifestInput): ExportManifest {
  const readyScenes =
    scenes.filter(
      (scene) =>
        validateScenePromptQuality(
          scene
        ).pass
    );

  return {
    version:
      "AI Creator OS Export Manifest v1",

    createdAt:
      new Date().toISOString(),

    projectId,

    projectTitle,

    trendFormat:
      settings?.trendFormatTitle,

    topic:
      settings?.topic,

    duration:
      settings?.duration,

    readySceneCount:
      readyScenes.length,

    skippedSceneCount:
      scenes.length -
      readyScenes.length,

    scenes:
      readyScenes.map(
        (scene) => ({
          id:
            scene.id,

          title:
            scene.title,

          duration:
            scene.duration ||
            "",

          imagePrompt:
            scene.imagePrompt ||
            "",

          videoPrompt:
            scene.videoPrompt ||
            "",

          voicePrompt:
            scene.voicePrompt ||
            "",

          narration:
            scene.narration ||
            "",
        })
      ),
  };
}