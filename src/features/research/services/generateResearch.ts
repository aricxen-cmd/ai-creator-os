import { buildResearchPrompt } from "../prompts/researchPrompt";

export async function generateResearch(
  topic: string,
  provider = "OpenAI",
  model = "gpt-5.5"
) {
  const prompt = buildResearchPrompt(topic);

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