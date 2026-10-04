import type {
  Scene,
} from "@/features/scenes/types";

import type {
  TrendProjectSettings,
} from "../utils/projectTrendContract";

import {
  buildTrendProductionContext,
} from "../utils/projectTrendContract";

import {
  buildSceneContract,
} from "../engine/buildSceneContract";

import {
  normalizeScenes,
} from "../engine/normalizeScenes";

import {
  validateSceneContract,
} from "../engine/validateSceneContract";

import {
  generateContractScenes,
} from "./generateContractScenes";

interface RepairContractScenesInput {
  scenes: Scene[];

  settings:
    TrendProjectSettings | null;

  script?: string;

  storyboard?: string;

  provider?: string;

  model?: string;
}

export interface RepairContractScenesResult {
  scenes: Scene[];

  repaired: boolean;

  beforeCount: number;

  afterCount: number;

  pass: boolean;

  errors: string[];

  warnings: string[];
}

export async function repairContractScenes({
  scenes,
  settings,
  script = "",
  storyboard = "",
  provider = "Ollama",
  model = "qwen3:4b",
}: RepairContractScenesInput): Promise<RepairContractScenesResult> {
  const contract =
    buildSceneContract(
      settings
    );

  if (!contract) {
    throw new Error(
      "This project does not have an active Trend scene contract."
    );
  }

  const before =
    validateSceneContract(
      scenes,
      contract
    );

  const normalized =
    normalizeScenes(
      scenes,
      contract
    );

  const productionContext =
    buildTrendProductionContext(
      settings
    );

  const generated =
    await generateContractScenes({
      scenes:
        normalized.scenes,

      contract,

      topic:
        settings?.topic ??
        "",

      script,

      storyboard,

      productionContext,

      provider,

      model,
    });

  const after =
    validateSceneContract(
      generated,
      contract
    );

  return {
    scenes:
      generated,

    repaired:
      normalized.changed ||
      !before.pass,

    beforeCount:
      scenes.length,

    afterCount:
      generated.length,

    pass:
      after.pass,

    errors:
      after.errors,

    warnings:
      after.warnings,
  };
}