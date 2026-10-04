/*
 * =========================================================
 * AI CREATOR OS — PROMPT TYPES
 * =========================================================
 */


/*
 * BASIC TYPES
 */

export type PromptType =
  | "image"
  | "video"
  | "scene"
  | "script"
  | "storyboard"
  | "thumbnail"
  | "character"
  | "research"
  | "custom";

export type PromptAudioMode =
  | "none"
  | "voice-over"
  | "native-audio";

export type PromptAspectRatio =
  | "9:16"
  | "16:9"
  | "1:1"
  | "4:5"
  | "custom";

export type PromptTemplateCategory =
  | "story"
  | "explainer"
  | "education"
  | "motivation"
  | "sports"
  | "animal"
  | "transformation"
  | "fitness"
  | "automotive"
  | "cinematic"
  | "custom";


/*
 * PRODUCTION CONTRACT
 */

export interface PromptProductionContract {
  totalDurationSeconds: number;
  sceneCount: number;
  sceneDurationSeconds: number;
  exact: boolean;
  aspectRatio: PromptAspectRatio;
  videoEngine?: string;
  audioMode: PromptAudioMode;
}


/*
 * STORY RULES
 */

export interface PromptStoryRules {
  hook?: string;
  progression?: string[];
  payoff?: string;
  continuityRequired?: boolean;
  requireSceneConsequence?: boolean;
  allowSubplots?: boolean;
  notes?: string[];
}


/*
 * CHARACTER RULES
 */

export interface PromptCharacterRules {
  enabled: boolean;
  maxVisibleCharacters?: number;
  maxNamedCharacters?: number;
  lockIdentity?: boolean;
  lockWardrobe?: boolean;
  lockVoice?: boolean;
  lockPersonality?: boolean;
  requirePhysicalAction?: boolean;
  requireExpression?: boolean;
  requirePropInteraction?: boolean;
  notes?: string[];
}


/*
 * VISUAL RULES
 */

export interface PromptVisualRules {
  style?: string;
  cameraStyle?: string;
  lightingStyle?: string;
  requireFrozenMoment?: boolean;
  requireSubjectFirst?: boolean;
  requireLocationContinuity?: boolean;
  requirePropContinuity?: boolean;
  allowTextInImage?: boolean;
  allowLogos?: boolean;
  notes?: string[];
}


/*
 * AUDIO RULES
 */

export interface PromptAudioRules {
  mode: PromptAudioMode;
  narration?: boolean;
  dialogue?: boolean;
  nativeAudio?: boolean;
  music?: boolean;
  soundEffects?: boolean;
  ambient?: boolean;
  requireSpeakerLabels?: boolean;
  requireVoiceContinuity?: boolean;
  allowSilentScenes?: boolean;
  minimumSilentScenes?: number;
  notes?: string[];
}


/*
 * SCENE RULES
 */

export interface PromptSceneRules {
  onePrimaryAction?: boolean;
  requireStartState?: boolean;
  requireEndState?: boolean;
  requireCameraDirection?: boolean;
  requireMotionDirection?: boolean;
  requireTransition?: boolean;
  inheritPreviousSceneState?: boolean;
  notes?: string[];
}


/*
 * NEGATIVE RULES
 */

export interface PromptNegativeRules {
  items: string[];
}


/*
 * OUTPUT CONTRACT
 */

export interface PromptOutputContract {
  narration: boolean;
  visual: boolean;
  camera: boolean;
  motion: boolean;
  duration: boolean;
  transition: boolean;
  imagePrompt: boolean;
  videoPrompt: boolean;
  voicePrompt: boolean;
}


/*
 * PROMPT TEMPLATE
 *
 * templateId is required by buildGenerationRequest.ts,
 * so id remains required.
 */

export interface PromptTemplate {
  id: string;

  name: string;

  type: string;

  prompt_template: string;

  enabled?: boolean;

  description?: string;

  category?: string;

  niche?: string;

  tags?: string[];

  default_style?: string;

  default_model?: string;

  aspect_ratio?: string;

  negative_prompt?: string;

  requires_reference_image?: boolean;

  title?: string;

  defaultStyle?: string;

  defaultVideoEngine?: string;

  defaultAspectRatio?: PromptAspectRatio;

  defaultAudioMode?: PromptAudioMode;

  mission?: string;

  production?: PromptProductionContract;

  story?: PromptStoryRules;

  characters?: PromptCharacterRules;

  visual?: PromptVisualRules;

  audio?: PromptAudioRules;

  scenes?: PromptSceneRules;

  negative?: PromptNegativeRules;

  output?: PromptOutputContract;

  instructions?: string[];
}


/*
 * PROMPT BUILDER INPUT
 */

export interface PromptBuilderInput {
  type: PromptType;

  subject: string;

  action?: string;

  environment?: string;

  style?: string;

  camera?: string;

  lighting?: string;

  mood?: string;

  duration?: string;

  extraInstructions?: string;

  castLock?: string;

  styleLock?: string;

  selectedCastIds?: string[];

  topic?: string;

  templateId?: string;

  production?: PromptProductionContract;

  language?: string;

  characters?: string[];

  research?: string;

  script?: string;

  storyboard?: string;

  customInstructions?: string;
}


/*
 * BUILD GENERATION REQUEST OPTIONS
 *
 * Matches the actual buildGenerationRequest.ts.
 */

export interface BuildPromptOptions {
  templateId: string;

  values: Record<string, string>;

  style?: string;

  customInstructions?: string;

  model?: string;

  aspectRatio?: string;
}


/*
 * BUILT GENERATION REQUEST
 *
 * Matches the exact object returned by
 * buildGenerationRequest.ts.
 */

export interface BuiltPromptRequest {
  templateId: string;

  templateName: string;

  category?: string;

  type: string;

  model?: string;

  style: string;

  aspectRatio?: string;

  prompt: string;

  negativePrompt?: string;

  requiresReferenceImage: boolean;

  tags: string[];
}


/*
 * STYLE PRESET
 */

export interface StylePreset {
  id: string;

  label: string;

  prompt_suffix: string;

  name?: string;

  description?: string;

  prompt?: string;

  negative_prompt?: string;

  category?: string;

  tags?: string[];
}


/*
 * PROMPT DATABASE
 */

export interface PromptDatabase {
  prompt_templates: PromptTemplate[];

  style_presets: StylePreset[];

  models: string[];

  templates?: PromptTemplate[];

  styles?: StylePreset[];

  categories?: string[];
}


/*
 * RESOLVED TEMPLATE
 */

export interface ResolvedPromptTemplate {
  template: PromptTemplate;

  input: PromptBuilderInput;

  production: PromptProductionContract;
}