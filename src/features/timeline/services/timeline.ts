import type {
  TimelineItem,
} from "../types";

interface TimelineProject {
  research: string | null;
  script: string | null;
  storyboard: string | null;
  scenes: unknown | null;
}

function hasScenes(
  scenes: unknown
): boolean {
  return (
    Array.isArray(scenes) &&
    scenes.length > 0
  );
}

export function buildTimeline(
  project: TimelineProject
): TimelineItem[] {
  const researchDone =
    Boolean(project.research);

  const scriptDone =
    Boolean(project.script);

  const storyboardDone =
    Boolean(project.storyboard);

  const scenesDone =
    hasScenes(project.scenes);

  return [
    {
      id: "research",
      title: "Research",
      completed: researchDone,
      current: !researchDone,
      locked: false,
      progress: researchDone ? 100 : 0,
    },

    {
      id: "script",
      title: "Script",
      completed: scriptDone,
      current:
        researchDone &&
        !scriptDone,
      locked: !researchDone,
      progress: scriptDone ? 100 : 0,
    },

    {
      id: "storyboard",
      title: "Storyboard",
      completed: storyboardDone,
      current:
        researchDone &&
        scriptDone &&
        !storyboardDone,
      locked: !scriptDone,
      progress:
        storyboardDone ? 100 : 0,
    },

    {
      id: "scenes",
      title: "Scenes",
      completed: scenesDone,
      current:
        storyboardDone &&
        !scenesDone,
      locked: !storyboardDone,
      progress: scenesDone ? 100 : 0,
    },
  ];
}