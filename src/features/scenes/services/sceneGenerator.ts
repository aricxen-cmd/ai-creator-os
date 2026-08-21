import { runAIJob } from "@/features/core";
import { buildScenePrompt } from "../prompts/scenePrompt";

export async function generateScenes(
  storyboard: string
) {
  const result = await runAIJob({
    type: "scene-prompts",
    provider: "openai",
    model: "gpt-5.5",
    prompt: buildScenePrompt(storyboard),
  });

  return result.output;
}