import AppShell from "@/components/layout/AppShell";

import ResearchForm from "@/features/research/components/ResearchForm";

import {
  getProject,
} from "@/lib/supabase/projects";

import {
  notFound,
} from "next/navigation";

import {
  readTrendProjectSettings,
  TrendProjectSettings,
} from "@/features/trends/utils/projectTrendContract";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ResearchPage({
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
            Research
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            🔬 Research Studio
          </h1>

          <p className="mt-3 max-w-3xl text-zinc-400">
            Research your topic
            and save the results
            directly to this
            project.
          </p>
        </div>

        {trendSettings && (
          <div className="rounded-xl border border-emerald-900/60 bg-emerald-950/10 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
              🔥 Trend-Aware Research
            </p>

            <h2 className="mt-2 text-lg font-bold">
              {
                trendSettings.trendFormatTitle
              }
            </h2>

            <p className="mt-2 text-sm text-zinc-400">
              Research Studio will
              automatically research
              this topic for the
              selected Trend format.
            </p>
          </div>
        )}

        <ResearchForm
          {...({
            projectId:
              project.id,
            initialResearch:
              project.research ??
              "",
            initialTopic:
              project.topic ??
              "",
            productionContext,
          } as any)}
        />
      </div>
    </AppShell>
  );
}

function buildTrendProductionContext(trendSettings: TrendProjectSettings | null) {
  if (!trendSettings) {
    return null;
  }

  return {
    ...trendSettings,
    trendFormatTitle:
      trendSettings.trendFormatTitle,
  };
}
