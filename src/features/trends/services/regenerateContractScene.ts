import type {
  Scene,
} from "@/features/scenes/types";

import type {
  SceneContract,
} from "../engine/sceneContracts";

interface RegenerateContractSceneInput {
  scene: Scene;

  allScenes: Scene[];

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

export async function regenerateContractScene({
  scene,
  allScenes,
  contract,
  topic = "",
  script = "",
  storyboard = "",
  productionContext = "",
  provider = "Ollama",
  model = "qwen3:4b",
}: RegenerateContractSceneInput): Promise<Scene> {
  const previousScene =
    allScenes.find(
      (item) =>
        item.id ===
        scene.id - 1
    );

  const nextScene =
    allScenes.find(
      (item) =>
        item.id ===
        scene.id + 1
    );

  const prompt = `
You are the AI Creator OS Scene Repair Engine.

Repair ONE scene only.

Do not rewrite the rest of the project.

TOPIC

${topic || "No topic supplied."}

PRODUCTION CONTRACT

FORMAT:
${contract.formatId}

DURATION:
${contract.duration}

MODE:
${contract.mode}

EXPECTED TOTAL SCENES:
${contract.expectedScenes}

NARRATION REQUIRED:
${contract.narrationRequired ? "YES" : "NO"}

NATIVE AUDIO REQUIRED:
${contract.nativeAudioRequired ? "YES" : "NO"}

CONTRACT RULES

${contract.rules
  .map(
    (rule, index) =>
      `${index + 1}. ${rule}`
  )
  .join("\n")}

PRODUCTION CONTEXT

${productionContext || "None"}

PROJECT SCRIPT

${script || "None"}

PROJECT STORYBOARD

${storyboard || "None"}

PREVIOUS SCENE

${
  previousScene
    ? JSON.stringify(
        previousScene,
        null,
        2
      )
    : "This is the first scene."
}

SCENE TO REPAIR

${JSON.stringify(
  scene,
  null,
  2
)}

NEXT SCENE

${
  nextScene
    ? JSON.stringify(
        nextScene,
        null,
        2
      )
    : "This is the final scene."
}

TASK

Rewrite ONLY Scene ${scene.id}.

Preserve its role in the story.

The repaired scene must:

- fit the active Trend format
- preserve character identity
- preserve story continuity
- connect naturally from the previous scene
- hand off naturally into the next scene
- use the correct duration
- include a detailed visual
- include camera direction
- include physical motion
- include a production-ready image prompt
- include a production-ready image-to-video prompt

If native audio is required:
fill voicePrompt with synchronized audio instructions.

If narration is required:
fill narration with concise voice-over.

For A/B formats:

imagePrompt must contain:

IMAGE A:
starting state

IMAGE B:
ending state

videoPrompt must explicitly animate:

IMAGE A → IMAGE B

OUTPUT

Return ONLY one valid JSON object.

No markdown.
No code fences.
No explanation.

Use exactly:

{
  "id": ${scene.id},
  "title": "",
  "narration": "",
  "visual": "",
  "camera": "",
  "motion": "",
  "duration": "",
  "transition": "",
  "imagePrompt": "",
  "videoPrompt": "",
  "voicePrompt": ""
}
`.trim();

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
            "scene-repair",

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
      "Scene repair returned an invalid server response."
    );
  }

  if (!response.ok) {
    throw new Error(
      data.error ||
        "Scene repair request failed."
    );
  }

  if (!data.success) {
    throw new Error(
      data.error ||
        "Scene repair failed."
    );
  }

  if (
    typeof data.response !==
      "string" ||
    !data.response.trim()
  ) {
    throw new Error(
      "AI returned an empty repaired scene."
    );
  }

  return parseScene(
    data.response,
    scene.id
  );
}

function parseScene(
  value: string,
  expectedId: number
): Scene {
  const cleaned =
    value
      .trim()
      .replace(
        /^```(?:json)?\s*/i,
        ""
      )
      .replace(
        /\s*```$/,
        ""
      )
      .trim();

  let parsed: unknown;

  try {
    parsed =
      JSON.parse(cleaned);
  } catch {
    throw new Error(
      "AI returned invalid scene JSON."
    );
  }

  if (
    typeof parsed !==
      "object" ||
    parsed === null ||
    Array.isArray(parsed)
  ) {
    throw new Error(
      "Repaired scene must be one JSON object."
    );
  }

  const data =
    parsed as Record<
      string,
      unknown
    >;

  return {
    id: expectedId,

    title:
      getString(
        data.title,
        `Scene ${expectedId}`
      ),

    narration:
      getString(
        data.narration
      ),

    visual:
      getString(
        data.visual
      ),

    camera:
      getString(
        data.camera
      ),

    motion:
      getString(
        data.motion
      ),

    duration:
      getString(
        data.duration
      ),

    transition:
      getString(
        data.transition
      ),

    imagePrompt:
      getString(
        data.imagePrompt
      ),

    videoPrompt:
      getString(
        data.videoPrompt
      ),

    voicePrompt:
      getString(
        data.voicePrompt
      ),
  };
}

function getString(
  value: unknown,
  fallback = ""
) {
  return typeof value ===
    "string"
    ? value
    : fallback;
}