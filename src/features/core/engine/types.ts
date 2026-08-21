import type { AIProvider } from "@/features/ai/types/ai";

export type AIJobType =
  | "research"
  | "script"
  | "storyboard"
  | "scene"
  | "scene-prompts"
  | "image-prompt"
  | "image"
  | "video-prompt"
  | "video"
  | "voice"
  | "thumbnail";

export interface AIRequest {
  type: AIJobType;
  provider: AIProvider;
  model: string;
  prompt: string;
}

export interface AIResponse {
  success: true;
  output: string;
}