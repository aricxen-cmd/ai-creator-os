import { runAIJob } from "@/features/core";

import { buildScenePrompt } from "../prompts/scenePrompt";

export async function generateScenes(
  storyboard: string
) {

  return runAIJob({
    type: "scene-prompts",

    provider: "OpenAI",

    model: "gpt-5.5",

    prompt: buildScenePrompt(
      storyboard
    ),
  });

}