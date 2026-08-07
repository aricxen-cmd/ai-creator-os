import { buildStoryboardPrompt } from "../prompts/storyboardPrompt";

export async function generateStoryboard(
  script: string,
  provider = "OpenAI",
  model = "gpt-5.5"
) {
  const prompt = buildStoryboardPrompt(script);

  const response = await fetch("/api/ai/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      provider,
      model,
    }),
  });

  return response.json();
}