import { runAIJob } from "@/features/core";

import type { Scene } from "../types";

export interface SuggestedCastProfile {
  name: string;
  description: string;
  selected: boolean;
}

interface DetectCastProfilesInput {
  scenes: Scene[];
  script?: string;
  storyboard?: string;
}

interface AICharacter {
  name?: unknown;
  description?: unknown;
}

interface AICharacterResponse {
  characters?: unknown;
}

export async function detectCastProfiles({
  scenes,
  script = "",
  storyboard = "",
}: DetectCastProfilesInput): Promise<SuggestedCastProfile[]> {
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
`.trim();
    })
    .join("\n\n---\n\n");

  const prompt = `
You are a professional character designer and continuity supervisor for AI-generated video production.

Analyze the production material below and identify the recurring or visually important characters that should have reusable CAST LOCK profiles.

SCRIPT:
${script || "No separate script provided."}

STORYBOARD:
${storyboard || "No separate storyboard provided."}

SCENES:
${sceneContext || "No structured scenes provided."}

YOUR JOB:

Identify unique characters who visually appear in the production.

Create ONE reusable visual identity profile for each important recurring character.

DO NOT create duplicate versions of the same character.

DO NOT create profiles for:
- generic crowds
- anonymous background people
- unnamed one-shot extras
- locations
- animals unless the animal is an important recurring character
- objects

CHARACTER DESCRIPTION RULES:

Each description should be designed for image and video generation consistency.

Include useful details such as:

- approximate age appearance
- gender presentation when supported
- skin tone when supported
- face shape
- eyes
- eyebrows
- hair color
- hairstyle
- facial hair when relevant
- build
- height impression
- clothing
- footwear
- accessories
- important colors
- distinguishing features

At the end of EVERY character description include a strong consistency instruction similar to:

"Keep this character's face, hairstyle, body proportions, clothing, colors, age appearance, accessories, and distinguishing features identical across every scene."

IMPORTANT:

Do not invent highly specific details that directly contradict the production material.

When the source does not specify an appearance detail, choose a simple production-friendly detail that can remain consistent across scenes.

Names must stay consistent with the source material.

RETURN STRICT JSON ONLY.

Use exactly this structure:

{
  "characters": [
    {
      "name": "Tariq",
      "description": "Young athletic male..."
    },
    {
      "name": "Zain",
      "description": "Young male..."
    }
  ]
}

If there are no recurring characters:

{
  "characters": []
}

Do not include markdown.
Do not include code fences.
Do not explain your answer.
`.trim();

  const result = await runAIJob({
    type: "scene-prompts",
    provider: "ollama",
    model: "qwen3:4b",
    prompt,
  });

  return parseCastProfiles(result.output);
}

function parseCastProfiles(
  output: string
): SuggestedCastProfile[] {
  try {
    const cleaned = cleanJsonResponse(output);

    const parsed =
      JSON.parse(cleaned) as AICharacterResponse;

    if (!Array.isArray(parsed.characters)) {
      return [];
    }

    const characters =
      parsed.characters as AICharacter[];

    const seenNames =
      new Set<string>();

    const profiles: SuggestedCastProfile[] = [];

    for (const character of characters) {
      if (
        typeof character.name !== "string" ||
        typeof character.description !== "string"
      ) {
        continue;
      }

      const name =
        character.name.trim();

      const description =
        character.description.trim();

      if (!name || !description) {
        continue;
      }

      const normalizedName =
        name.toLowerCase();

      if (seenNames.has(normalizedName)) {
        continue;
      }

      seenNames.add(normalizedName);

      profiles.push({
        name,
        description,
        selected: true,
      });
    }

    return profiles;
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
    lastBrace > firstBrace
  ) {
    cleaned =
      cleaned.slice(
        firstBrace,
        lastBrace + 1
      );
  }

  return cleaned.trim();
}