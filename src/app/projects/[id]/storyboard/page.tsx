import AppShell from "@/components/layout/AppShell";

import StoryboardForm from "@/features/storyboard/components/StoryboardForm";

import {
  getProject,
} from "@/lib/supabase/projects";

import {
  notFound,
} from "next/navigation";

import {
  getTrendTimingContract,
  readTrendFromSettings,
} from "@/features/trends/utils/trendTimingContract";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function StoryboardPage({
  params,
}: Props) {
  const {
    id,
  } = await params;

  const project =
    await getProject(
      id
    );

  if (!project) {
    notFound();
  }

  const trend =
    readTrendFromSettings(
      project.settings
    );

  const timingContract =
    getTrendTimingContract(
      trend
    );

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-400">
            Production
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            🎬 Storyboard Studio
          </h1>

          <p className="mt-3 max-w-3xl text-zinc-400">
            Turn the saved script
            into a production
            storyboard while
            enforcing the Trend
            Production Contract.
          </p>
        </div>

        {timingContract && (
          <div className="rounded-xl border border-emerald-900/60 bg-emerald-950/10 p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                  Timing Contract
                </p>

                <h2 className="mt-2 text-xl font-bold">
                  {
                    timingContract.description
                  }
                </h2>

                <p className="mt-2 text-sm text-zinc-400">
                  Storyboard generation
                  must match this scene
                  count and timing exactly.
                </p>
              </div>

              <span className="rounded-full border border-emerald-800 bg-emerald-950/50 px-3 py-1 text-xs font-semibold text-emerald-400">
                ENFORCED
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <TimingValue
                label="Total Runtime"
                value={`${timingContract.totalDurationSeconds}s`}
              />

              <TimingValue
                label="Scene Count"
                value={`${timingContract.sceneCount}`}
              />

              <TimingValue
                label="Each Scene"
                value={`${timingContract.sceneDurationSeconds}s`}
              />
            </div>
          </div>
        )}

        <StoryboardForm
          projectId={
            project.id
          }
          initialScript={
            project.script ??
            ""
          }
          initialStoryboard={
            project.storyboard ??
            ""
          }
        />
      </div>
    </AppShell>
  );
}

function TimingValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
      <p className="text-[10px] uppercase tracking-wide text-zinc-600">
        {
          label
        }
      </p>

      <p className="mt-1 text-lg font-bold text-zinc-200">
        {
          value
        }
      </p>
    </div>
  );
}