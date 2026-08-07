export interface StoryboardScene {
  id: number;

  narration: string;

  visual: string;

  camera: string;

  motion: string;

  duration: string;

  transition: string;
}

export interface Storyboard {
  title: string;

  scenes: StoryboardScene[];
}