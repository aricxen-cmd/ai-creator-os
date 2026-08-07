import { TimelineItem } from "../types";

export function buildTimeline(project: {
  research: string | null;
  script: string | null;
  storyboard: string | null;
  scene_prompts: string | null;
  thumbnail_prompt: string | null;
}) {
  return [
    {
      id: "research",
      title: "Research",
      completed: !!project.research,
      current: !project.research,
      locked: false,
      progress: project.research ? 100 : 0,
    },

    {
      id: "script",
      title: "Script",
      completed: !!project.script,
      current: !!project.research && !project.script,
      locked: !project.research,
      progress: project.script ? 100 : 0,
    },

    {
      id: "storyboard",
      title: "Storyboard",
      completed: !!project.storyboard,
      current:
        !!project.script &&
        !project.storyboard,
      locked: !project.script,
      progress: project.storyboard ? 100 : 0,
    },

    {
      id: "scene-prompts",
      title: "Scene Prompts",
      completed: !!project.scene_prompts,
      current: false,
      locked: !project.storyboard,
      progress: project.scene_prompts
        ? 100
        : 0,
    },

    {
      id: "images",
      title: "Images",
      completed: false,
      current: false,
      locked: true,
      progress: 0,
    },

    {
      id: "video",
      title: "Video",
      completed: false,
      current: false,
      locked: true,
      progress: 0,
    },

    {
      id: "voice",
      title: "Voice",
      completed: false,
      current: false,
      locked: true,
      progress: 0,
    },

    {
      id: "export",
      title: "Export",
      completed: false,
      current: false,
      locked: true,
      progress: 0,
    },
  ] satisfies TimelineItem[];
}