export type TimelineStage =
  | "research"
  | "script"
  | "storyboard"
  | "scene-prompts"
  | "images"
  | "video"
  | "voice"
  | "export";

export interface TimelineItem {
  id: TimelineStage;

  title: string;

  completed: boolean;

  current: boolean;

  locked: boolean;

  progress: number;
}

export interface ActivityItem {
  id: string;

  title: string;

  timestamp: string;
}