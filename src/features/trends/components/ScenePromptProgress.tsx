import type {
  Scene,
} from "@/features/scenes/types";

import {
  getScenePromptStats,
} from "../engine/scenePromptStats";

interface Props {
  scenes: Scene[];
}

export default function ScenePromptProgress({
  scenes,
}: Props) {
  const stats =
    getScenePromptStats(
      scenes
    );

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            Production Progress
          </p>

          <h2 className="mt-2 text-xl font-bold">
            📊 Scene Prompt Progress
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            Track how many scenes are fully ready for image, video, narration, and audio production.
          </p>
        </div>

        <div className="rounded-full border border-emerald-800 bg-emerald-950/30 px-4 py-2 text-sm font-semibold text-emerald-300">
          {stats.completionPercent}% Ready
        </div>
      </div>

      <div className="mt-6 h-3 overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all"
          style={{
            width: `${stats.completionPercent}%`,
          }}
        />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Info
          label="Scenes"
          value={`${stats.totalScenes}`}
        />

        <Info
          label="Ready"
          value={`${stats.readyScenes}`}
        />

        <Info
          label="Needs Work"
          value={`${stats.needsWorkScenes}`}
        />

        <Info
          label="Image Prompts"
          value={`${stats.imagePrompts}`}
        />

        <Info
          label="Video Prompts"
          value={`${stats.videoPrompts}`}
        />

        <Info
          label="Voice / Audio"
          value={`${stats.voicePrompts}`}
        />

        <Info
          label="Narration"
          value={`${stats.narrationScenes}`}
        />

        <Info
          label="Completion"
          value={`${stats.completionPercent}%`}
        />
      </div>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
      <p className="text-[10px] uppercase tracking-wide text-zinc-600">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-zinc-300">
        {value}
      </p>
    </div>
  );
}