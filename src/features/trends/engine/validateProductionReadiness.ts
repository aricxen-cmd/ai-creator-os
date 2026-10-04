import type {
  Scene,
} from "@/features/scenes/types";

import type {
  TrendProjectSettings,
} from "../utils/projectTrendContract";

import {
  buildSceneContract,
} from "./buildSceneContract";

import {
  validateSceneContract,
} from "./validateSceneContract";

import {
  validateScenePromptQuality,
} from "./validateScenePromptQuality";

export interface ProductionReadiness {
  ready: boolean;

  contractPass: boolean;

  promptPass: boolean;

  totalScenes: number;

  readyScenes: number;

  badScenes: number;

  errors: string[];

  warnings: string[];
}

export function validateProductionReadiness(
  scenes: Scene[],
  settings:
    TrendProjectSettings | null
): ProductionReadiness {
  const errors: string[] =
    [];

  const warnings: string[] =
    [];

  const contract =
    buildSceneContract(
      settings
    );

  let contractPass = true;

  if (contract) {
    const contractResult =
      validateSceneContract(
        scenes,
        contract
      );

    contractPass =
      contractResult.pass;

    errors.push(
      ...contractResult.errors
    );

    warnings.push(
      ...contractResult.warnings
    );
  }

  const qualityResults =
    scenes.map(
      (scene) => ({
        scene,
        result:
          validateScenePromptQuality(
            scene
          ),
      })
    );

  const badScenes =
    qualityResults.filter(
      (item) =>
        !item.result.pass
    );

  const readyScenes =
    scenes.length -
    badScenes.length;

  const promptPass =
    badScenes.length === 0 &&
    scenes.length > 0;

  for (
    const item of
    qualityResults
  ) {
    for (
      const error of
      item.result.errors
    ) {
      errors.push(
        `Scene ${item.scene.id}: ${error}`
      );
    }

    for (
      const warning of
      item.result.warnings
    ) {
      warnings.push(
        `Scene ${item.scene.id}: ${warning}`
      );
    }
  }

  if (
    scenes.length === 0
  ) {
    errors.push(
      "No scenes have been generated."
    );
  }

  return {
    ready:
      contractPass &&
      promptPass,

    contractPass,

    promptPass,

    totalScenes:
      scenes.length,

    readyScenes,

    badScenes:
      badScenes.length,

    errors,

    warnings,
  };
}