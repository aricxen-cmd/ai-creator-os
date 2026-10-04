import AppShell from "@/components/layout/AppShell";

import ScriptForm from "@/features/script/components/ScriptForm";

import {
  getProject,
} from "@/lib/supabase/projects";

import {
  notFound,
} from "next/navigation";

import {
  buildTrendProductionContext,
  readTrendProjectSettings,
  trendDurationToScriptLength,
} from "@/features/trends/utils/projectTrendContract";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ScriptPage({
  params,
}: Props) {
  const { id } =
    await params;

  const project =
    await getProject(id);

  if (!project) {
    notFound();
  }

  const trendSettings =
    readTrendProjectSettings(
      project.settings
    );

  const productionContext =
    buildTrendProductionContext(
      trendSettings
    );

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-400">
            Writing
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            ✍️ AI Script Studio
          </h1>

          <p className="mt-3 max-w-3xl text-zinc-400">
            Generate a script using
            this project's saved
            research and production
            format.
          </p>
        </div>

        {trendSettings && (
          <div className="rounded-xl border border-emerald-900/60 bg-emerald-950/10 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
              🔥 Trend Script Mode
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h2 className="text-lg font-bold">
                {
                  trendSettings.trendFormatTitle
                }
              </h2>

              {trendSettings.duration && (
                <span className="rounded-full border border-emerald-800 px-3 py-1 text-xs text-emerald-300">
                  {
                    trendSettings.duration
                  }
                </span>
              )}

              {trendSettings.audioMode && (
                <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400">
                  {
                    trendSettings.audioMode
                  }
                </span>
              )}
            </div>
          </div>
        )}

        <ScriptForm
          projectId={
            project.id
          }
          research={
            project.research ??
            ""
          }
          initialTopic={
            trendSettings?.topic ??
            project.title ??
            ""
          }
          initialLength={
            trendDurationToScriptLength(
              trendSettings?.duration
            )
          }
          productionContext={
            productionContext
          }
        />
      </div>
    </AppShell>
  );
}