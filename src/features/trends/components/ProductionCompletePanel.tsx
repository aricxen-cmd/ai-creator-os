import type {
  Scene,
} from "@/features/scenes/types";

import type {
  TrendProjectSettings,
} from "../utils/projectTrendContract";

import {
  validateProductionReadiness,
} from "../engine/validateProductionReadiness";

interface Props {
  scenes: Scene[];

  settings:
    TrendProjectSettings | null;

  projectStatus?: string | null;
}

export default function ProductionCompletePanel({
  scenes,
  settings,
  projectStatus,
}: Props) {
  const readiness =
    validateProductionReadiness(
      scenes,
      settings
    );

  if (!readiness.ready) {
    return null;
  }

  return (
    <div className="rounded-xl border border-emerald-800 bg-emerald-950/20 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            Production Complete
          </p>

          <h2 className="mt-2 text-2xl font-bold text-emerald-300">
            🎉 Scene Production Ready
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-300">
            Every blocking scene contract and prompt-quality check has passed.
            This project is ready to move into image, video, audio, and editing production.
          </p>
        </div>

        <span className="rounded-full border border-emerald-700 bg-emerald-950/40 px-4 py-2 text-sm font-semibold text-emerald-300">
          {projectStatus ===
          "Production Ready"
            ? "PROJECT READY"
            : "VALIDATION PASSED"}
        </span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Info
          label="Scenes"
          value={`${readiness.totalScenes}`}
        />

        <Info
          label="Ready Scenes"
          value={`${readiness.readyScenes}`}
        />

        <Info
          label="Contract"
          value="Pass"
        />

        <Info
          label="Prompt Quality"
          value="Pass"
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
    <div className="rounded-lg border border-emerald-900/50 bg-zinc-950 p-3">
      <p className="text-[10px] uppercase tracking-wide text-zinc-600">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-zinc-200">
        {value}
      </p>
    </div>
  );
}