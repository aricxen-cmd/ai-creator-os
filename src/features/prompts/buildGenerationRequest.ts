import {
  getPromptTemplate,
  getStylePreset,
} from "./database";

import { renderPromptTemplate } from "./renderPrompt";

import type {
  BuildPromptOptions,
  BuiltPromptRequest,
} from "./types";

export function buildGenerationRequest(
  options: BuildPromptOptions
): BuiltPromptRequest {
  const template = getPromptTemplate(
    options.templateId
  );

  if (!template) {
    throw new Error(
      `Prompt template not found: ${options.templateId}`
    );
  }

  let prompt = renderPromptTemplate(
    template.prompt_template,
    options.values
  );

  const selectedStyle =
    options.style ??
    template.default_style ??
    "default";

  const stylePreset =
    getStylePreset(selectedStyle);

  if (
    stylePreset?.prompt_suffix &&
    stylePreset.prompt_suffix.trim()
  ) {
    prompt += `

VISUAL STYLE:
${stylePreset.prompt_suffix.trim()}`;
  }

  if (options.customInstructions?.trim()) {
    prompt += `

ADDITIONAL CREATOR INSTRUCTIONS:
${options.customInstructions.trim()}`;
  }

  const model =
    options.model ??
    template.default_model ??
    undefined;

  const aspectRatio =
    options.aspectRatio ??
    template.aspect_ratio ??
    undefined;

  return {
    templateId: template.id,

    templateName: template.name,

    category: template.category,

    type: template.type,

    model,

    style: selectedStyle,

    aspectRatio,

    prompt: prompt.trim(),

    negativePrompt:
      template.negative_prompt?.trim() ||
      undefined,

    requiresReferenceImage:
      Boolean(
        template.requires_reference_image
      ),

    tags: template.tags ?? [],
  };
}