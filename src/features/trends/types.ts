import type {
  PromptAspectRatio,
  PromptAudioMode,
  PromptTemplateCategory,
} from "@/features/prompts/types";

/*
 * =========================================================
 * AI CREATOR OS — TREND TYPES
 * =========================================================
 */

export type TrendId = string;

export type TrendCategory =
  | PromptTemplateCategory
  | "food"
  | "comedy"
  | "brainrot"
  | "anime"
  | "restoration"
  | "evolution"
  | "pov";

export interface TrendDurationOption {
  label: string;
  totalSeconds: number;
  sceneCount?: number;
  sceneDurationSeconds?: number;
  exact?: boolean;
  description?: string;
}

export interface TrendCastOption {
  id: string;
  label: string;
  description?: string;
  characterIds?: string[];
  castLock?: string;
}

export interface TrendStoryOption {
  id: string;
  label: string;
  description?: string;
  instructions?: string[];
}

export interface TrendVisualStyleOption {
  id: string;
  label: string;
  description?: string;
  promptSuffix?: string;
}

export interface TrendVideoEngineOption {
  id: string;
  label: string;
  description?: string;
}

export interface TrendAudioOption {
  id: PromptAudioMode;
  label: string;
  description?: string;
}

/*
 * =========================================================
 * TREND TEMPLATE
 * =========================================================
 */

export interface TrendTemplate {
  id: TrendId;

  name: string;

  description: string;

  category: TrendCategory;

  promptTemplateId?: string;

  thumbnail?: string;

  tags?: string[];

  defaultAspectRatio: PromptAspectRatio;

  defaultAudioMode: PromptAudioMode;

  defaultDurationSeconds: number;

  durations: TrendDurationOption[];

  audioModes?: TrendAudioOption[];

  castOptions?: TrendCastOption[];

  storyOptions?: TrendStoryOption[];

  visualStyles?: TrendVisualStyleOption[];

  videoEngines?: TrendVideoEngineOption[];

  allowCustomTopic?: boolean;

  allowCustomInstructions?: boolean;

  requireCast?: boolean;

  requireStoryOption?: boolean;

  requireVideoEngine?: boolean;

  instructions?: string[];
}

/*
 * =========================================================
 * TREND CONFIGURATION
 * =========================================================
 */

export interface TrendConfiguration {
  trendId: TrendId;

  topic: string;

  durationSeconds: number;

  aspectRatio: PromptAspectRatio;

  audioMode: PromptAudioMode;

  castId?: string;

  storyOptionId?: string;

  visualStyleId?: string;

  videoEngineId?: string;

  customInstructions?: string;
}

/*
 * =========================================================
 * PRODUCTION CONTRACT
 * =========================================================
 */

export interface TrendProductionContract {
  trendId: TrendId;

  trendName: string;

  topic: string;

  category: TrendCategory;

  totalDurationSeconds: number;

  sceneCount: number;

  sceneDurationSeconds: number;

  exactTiming: boolean;

  aspectRatio: PromptAspectRatio;

  audioMode: PromptAudioMode;

  castId?: string;

  storyOptionId?: string;

  visualStyleId?: string;

  videoEngineId?: string;

  promptTemplateId?: string;

  customInstructions?: string;

  instructions: string[];
}

/*
 * =========================================================
 * RESOLVED TREND
 * =========================================================
 */

export interface ResolvedTrend {
  template: TrendTemplate;

  configuration: TrendConfiguration;

  production: TrendProductionContract;

  duration: TrendDurationOption;

  cast?: TrendCastOption;

  story?: TrendStoryOption;

  visualStyle?: TrendVisualStyleOption;

  videoEngine?: TrendVideoEngineOption;
}