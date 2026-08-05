export interface Trend {
  slug: string;
  title: string;
  description: string;
  topics: string[];

  researchPrompt?: string;
  scriptPrompt?: string;
  scenePrompt?: string;
  thumbnailPrompt?: string;
}