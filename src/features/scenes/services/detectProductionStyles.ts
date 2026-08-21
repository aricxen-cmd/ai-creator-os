import { runAIJob } from "@/features/core";

import type { Scene } from "../types";

export interface SuggestedProductionStyle {
  name: string;
  description: string;
  styleLock: string;
  selected: boolean;
}

interface DetectProductionStylesInput {
  scenes: Scene[];
  script?: string;
  storyboard?: string;
}

interface AIStyle {
  name?: unknown;
  description?: unknown;
  styleLock?: unknown;
}

interface AIStyleResponse {
  styles?: unknown;
}

export async function detectProductionStyles({
  scenes,
  script = "",
  storyboard = "",
}: DetectProductionStylesInput): Promise<
  SuggestedProductionStyle[]
> {
  if (
    scenes.length === 0 &&
    !script.trim() &&
    !storyboard.trim()
  ) {
    return [];
  }

  const sceneContext = scenes
    .map((scene) => {
      return `
SCENE ${scene.id}

TITLE:
${scene.title || `Scene ${scene.id}`}

NARRATION:
${scene.narration || "None"}

VISUAL:
${scene.visual || "None"}

CAMERA:
${scene.camera || "None"}

MOTION:
${scene.motion || "None"}
`.trim();
    })
    .join("\n\n---\n\n");

  const prompt = `
You are a professional visual director and AI production designer.

Analyze the production below and recommend exactly 3 strong visual production styles.

SCRIPT:
${script || "No separate script provided."}

STORYBOARD:
${storyboard || "No separate storyboard provided."}

SCENES:
${sceneContext || "No structured scenes provided."}

YOUR JOB:

Recommend 3 visually distinct production styles that fit this project.

Examples may include:

- cinematic realism
- premium claymation
- stylized 3D animation
- 2D animated short-form
- documentary realism
- graphic novel
- miniature stop-motion
- cinematic commercial
- playful children's animation
- dark cinematic thriller
- clean educational animation

Do not blindly use the examples above.

Choose styles based on:
- story subject
- target emotional tone
- scene structure
- intended audience
- visual consistency
- AI image generation practicality
- AI video generation practicality

Each recommendation must include:

1. NAME
A short reusable template name.

2. DESCRIPTION
A short explanation of why the visual style fits this project.

3. STYLE LOCK
A production-ready reusable visual consistency instruction.

STYLE LOCK REQUIREMENTS:

The Style Lock should define:

- overall rendering style
- realism level
- character rendering
- environment rendering
- material treatment
- texture
- lighting
- shadows
- color treatment
- lens/composition language
- depth of field
- animation or motion appearance where relevant
- consistency rules

It must also explicitly instruct the generator to:

- preserve the same visual style across every scene
- avoid random style changes
- avoid inconsistent materials
- avoid inconsistent lighting treatment
- avoid logos and watermarks unless specifically requested
- avoid unwanted text in the generated image

RETURN STRICT JSON ONLY.

Use exactly this structure:

{
  "styles": [
    {
      "name": "Premium Claymation",
      "description": "Works well because...",
      "styleLock": "Premium stop-motion claymation..."
    }
  ]
}

Return exactly 3 styles whenever possible.

Do not include markdown.
Do not include code fences.
Do not explain your answer outside the JSON.
`.trim();

  const result = await runAIJob({
    type: "scene-prompts",
    provider: "ollama",
    model: "qwen3:4b",
    prompt,
  });

  return parseProductionStyles(
    result.output
  );
}

function parseProductionStyles(
  output: string
): SuggestedProductionStyle[] {
  try {
    const cleaned =
      cleanJsonResponse(output);

    const parsed =
      JSON.parse(
        cleaned
      ) as AIStyleResponse;

    if (
      !Array.isArray(
        parsed.styles
      )
    ) {
      return [];
    }

    const rawStyles =
      parsed.styles as AIStyle[];

    const styles: SuggestedProductionStyle[] =
      [];

    const seenNames =
      new Set<string>();

    for (const style of rawStyles) {
      if (
        typeof style.name !==
          "string" ||
        typeof style.description !==
          "string" ||
        typeof style.styleLock !==
          "string"
      ) {
        continue;
      }

      const name =
        style.name.trim();

      const description =
        style.description.trim();

      const styleLock =
        style.styleLock.trim();

      if (
        !name ||
        !description ||
        !styleLock
      ) {
        continue;
      }

      const normalized =
        name.toLowerCase();

      if (
        seenNames.has(
          normalized
        )
      ) {
        continue;
      }

      seenNames.add(
        normalized
      );

      styles.push({
        name,
        description,
        styleLock,
        selected:
          styles.length === 0,
      });
    }

    return styles;
  } catch {
    return [];
  }
}

function cleanJsonResponse(
  value: string
): string {
  let cleaned =
    value.trim();

  cleaned =
    cleaned.replace(
      /^```json\s*/i,
      ""
    );

  cleaned =
    cleaned.replace(
      /^```\s*/,
      ""
    );

  cleaned =
    cleaned.replace(
      /\s*```$/,
      ""
    );

  const firstBrace =
    cleaned.indexOf("{");

  const lastBrace =
    cleaned.lastIndexOf("}");

  if (
    firstBrace !== -1 &&
    lastBrace !== -1 &&
    lastBrace >
      firstBrace
  ) {
    cleaned =
      cleaned.slice(
        firstBrace,
        lastBrace + 1
      );
  }

  return cleaned.trim();
}