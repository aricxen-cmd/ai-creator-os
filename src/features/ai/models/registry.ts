import { AIProvider } from "../types/ai";

export const AI_MODELS: Record<AIProvider, string[]> = {
  openai: [
    "gpt-5.5",
  ],

  openrouter: [
    "deepseek/deepseek-chat",
    "meta-llama/llama-3.3-70b-instruct",
  ],

  gemini: [
    "gemini-2.5-flash",
  ],

  groq: [
    "llama-3.3-70b-versatile",
  ],

  ollama: [
    "llama3.1",
    "mistral",
  ],
};