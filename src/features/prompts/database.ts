import promptData from "@/data/prompts/ai-generator-prompts.json";

import type {
  PromptDatabase,
  PromptTemplate,
  StylePreset,
} from "./types";

export const promptDatabase =
  promptData as PromptDatabase;

export function getPromptTemplates(): PromptTemplate[] {
  return (promptDatabase.prompt_templates ?? []).filter(
    (template) => template.enabled !== false
  );
}

export function getStylePresets(): StylePreset[] {
  return promptDatabase.style_presets ?? [];
}

export function getModels(): string[] {
  return promptDatabase.models ?? [];
}

export function getPromptTemplate(
  id: string
): PromptTemplate | undefined {
  return getPromptTemplates().find(
    (template) => template.id === id
  );
}

export function getStylePreset(
  id: string
): StylePreset | undefined {
  return getStylePresets().find(
    (style) => style.id === id
  );
}

export function getPromptCategories(): string[] {
  const values = getPromptTemplates()
    .map((template) => template.category)
    .filter((value): value is string => Boolean(value));

  return Array.from(new Set(values)).sort();
}

export function getPromptTypes(): string[] {
  const values = getPromptTemplates()
    .map((template) => template.type)
    .filter((value): value is string => Boolean(value));

  return Array.from(new Set(values)).sort();
}