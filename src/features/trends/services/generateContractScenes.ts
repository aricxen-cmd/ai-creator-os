import type {
  Scene,
} from "@/features/scenes/types";

import type {
  SceneContract,
} from "../engine/sceneContracts";

import {
  buildSceneGenerationPrompt,
} from "../engine/buildSceneGenerationPrompt";

interface GenerateContractScenesInput {
  scenes: Scene[];

  contract: SceneContract;

  topic?: string;

  script?: string;

  storyboard?: string;

  productionContext?: string;

  provider?: string;

  model?: string;
}

interface AIResponse {
  success?: boolean;

  response?: string;

  error?: string;
}

export async function generateContractScenes({
  scenes,
  contract,
  topic = "",
  script = "",
  storyboard = "",
  productionContext = "",
  provider = "Ollama",
  model = "qwen3:4b",
}: GenerateContractScenesInput): Promise<Scene[]> {
  const prompt =
    buildSceneGenerationPrompt({
      scenes,
      contract,
      topic,
      script,
      storyboard,
      productionContext,
    });

  const response =
    await fetch(
      "/api/ai/chat",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          type:
            "scene-contract",

          prompt,

          provider,

          model,
        }),
      }
    );

  let data: AIResponse;

  try {
    data =
      await response.json();
  } catch {
    throw new Error(
      "Scene generator returned an invalid server response."
    );
  }

  if (!response.ok) {
    throw new Error(
      data.error ||
        "Scene generation request failed."
    );
  }

  if (!data.success) {
    throw new Error(
      data.error ||
        "Scene generation failed."
    );
  }

  if (
    typeof data.response !==
      "string" ||
    !data.response.trim()
  ) {
    throw new Error(
      "AI returned an empty scene response."
    );
  }

  const generatedScenes =
    parseSceneResponse(
      data.response
    );

  if (
    contract.expectedScenes >
      0 &&
    generatedScenes.length !==
      contract.expectedScenes
  ) {
    throw new Error(
      `Scene generator returned ${generatedScenes.length} scenes. Contract requires ${contract.expectedScenes}.`
    );
  }

  return generatedScenes;
}

function parseSceneResponse(
  value: string
): Scene[] {
  const cleaned =
    stripCodeFence(
      value.trim()
    );

  let parsed: unknown;

  try {
    parsed =
      JSON.parse(
        cleaned
      );
  } catch {
    throw new Error(
      "AI returned invalid scene JSON."
    );
  }

  if (!Array.isArray(parsed)) {
    throw new Error(
      "AI scene response must be a JSON array."
    );
  }

  return parsed.map(
    (
      item,
      index
    ) =>
      normalizeGeneratedScene(
        item,
        index
      )
  );
}

function normalizeGeneratedScene(
  value: unknown,
  index: number
): Scene {
  const data =
    isRecord(value)
      ? value
      : {};

  return {
    id:
      index + 1,

    title:
      stringValue(
        data.title,
        `Scene ${index + 1}`
      ),

    narration:
      stringValue(
        data.narration
      ),

    visual:
      stringValue(
        data.visual
      ),

    camera:
      stringValue(
        data.camera
      ),

    motion:
      stringValue(
        data.motion
      ),

    duration:
      stringValue(
        data.duration
      ),

    transition:
      stringValue(
        data.transition
      ),

    imagePrompt:
      stringValue(
        data.imagePrompt
      ),

    videoPrompt:
      stringValue(
        data.videoPrompt
      ),

    voicePrompt:
      stringValue(
        data.voicePrompt
      ),
  };
}

function stripCodeFence(
  value: string
) {
  if (
    value.startsWith(
      "```"
    )
  ) {
    return value
      .replace(
        /^```(?:json)?\s*/i,
        ""
      )
      .replace(
        /\s*```$/,
        ""
      )
      .trim();
  }

  return value;
}

function isRecord(
  value: unknown
): value is Record<
  string,
  unknown
> {
  return (
    typeof value ===
      "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function stringValue(
  value: unknown,
  fallback = ""
) {
  return typeof value ===
    "string"
    ? value
    : fallback;
}