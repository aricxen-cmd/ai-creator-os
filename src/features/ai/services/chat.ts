import { chatWithOpenAI } from "../providers/openai";
import { ChatRequest } from "../types";

export async function generateAI({
  provider,
  prompt,
  model,
}: ChatRequest) {
  switch (provider) {
    case "openai":
      return await chatWithOpenAI(prompt, model);

    default:
      throw new Error("Provider not implemented.");
  }
}