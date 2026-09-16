import { runAIJob } from "@/features/core";
import { buildScenePrompt } from "../prompts/scenePrompt";
import { parseScenePlan } from "./parseScenePlan";

export async function generateScenes(
  storyboard: string
) {
  if (!storyboard.trim()) {
    throw new Error("Add or generate a storyboard before planning scenes.");
  }

  const result = await runAIJob({
    type: "scene-prompts",
    provider: "ollama",
    model: "qwen3:4b",
    prompt: buildScenePrompt(storyboard),
  });

  return parseScenePlan(result.output);
}
