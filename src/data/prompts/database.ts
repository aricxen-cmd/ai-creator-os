import promptDatabaseJson from "./ai-generator-prompts.json";

import type {
  PromptDatabase,
  PromptTemplate,
  StylePreset,
} from "./types";

export const promptDatabase =
  promptDatabaseJson as PromptDatabase;

export function getPromptTemplates(): PromptTemplate[] {
  return promptDatabase.prompt_templates.filter(
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
  const categories = getPromptTemplates()
    .map((template) => template.category)
    .filter(
      (category): category is string =>
        Boolean(category)
    );

  return [...new Set(categories)].sort();
}

export function getPromptTypes(): string[] {
  const types = getPromptTemplates()
    .map((template) => template.type)
    .filter(
      (type): type is string =>
        Boolean(type)
    );

  return [...new Set(types)].sort();
}