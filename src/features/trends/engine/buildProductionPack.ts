import type {
  Scene,
} from "@/features/scenes/types";

import type {
  TrendProjectSettings,
} from "../utils/projectTrendContract";

import {
  getScenePromptStats,
} from "./scenePromptStats";

export interface ProductionPack {
  version: string;

  exportedAt: string;

  project: {
    id: string;

    title: string;
  };

  trend: {
    formatId?: string;

    formatTitle?: string;

    topic?: string;

    duration?: string;

    structure?: string;

    audioMode?: string;

    style?: string;

    model?: string;
  };

  stats: {
    totalScenes: number;

    readyScenes: number;

    needsWorkScenes: number;

    completionPercent: number;

    imagePrompts: number;

    videoPrompts: number;

    voicePrompts: number;

    narrationScenes: number;
  };

  scenes: Scene[];
}

interface BuildProductionPackInput {
  projectId: string;

  projectTitle: string;

  scenes: Scene[];

  settings:
    TrendProjectSettings | null;
}

export function buildProductionPack({
  projectId,
  projectTitle,
  scenes,
  settings,
}: BuildProductionPackInput): ProductionPack {
  const stats =
    getScenePromptStats(
      scenes
    );

  return {
    version:
      "AI Creator OS Production Pack v1",

    exportedAt:
      new Date().toISOString(),

    project: {
      id:
        projectId,

      title:
        projectTitle,
    },

    trend: {
      formatId:
        settings?.trendFormatId,

      formatTitle:
        settings?.trendFormatTitle,

      topic:
        settings?.topic,

      duration:
        settings?.duration,

      structure:
        settings?.structureFamily,

      audioMode:
        settings?.audioMode,

      style:
        settings?.style,

      model:
        settings?.recommendedModel,
    },

    stats: {
      totalScenes:
        stats.totalScenes,

      readyScenes:
        stats.readyScenes,

      needsWorkScenes:
        stats.needsWorkScenes,

      completionPercent:
        stats.completionPercent,

      imagePrompts:
        stats.imagePrompts,

      videoPrompts:
        stats.videoPrompts,

      voicePrompts:
        stats.voicePrompts,

      narrationScenes:
        stats.narrationScenes,
    },

    scenes,
  };
}

export function productionPackToText(
  pack: ProductionPack
) {
  const trendTitle =
    pack.trend.formatTitle ??
    "Standard Project";

  const sceneText =
    pack.scenes
      .map(
        (scene) => `
==================================================
SCENE ${scene.id} — ${scene.title}
==================================================

DURATION
${scene.duration || "—"}

NARRATION
${scene.narration || "—"}

VISUAL
${scene.visual || "—"}

CAMERA
${scene.camera || "—"}

MOTION
${scene.motion || "—"}

TRANSITION
${scene.transition || "—"}

IMAGE PROMPT
${scene.imagePrompt || "—"}

IMAGE-TO-VIDEO PROMPT
${scene.videoPrompt || "—"}

VOICE / NATIVE AUDIO
${scene.voicePrompt || "—"}
`.trim()
      )
      .join("\n\n");

  return `
AI CREATOR OS
PRODUCTION PACK

PROJECT
${pack.project.title}

PROJECT ID
${pack.project.id}

TREND FORMAT
${trendTitle}

TOPIC
${pack.trend.topic || "—"}

DURATION
${pack.trend.duration || "—"}

STRUCTURE
${pack.trend.structure || "—"}

AUDIO MODE
${pack.trend.audioMode || "—"}

VISUAL STYLE
${pack.trend.style || "—"}

RECOMMENDED MODEL
${pack.trend.model || "—"}

PRODUCTION STATUS

Scenes:
${pack.stats.totalScenes}

Ready:
${pack.stats.readyScenes}

Needs Work:
${pack.stats.needsWorkScenes}

Completion:
${pack.stats.completionPercent}%

Image Prompts:
${pack.stats.imagePrompts}

Video Prompts:
${pack.stats.videoPrompts}

Audio Prompts:
${pack.stats.voicePrompts}

Narration Scenes:
${pack.stats.narrationScenes}

${sceneText}
`.trim();
}