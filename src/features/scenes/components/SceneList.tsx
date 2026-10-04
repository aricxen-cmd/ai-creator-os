"use client";

import SceneCard from "./SceneCard";

import type {
  Scene,
} from "../types";

import type {
  TrendProjectSettings,
} from "@/features/trends/utils/projectTrendContract";

interface Props {
  projectId: string;

  scenes: Scene[];

  trendSettings?:
    TrendProjectSettings | null;

  script?: string;

  storyboard?: string;
}

export default function SceneList({
  projectId,

  scenes,

  trendSettings = null,

  script = "",

  storyboard = "",
}: Props) {
  if (
    scenes.length === 0
  ) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/50 p-10 text-center">
        <div className="text-4xl">
          🎬
        </div>

        <h2 className="mt-4 text-xl font-bold">
          No Scenes Yet
        </h2>

        <p className="mt-3 text-zinc-400">
          Generate a storyboard or use
          Scene Contract Repair to create
          the required production scenes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {scenes.map(
        (scene) => (
          <SceneCard
            key={
              scene.id
            }
            projectId={
              projectId
            }
            scene={
              scene
            }
            allScenes={
              scenes
            }
            trendSettings={
              trendSettings
            }
            script={
              script
            }
            storyboard={
              storyboard
            }
          />
        )
      )}
    </div>
  );
}