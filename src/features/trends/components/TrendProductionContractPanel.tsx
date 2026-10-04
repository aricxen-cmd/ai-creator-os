import type {
  TrendProjectSettings,
} from "../utils/projectTrendContract";

interface Props {
  settings:
    TrendProjectSettings | null;
}

export default function TrendProductionContractPanel({
  settings,
}: Props) {
  if (!settings) {
    return null;
  }

  const rules =
    Array.isArray(
      settings.productionRules
    )
      ? settings.productionRules
      : [];

  return (
    <div className="rounded-xl border border-emerald-900/60 bg-emerald-950/10 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            🔥 Active Production Contract
          </p>

          <h2 className="mt-2 text-xl font-bold">
            {settings.trendFormatTitle ??
              "Trend Format"}
          </h2>

          {settings.topic && (
            <p className="mt-2 text-sm text-zinc-400">
              {settings.topic}
            </p>
          )}
        </div>

        {settings.duration && (
          <span className="rounded-full border border-emerald-800 bg-emerald-950/30 px-3 py-1 text-xs text-emerald-300">
            {settings.duration}
          </span>
        )}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Info
          label="Structure"
          value={
            settings.structureFamily ??
            "—"
          }
        />

        <Info
          label="Audio"
          value={
            settings.audioMode ??
            "—"
          }
        />

        <Info
          label="Style"
          value={
            settings.style ??
            "—"
          }
        />

        <Info
          label="Model"
          value={
            settings.recommendedModel ??
            "—"
          }
        />
      </div>

      {rules.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Production Rules
          </p>

          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {rules.map(
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