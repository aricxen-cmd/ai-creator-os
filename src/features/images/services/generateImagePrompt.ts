import { runAIJob } from "@/features/core";
import { buildImagePrompt } from "../prompts/imagePrompt";

export async function generateImagePrompt(
  narration: string,
  visual: string
) {
  const result = await runAIJob({
    type: "image-prompt",
    provider: "openai",
    model: "gpt-5.5",
    prompt: buildImagePrompt(narration, visual),
  });

  return result.output;
}