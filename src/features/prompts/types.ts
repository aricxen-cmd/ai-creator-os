export type PromptType =
  | "image"
  | "video"
  | "scene"
  | "thumbnail"
  | "character";

export interface PromptBuilderInput {
  type: PromptType;

  templateId?: string;

  subject: string;

  action?: string;

  environment?: string;

  style?: string;

  camera?: string;

  lighting?: string;

  mood?: string;

  duration?: string;

  selectedCastIds?: string[];

  castLock?: string;

  styleLock?: string;

  extraInstructions?: string;
}

export interface PromptBuilderResult {
  prompt: string;
}