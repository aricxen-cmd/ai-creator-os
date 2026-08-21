import type { Scene } from "../types";
import { generateScenePrompts } from "./generateScenePrompts";

interface GenerateAllScenePromptsInput {
  scenes: Scene[];

  sceneCastLocks?: Record<
    number,
    string
  >;

  styleLock?: string;

  onProgress?: (
    completed: number,
    total: number,
    sceneId: number
  ) => void;
}

export async function generateAllScenePrompts({
  scenes,
  sceneCastLocks = {},
  styleLock = "",
  onProgress,
}: GenerateAllScenePromptsInput) {
  const updatedScenes: Scene[] =
    [];

  const total = scenes.length;

  for (
    let index = 0;
    index < scenes.length;
    index++
  ) {
    const scene = scenes[index];

    const castLock =
      sceneCastLocks[
        scene.id
      ] ?? "";

    const generated =
      await generateScenePrompts(
        {
          scene,
          castLock,
          styleLock,
        }
      );

    updatedScenes.push({
      ...scene,

      imagePrompt:
        generated.imagePrompt,

      videoPrompt:
        generated.videoPrompt,
    });

    onProgress?.(
      index + 1,
      total,
      scene.id
    );
  }

  return updatedScenes;
}