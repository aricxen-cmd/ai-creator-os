import OpenAI from "openai";

let openAIClient: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (openAIClient) {
    return openAIClient;
  }

  const apiKey =
    process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OpenAI is not configured. Add OPENAI_API_KEY to .env.local or select Ollama as your AI provider."
    );
  }

  openAIClient =
    new OpenAI({
      apiKey,
    });

  return openAIClient;
}