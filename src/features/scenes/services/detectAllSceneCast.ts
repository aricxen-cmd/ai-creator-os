import type { Scene } from "../types";

import type {
  CastProfileRow,
} from "@/lib/supabase/castProfiles";

import {
  detectSceneCast,
} from "./detectSceneCast";

interface DetectAllSceneCastInput {
  scenes: Scene[];

  castProfiles: CastProfileRow[];

  onProgress?: (
    completed: number,
    total: number,
    sceneId: number
  ) => void;
}

export async function detectAllSceneCast({
  scenes,
  castProfiles,
  onProgress,
}: DetectAllSceneCastInput) {
  const selections:
    Record<
      number,
      string[]
    > = {};

  for (
    let index = 0;
    index < scenes.length;
    index++
  ) {
    const scene =
      scenes[index];

    const castIds =
      await detectSceneCast({
        scene,
        castProfiles,
      });

    selections[
      scene.id
    ] = castIds;

    onProgress?.(
      index + 1,
      scenes.length,
      scene.id
    );
  }

  return selections;
}