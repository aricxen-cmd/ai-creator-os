import chatWithOpenAI from "./providers/openai";

export async function generateAIResponse(
  prompt: string,
  provider: string,
  model: string
) {
  switch (provider) {
    case "OpenAI":
      return chatWithOpenAI(prompt, model);

    default:
      throw new Error(
        `${provider} is not supported yet.`
      );
  }
}