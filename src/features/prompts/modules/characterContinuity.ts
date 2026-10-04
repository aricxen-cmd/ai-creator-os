import type {
  PromptCharacterRules,
} from "@/features/prompts/types";

export const CHARACTER_CONTINUITY_RULES: PromptCharacterRules = {
  enabled: true,

  maxVisibleCharacters: 2,
  maxNamedCharacters: 3,

  lockIdentity: true,
  lockWardrobe: true,
  lockVoice: true,
  lockPersonality: true,

  requirePhysicalAction: true,
  requireExpression: true,
  requirePropInteraction: true,

  notes: [
    "Keep every recurring character visually recognizable across all scenes.",

    "Preserve each character's face, head shape, hair or headwear, body proportions, signature colors, and defining visual traits.",

    "Do not silently replace, redesign, merge, or swap recurring characters between scenes.",

    "Keep wardrobe consistent unless the story explicitly shows a wardrobe change.",

    "Story-driven changes such as dirt, rain, damage, wrinkles, or wear may affect clothing without replacing the established wardrobe.",

    "Keep each recurring character's base voice consistent throughout the production.",

    "Emotional delivery may change, but the underlying voice identity must remain stable.",

    "Keep personality-specific behavior consistent across scenes.",

    "Every visible character should perform purposeful physical behavior.",

    "Use hands, posture, gaze, facial expression, body orientation, and prop interaction to communicate story information.",

    "Expressions should reflect the current story beat while preserving the established personality.",

    "Preserve important props and their state across scenes until the story visibly changes them.",

    "Do not introduce unnecessary named characters.",

    "Prefer one or two clearly readable foreground characters instead of overcrowding the frame.",

    "The primary protagonist should remain the primary protagonist unless the selected template explicitly defines a viewpoint change.",

    "Scene-to-scene continuity must preserve the consequences of the previous scene rather than resetting characters to generic poses or emotions.",
  ],
};

export const STRICT_CAST_LOCK_RULES: PromptCharacterRules = {
  ...CHARACTER_CONTINUITY_RULES,

  notes: [
    ...(CHARACTER_CONTINUITY_RULES.notes ?? []),

    "The selected cast is authoritative for the entire production.",

    "Do not import names, faces, wardrobe, voices, personalities, or visual DNA from another cast or template.",

    "Assign character roles before generating scenes and keep those roles stable.",

    "Supporting characters must not replace the lead character in major decisions, hooks, or payoffs unless the template explicitly requires it.",

    "When a recurring character appears again, include enough identifying traits for the generation model to preserve identity.",

    "Do not include conflicting descriptions of the same character in one scene.",
  ],
};

export const VISUAL_CAST_LOCK_RULES: PromptCharacterRules = {
  ...CHARACTER_CONTINUITY_RULES,

  lockVoice: false,

  notes: [
    ...(CHARACTER_CONTINUITY_RULES.notes ?? []),

    "Character continuity is visual and behavioral; no character voice lock is required.",

    "Do not add character dialogue or lip-sync instructions unless another production rule explicitly enables them.",
  ],
};

export const NATIVE_AUDIO_CAST_LOCK_RULES: PromptCharacterRules = {
  ...STRICT_CAST_LOCK_RULES,

  lockVoice: true,

  notes: [
    ...(STRICT_CAST_LOCK_RULES.notes ?? []),

    "Every recurring speaking character must keep the same base voice identity across scenes.",

    "Clearly identify which character owns each spoken line.",

    "Do not transfer dialogue from one established character to another without an explicit story reason.",

    "Emotional delivery may change according to the scene, but speaker identity and base voice characteristics remain stable.",

    "Physical acting, facial expression, gaze, and prop interaction must support the spoken performance.",
  ],
};

export function mergeCharacterRules(
  base: PromptCharacterRules,
  overrides: Partial<PromptCharacterRules> = {}
): PromptCharacterRules {
  return {
    ...base,
    ...overrides,

    notes: [
      ...(base.notes ?? []),
      ...(overrides.notes ?? []),
    ],
  };
}

export function createCharacterContinuityRules(
  overrides: Partial<PromptCharacterRules> = {}
): PromptCharacterRules {
  return mergeCharacterRules(
    STRICT_CAST_LOCK_RULES,
    overrides
  );
}