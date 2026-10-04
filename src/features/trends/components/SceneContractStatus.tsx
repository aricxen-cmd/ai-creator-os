import type {
  Scene,
} from "@/features/scenes/types";

import type {
  TrendProjectSettings,
} from "../utils/projectTrendContract";

import {
  buildSceneContract,
} from "../engine/buildSceneContract";

import {
  validateSceneContract,
} from "../engine/validateSceneContract";

interface Props {
  settings:
    TrendProjectSettings | null;

  scenes: Scene[];
}

export default function SceneContractStatus({
  settings,
  scenes,
}: Props) {
  const contract =
    buildSceneContract(
      settings
    );

  if (!contract) {
    return null;
  }

  const validation =
    validateSceneContract(
      scenes,
      contract
    );

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Scene Contract
          </p>

          <h2 className="mt-2 text-xl font-bold">
            Production Validation
          </h2>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${
            validation.pass
              ? "border-emerald-800 bg-emerald-950/30 text-emerald-400"
              : "border-red-800 bg-red-950/30 text-red-400"
          }`}
        >
          {validation.pass
            ? "PASS ✓"
            : "NEEDS WORK"}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Info
          label="Mode"
          value={
            contract.mode
          }
        />

        <Info
          label="Expected"
          value={
            contract.expectedScenes >
            0
              ? `${contract.expectedScenes} scenes`
              : "Dynamic"
          }
        />

        <Info
          label="Generated"
          value={`${validation.actualScenes} scenes`}
        />

        <Info
          label="Duration"
          value={
            contract.duration
          }
        />
      </div>

      {contract.expectedImages && (
        <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400">
          Expected production assets:{" "}
          <span className="font-semibold text-zinc-200">
            {
              contract.expectedImages
            }{" "}
            images
          </span>

          {contract.expectedPairs && (
            <>
              {" "}
              across{" "}
              <span className="font-semibold text-zinc-200">
                {
                  contract.expectedPairs
                }{" "}
                A/B pairs
              </span>
            </>
          )}
          .
        </div>
      )}

      {validation.errors.length >
        0 && (
        <div className="mt-5 rounded-lg border border-red-900/60 bg-red-950/20 p-4">
          <p className="text-sm font-semibold text-red-400">
            Contract Errors
          </p>

          <div className="mt-3 space-y-2">
            {validation.errors.map(
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

      {validation.warnings.length >
        0 && (
        <div className="mt-5 rounded-lg border border-amber-900/60 bg-amber-950/10 p-4">
          <p className="text-sm font-semibold text-amber-400">
            Warnings
          </p>

          <div className="mt-3 space-y-2">
            {validation.warnings.map(
              (warning) => (
                <p
                  key={
                    warning
                  }
                  className="text-sm text-amber-300"
                >
                  ⚠ {warning}
                </p>
              )
            )}
          </div>
        </div>
      )}

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Contract Rules
        </p>

        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {contract.rules.map(
            (rule) => (
              <p
                key={rule}
                className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-sm leading-6 text-zinc-400"
              >
                ✓ {rule}
              </p>
            )
          )}
        </div>
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