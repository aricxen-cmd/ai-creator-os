import type { AIRequest, AIResponse } from "./types";
import { Providers } from "./providers";

export async function runAIJob(
  request: AIRequest
): Promise<AIResponse> {
  const provider = Providers[request.provider];

  if (!provider) {
    throw new Error(
      `AI provider "${request.provider}" is not registered.`
    );
  }

  const result = await provider.generate({
    provider: request.provider,
    model: request.model,
    prompt: request.prompt,
  });

  return {
    success: true,
    output: result.text,
  };
}