import type {
  Scene,
} from "@/features/scenes/types";

import type {
  SceneContract,
} from "./sceneContracts";

import {
  buildABPairInstructions,
} from "./buildABPairInstructions";

export interface BuildSceneGenerationPromptInput {
  scenes: Scene[];

  contract: SceneContract;

  topic?: string;

  script?: string;

  storyboard?: string;

  productionContext?: string;
}

export function buildSceneGenerationPrompt({
  scenes,
  contract,
  topic = "",
  script = "",
  storyboard = "",
  productionContext = "",
}: BuildSceneGenerationPromptInput) {
  const sceneBlueprint =
    scenes
      .map(
        (scene) => `
SCENE ${scene.id}

ROLE:
${scene.title}

DURATION:
${scene.duration || "Use contract duration"}

CURRENT NARRATION:
${scene.narration || "None"}

CURRENT VISUAL:
${scene.visual || "None"}

CURRENT CAMERA:
${scene.camera || "None"}

CURRENT MOTION:
${scene.motion || "None"}

CURRENT TRANSITION:
${scene.transition || "None"}
`.trim()
      )
      .join("\n\n");

  const contractRules =
    contract.rules
      .map(
        (rule, index) =>
          `${index + 1}. ${rule}`
      )
      .join("\n");

  const abInstructions =
    buildABPairInstructions(
      contract
    );

  return `
You are the AI Creator OS Scene Production Engine.

Repair and complete the supplied scene blueprint so it fully matches the active production contract.

TOPIC

${topic || "No topic supplied."}

PROJECT SCRIPT

${script || "No saved script supplied."}

PROJECT STORYBOARD

${storyboard || "No saved storyboard supplied."}

PRODUCTION CONTEXT

${productionContext || "No extra production context supplied."}

SCENE CONTRACT

FORMAT:
${contract.formatId}

DURATION:
${contract.duration}

MODE:
${contract.mode}

EXPECTED SCENES:
${contract.expectedScenes}

${
  contract.secondsPerScene
    ? `SECONDS PER SCENE:
${contract.secondsPerScene}`
    : ""
}

${
  contract.expectedPairs
    ? `EXPECTED A/B PAIRS:
${contract.expectedPairs}`
    : ""
}

${
  contract.expectedImages
    ? `EXPECTED IMAGE PROMPTS:
${contract.expectedImages}`
    : ""
}

NARRATION REQUIRED:
${contract.narrationRequired ? "YES" : "NO"}

NATIVE AUDIO REQUIRED:
${contract.nativeAudioRequired ? "YES" : "NO"}

CONTINUITY REQUIRED:
${contract.continuityRequired ? "YES" : "NO"}

CONTRACT RULES

${contractRules || "No additional rules."}

${abInstructions}

CURRENT SCENE BLUEPRINT

${sceneBlueprint}

TASK

Return exactly ${contract.expectedScenes} scenes.

Every scene must contain:

- id
- title
- narration
- visual
- camera
- motion
- duration
- transition
- imagePrompt
- videoPrompt
- voicePrompt

IMAGE PROMPT

Each imagePrompt must be production-ready.

Include:

- exact subject
- identity continuity
- appearance continuity
- environment
- physical action
- camera
- framing
- lighting
- visual style
- props
- emotional expression

For A/B formats, write BOTH states inside imagePrompt using:

IMAGE A:
...

IMAGE B:
...

VIDEO PROMPT

Each videoPrompt must describe motion from the image state into the completed clip.

Include:

- starting pose
- physical action
- secondary movement
- camera motion
- facial reaction
- environmental movement
- final hold
- next-scene handoff

For A/B formats, explicitly animate:

IMAGE A → IMAGE B

Do not introduce unrelated elements during interpolation.

AUDIO

If nativeAudioRequired is YES:

voicePrompt contains native audio instructions.

Use appropriate:

- sound effects
- ambience
- prop sounds
- character sounds
- dialogue only when allowed

If narrationRequired is YES:

narration must contain concise voice-over narration.

If narrationRequired is NO:

leave narration blank unless the format itself requires dialogue there.

CONTINUITY

Scene N must causally lead into Scene N+1.

Preserve:

- identities
- species
- body type
- wardrobe
- props
- location geometry
- emotional progression
- damage/transformation state
- story evidence

Do not reset state between scenes.

OUTPUT

Return ONLY valid JSON.

No markdown.

No code fences.

No explanations.

Use exactly:

[
  {
    "id": 1,
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
]
`.trim();
}