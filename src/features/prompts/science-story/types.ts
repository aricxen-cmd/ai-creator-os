export type ScienceStoryPlatform =
  | "YouTube Shorts"
  | "TikTok"
  | "Instagram Reels"
  | "YouTube";

export type ScienceStoryLength =
  | "30 Seconds"
  | "60 Seconds"
  | "90 Seconds"
  | "3 Minutes"
  | "5 Minutes";

export type ScienceStoryStyle =
  | "3D Cinematic"
  | "3D Medical"
  | "Realistic"
  | "Documentary"
  | "Cartoon"
  | "POV";

export type CharacterStyle =
  | "3D Human"
  | "Anatomical Human"
  | "Astronaut"
  | "Scientist"
  | "Animal"
  | "Custom";

export interface ScienceStoryInput {
  topic: string;

  platform: ScienceStoryPlatform;

  length: ScienceStoryLength;

  visualStyle: ScienceStoryStyle;

  sceneCount: number;

  characterStyle: CharacterStyle;

  customCharacter?: string;

  audience?: string;

  additionalInstructions?: string;
}

export interface ScienceStoryScene {
  sceneNumber: number;

  title: string;

  duration: string;

  narration: string;

  onScreenText: string;

  textToImagePrompt: string;

  imageToVideoPrompt: string;

  soundEffects: string[];

  transition?: string;
}

export interface ScienceStoryCharacter {
  name: string;

  role: string;

  description: string;

  appearance: string;

  clothing: string;

  characterPrompt: string;

  continuityPrompt: string;
}

export interface ScienceStoryThumbnail {
  title: string;

  concept: string;

  prompt: string;

  textOverlay: string;
}

export interface ScienceStoryMetadata {
  titles: string[];

  description: string;

  keywords: string[];

  hashtags: string[];
}

export interface ScienceStoryProductionPack {
  title: string;

  concept: string;

  hook: string;

  researchSummary: string;

  script: string;

  characters: ScienceStoryCharacter[];

  scenes: ScienceStoryScene[];

  thumbnails: ScienceStoryThumbnail[];

  metadata: ScienceStoryMetadata;

  musicDirection: string;

  visualDirection: string;
}