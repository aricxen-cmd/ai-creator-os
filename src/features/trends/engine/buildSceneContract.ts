import type {
  TrendProjectSettings,
} from "../utils/projectTrendContract";

import {
  getDurationRule,
} from "./durationRules";

import type {
  SceneContract,
} from "./sceneContracts";

export function buildSceneContract(
  settings:
    TrendProjectSettings | null
): SceneContract | null {
  if (
    !settings ||
    !settings.trendFormatId ||
    !settings.duration
  ) {
    return null;
  }

  const rule =
    getDurationRule(
      settings.trendFormatId,
      settings.duration
    );

  if (!rule) {
    return buildFallbackContract(
      settings
    );
  }

  switch (
    settings.trendFormatId
  ) {
    case "brainrot":
      return {
        formatId:
          settings.trendFormatId,

        duration:
          settings.duration,

        mode:
          "fixed-scenes",

        expectedScenes:
          rule.scenes,

        secondsPerScene:
          rule.secondsPerScene,

        narrationRequired:
          false,

        nativeAudioRequired:
          true,

        continuityRequired:
          true,

        requiredRoles: [
          "Hook",
          "Escalation",
          "Consequence",
          "Payoff",
        ],

        rules: [
          "Every scene is one complete story beat.",
          "Scene N must visually hand off to Scene N+1.",
          "Use native audio.",
          "Dialogue should remain minimal.",
          "No random scene jumps.",
          "Final scene needs payoff, consequence, or cliffhanger.",
        ],
      };

    case "clay-story":
      return {
        formatId:
          settings.trendFormatId,

        duration:
          settings.duration,

        mode:
          "fixed-scenes",

        expectedScenes:
          rule.scenes,

        secondsPerScene:
          rule.secondsPerScene,

        narrationRequired:
          false,

        nativeAudioRequired:
          true,

        continuityRequired:
          true,

        requiredRoles: [
          "Hook",
          "Conflict",
          "Escalation",
          "Payoff",
        ],

        rules: [
          "Each scene is approximately 6 seconds.",
          "Each scene needs a clear physical action.",
          "Use short dialogue or reaction.",
          "Each scene must cause the next scene.",
          "Keep cast identity locked.",
          "End with payoff or cliffhanger.",
        ],
      };

    case "animal-haircut":
      return {
        formatId:
          settings.trendFormatId,

        duration:
          settings.duration,

        mode:
          "a-b-pairs",

        expectedScenes:
          rule.scenes,

        expectedPairs:
          rule.pairs,

        expectedImages:
          rule.images,

        narrationRequired:
          false,

        nativeAudioRequired:
          true,

        continuityRequired:
          true,

        requiredRoles: [
          "Before",
          "Transformation",
          "Hero",
        ],

        rules: [
          "Every transition uses Image A and Image B.",
          "Client animal identity must remain identical.",
          "Barber animal identity must remain identical.",
          "Only fur state and barber tool should change.",
          "Use native ASMR grooming audio.",
          "No narrator or dialogue.",
        ],
      };

    case "anatomy-fitness":
      return {
        formatId:
          settings.trendFormatId,

        duration:
          settings.duration,

        mode:
          "a-b-pairs",

        expectedScenes:
          rule.scenes,

        expectedPairs:
          rule.pairs,

        expectedImages:
          rule.images,

        narrationRequired:
          true,

        nativeAudioRequired:
          false,

        continuityRequired:
          true,

        requiredRoles: [
          "Hook",
          "Exercise",
          "Hero Shot",
        ],

        rules: [
          "Use alternating A/B visual states.",
          "Maintain the same mannequin build.",
          "Use porcelain, X-ray, and muscle layers.",
          "Vary camera angles.",
          "Narration is required.",
          "Final pair must be the hero/result shot.",
        ],
      };

    case "car-evolution":
      return {
        formatId:
          settings.trendFormatId,

        duration:
          settings.duration,

        mode:
          "a-b-pairs",

        expectedScenes:
          rule.scenes,

        expectedPairs:
          rule.pairs,

        expectedImages:
          rule.images,

        narrationRequired:
          false,

        nativeAudioRequired:
          true,

        continuityRequired:
          true,

        requiredRoles: [
          "Starting Era",
          "Evolution",
          "Final Era",
        ],

        rules: [
          "Vehicle must move forward continuously.",
          "Transformations must be mechanical.",
          "No fades or dissolves.",
          "Camera geometry should remain consistent.",
          "Road should remain straight and flat.",
        ],
      };

    default:
      return buildFallbackContract(
        settings
      );
  }
}

function buildFallbackContract(
  settings:
    TrendProjectSettings
): SceneContract {
  return {
    formatId:
      settings.trendFormatId ??
      "unknown",

    duration:
      settings.duration ??
      "unknown",

    mode:
      "dynamic",

    expectedScenes: 0,

    narrationRequired:
      settings.audioMode ===
      "voice-over",

    nativeAudioRequired:
      settings.audioMode ===
      "native-audio",

    continuityRequired:
      true,

    requiredRoles: [],

    rules:
      settings.productionRules ??
      [],
  };
}