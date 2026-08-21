export interface StylePreset {
  id: string;
  label: string;
  prompt_suffix: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  category?: string;
  type?: string;
  default_model?: string;
  default_style?: string;
  aspect_ratio?: string;
  requires_reference_image?: boolean;
  prompt_template: string;
  negative_prompt?: string;
  tags?: string[];
  enabled?: boolean;
}

export interface PromptDatabase {
  schema_version?: string;
  name?: string;
  description?: string;
  models?: string[];
  style_presets?: StylePreset[];
  prompt_templates: PromptTemplate[];
}

export interface PromptSearchFilters {
  search?: string;
  category?: string;
  type?: string;
  model?: string;
  style?: string;
  requiresReferenceImage?: boolean;
}

export interface BuildPromptOptions {
  templateId: string;
  values?: Record<string, string | number | boolean>;
  model?: string;
  style?: string;
  aspectRatio?: string;
  customInstructions?: string;
}

export interface BuiltPromptRequest {
  templateId: string;
  templateName: string;
  category?: string;
  type?: string;
  model?: string;
  style?: string;
  aspectRatio?: string;
  prompt: string;
  negativePrompt?: string;
  requiresReferenceImage: boolean;
  tags: string[];
}

export type PromptType =
  "image" | "video" | "scene" | "thumbnail" | "character";

export interface PromptBuilderInput {
  type: PromptType;
  templateId: string;
  subject: string;
  selectedCastIds: string[];

  castLock?: string;
  styleLock?: string;
  action?: string;
  environment?: string;
  style?: string;
  camera?: string;
  lighting?: string;
  mood?: string;
  duration?: string;
  extraInstructions?: string;
}
