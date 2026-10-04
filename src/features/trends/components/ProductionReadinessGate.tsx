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
}

export default function ProductionReadinessGate({
  scenes,
  settings,
}: Props) {
  const readiness =
    validateProductionReadiness(
      scenes,
      settings
    );

  return (
    <div
      className={`rounded-xl border p-6 ${
        readiness.ready
          ? "border-emerald-900/60 bg-emerald-950/10"
          : "border-amber-900/60 bg-amber-950/10"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Export Gate
          </p>

          <h2 className="mt-2 text-xl font-bold">
            {readiness.ready
              ? "✅ Production Ready"
              : "⚠ Not Ready for Export"}
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            AI Creator OS checks scene
            count, contract compliance,
            image prompts, video prompts,
            and required production
            details before marking this
            project ready.
          </p>
        </div>

        <span
          className={`rounded-full border px-4 py-2 text-sm font-semibold ${
            readiness.ready
              ? "border-emerald-800 bg-emerald-950/30 text-emerald-300"
              : "border-amber-800 bg-amber-950/30 text-amber-300"
          }`}
        >
          {readiness.ready
            ? "EXPORT READY"
            : "NEEDS WORK"}
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
          label="Bad Scenes"
          value={`${readiness.badScenes}`}
        />

        <Info
          label="Contract"
          value={
            readiness.contractPass
              ? "Pass"
              : "Fail"
          }
        />
      </div>

      {readiness.errors.length >
        0 && (
        <div className="mt-5 rounded-lg border border-red-900/60 bg-red-950/20 p-4">
          <p className="text-sm font-semibold text-red-400">
            Blocking Issues
          </p>

          <div className="mt-3 space-y-2">
            {readiness.errors
              .slice(0, 10)
              .map(
                (error) => (
                  <p
                    key={error}
                    className="text-sm text-red-300"
                  >
                    ✕ {error}
                  </p>
                )
              )}
          </div>
        </div>
      )}

      {readiness.warnings.length >
        0 && (
        <div className="mt-5 rounded-lg border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-sm font-semibold text-amber-400">
            Warnings
          </p>

          <div className="mt-3 space-y-2">
            {readiness.warnings
              .slice(0, 10)
              .map(
                (warning) => (
                  <p
                    key={warning}
                    className="text-sm text-zinc-400"
                  >
                    ⚠ {warning}
                  </p>
                )
              )}
          </div>
        </div>
      )}
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