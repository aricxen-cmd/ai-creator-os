import type { PromptStoryRules } from "@/features/prompts/types";

export const STORY_CONTINUITY_RULES: PromptStoryRules = {
  hook:
    "Open with an immediately understandable visual problem, discovery, conflict, or unanswered question.",

  progression: [
    "Establish the hook.",
    "Introduce the main conflict, discovery, threat, goal, or opportunity.",
    "Escalate through visible actions and consequences.",
    "Carry unresolved information and physical state into the next scene.",
    "Move toward a clear decision, confrontation, reveal, transformation, or payoff.",
    "End with a satisfying consequence, reveal, payoff, or intentional cliffhanger.",
  ],

  payoff:
    "The ending must resolve or meaningfully advance the central promise established by the hook.",

  continuityRequired: true,

  requireSceneConsequence: true,

  allowSubplots: false,

  notes: [
    "Every scene must perform a clear story function.",

    "Scene N+1 must inherit the meaningful result of Scene N.",

    "Preserve important prop state, character position, emotional state, discoveries, injuries, damage, evidence, open doors, phone calls, journeys, threats, and unresolved decisions across scene boundaries.",

    "Do not reset characters, locations, props, relationships, or conflicts without showing the change.",

    "Avoid filler scenes that repeat information without changing the story.",

    "Avoid random montage shots unless the selected template explicitly requires montage structure.",

    "Each scene should create a reason for the following scene to exist.",

    "Use visible cause and effect whenever possible.",

    "Important discoveries must influence later character behavior.",

    "Important character decisions must produce visible consequences.",

    "Do not introduce an unrelated conflict near the ending simply to create extra drama.",

    "Keep the central story understandable even when viewed without dialogue.",

    "The final scene should connect back to the central conflict, goal, discovery, or promise introduced near the beginning.",
  ],
};

export const STRICT_STORY_CONTINUITY_RULES: PromptStoryRules = {
  ...STORY_CONTINUITY_RULES,

  allowSubplots: false,

  notes: [
    ...(STORY_CONTINUITY_RULES.notes ?? []),

    "Follow the selected story engine from hook through payoff.",

    "Do not import beats, endings, roles, props, or conflicts from another story template.",

    "Do not replace the established protagonist with a supporting character.",

    "Do not skip major cause-and-effect steps required to understand the payoff.",

    "Compress story beats when necessary instead of creating disconnected scenes.",
  ],
};

export function createStoryContinuityRules(
  overrides: Partial<PromptStoryRules> = {}
): PromptStoryRules {
  return {
    ...STRICT_STORY_CONTINUITY_RULES,
    ...overrides,

    progression:
      overrides.progression ??
      STRICT_STORY_CONTINUITY_RULES.progression,

    notes: [
      ...(STRICT_STORY_CONTINUITY_RULES.notes ?? []),
      ...(overrides.notes ?? []),
    ],
  };
}