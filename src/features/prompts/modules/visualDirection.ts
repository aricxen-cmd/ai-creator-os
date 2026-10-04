import type { PromptVisualRules } from "@/features/prompts/types";

export const CINEMATIC_VISUAL_RULES: PromptVisualRules = {
  requireFrozenMoment: true,

  requireSubjectFirst: true,

  requireLocationContinuity: true,

  requirePropContinuity: true,

  allowTextInImage: false,

  allowLogos: false,

  notes: [
    "Each image prompt should describe one clearly readable frozen moment.",

    "Identify the primary subject before secondary visual details.",

    "Describe the subject's pose, expression, gaze, and physical interaction with important objects.",

    "Describe exact hand-to-prop contact when the interaction matters to the story.",

    "Keep location details consistent across scenes that occur in the same place.",

    "Preserve important prop position and condition until an action visibly changes it.",

    "Use one primary visual action or story idea per shot.",

    "Avoid combining several unrelated actions into one image prompt.",

    "Specify useful camera framing and angle when they materially affect the shot.",

    "Specify the important light source or lighting condition when relevant.",

    "Include the visual clue, evidence, threat, discovery, or consequence needed for the story beat.",

    "Do not place dialogue, narration, editing commands, or production notes inside a still-image prompt.",

    "Avoid unexplained visual changes between consecutive scenes.",
  ],
};

export const STORY_VISUAL_RULES: PromptVisualRules = {
  ...CINEMATIC_VISUAL_RULES,

  notes: [
    ...(CINEMATIC_VISUAL_RULES.notes ?? []),

    "The image should make the current story beat understandable before animation begins.",

    "The character's starting pose must support the action that will occur in the video prompt.",

    "Show the physical result of important actions in later scene images.",

    "Maintain character, wardrobe, environment, and prop continuity throughout connected scenes.",
  ],
};

export function createVisualRules(
  overrides: Partial<PromptVisualRules> = {}
): PromptVisualRules {
  return {
    ...STORY_VISUAL_RULES,
    ...overrides,

    notes: [
      ...(STORY_VISUAL_RULES.notes ?? []),
      ...(overrides.notes ?? []),
    ],
  };
}