import { runAIJob } from "@/features/core";

import type { Scene } from "../types";

import type {
  CastProfileRow,
} from "@/lib/supabase/castProfiles";

interface DetectSceneCastInput {
  scene: Scene;

  castProfiles: CastProfileRow[];
}

interface CastDetectionResponse {
  castIds: string[];
}

export async function detectSceneCast({
  scene,
  castProfiles,
}: DetectSceneCastInput): Promise<string[]> {
  if (castProfiles.length === 0) {
    return [];
  }

  const availableCast =
    castProfiles
      .map(
        (profile) => `
ID: ${profile.id}
NAME: ${profile.name}
DESCRIPTION:
${profile.description}
`.trim()
      )
      .join("\n\n---\n\n");

  const prompt = `
You are a production assistant for an AI-generated video.

Your job is to determine which saved cast members are actually visible or directly participating in the following scene.

SCENE INFORMATION

Scene ID:
${scene.id}

Title:
${scene.title || `Scene ${scene.id}`}

Narration:
${scene.narration || "None"}

Visual:
${scene.visual || "None"}

Camera:
${scene.camera || "None"}

Motion:
${scene.motion || "None"}

AVAILABLE CAST

${availableCast}

RULES

1. Select only characters who are actually visible or clearly participating in this scene.

2. Do not select a character just because they exist in the production.

3. If the narration mentions someone but the visual clearly shows they are not physically present, do not include them unless the scene requires them on screen.

4. Use the cast profile NAME and DESCRIPTION to match references in the scene.

5. Never invent cast IDs.

6. Only return IDs from the AVAILABLE CAST list.

7. If no saved cast member appears in the scene, return an empty array.

RETURN STRICT JSON ONLY.

Use exactly this format:

{
  "castIds": ["CAST_ID_1", "CAST_ID_2"]
}

If nobody appears:

{
  "castIds": []
}

Do not include markdown.
Do not include code fences.
Do not explain your answer.
`.trim();

  const result =
    await runAIJob({
      type: "scene-prompts",
      provider: "ollama",
      model: "qwen3:4b",
      prompt,
    });

  return parseCastDetection(
    result.output,
    castProfiles
  );
}

function parseCastDetection(
  output: string,
  castProfiles: CastProfileRow[]
): string[] {
  const validIds =
    new Set(
      castProfiles.map(
        (profile) => profile.id
      )
    );

  try {
    const cleaned =
      cleanJsonResponse(output);

    const parsed =
      JSON.parse(
        cleaned
      ) as CastDetectionResponse;

    if (
      !Array.isArray(
        parsed.castIds
      )
    ) {
      return [];
    }

    return parsed.castIds.filter(
      (id): id is string =>
        typeof id === "string" &&
        validIds.has(id)
    );
  } catch {
    /*
     * Fallback:
     * If Qwen returns slightly
     * malformed JSON, look for
     * exact cast IDs in output.
     */

    return castProfiles
      .filter((profile) =>
        output.includes(
          profile.id
        )
      )
      .map(
        (profile) =>
          profile.id
      );
  }
}

function cleanJsonResponse(
  value: string
) {
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
    lastBrace !== -1
  ) {
    cleaned =
      cleaned.slice(
        firstBrace,
        lastBrace + 1
      );
  }

  return cleaned.trim();
}