import {
  notFound,
} from "next/navigation";

import AppShell from "@/components/layout/AppShell";

import {
  getProject,
} from "@/lib/supabase/projects";

import SceneList from "@/features/scenes/components/SceneList";

import StyleDiscoveryPanel from "@/features/scenes/components/StyleDiscoveryPanel";

import SceneTimingStatus from "@/features/scenes/components/SceneTimingStatus";

import RepairSceneTiming from "@/features/scenes/components/RepairSceneTiming";

import type {
  Scene,
} from "@/features/scenes/types";

import {
  getTrendTimingContract,
  readTrendFromSettings,
} from "@/features/trends/utils/trendTimingContract";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ScenesPage({
  params,
}: PageProps) {
  /*
   * Next.js 16 dynamic route params.
   */
  const {
    id,
  } = await params;

  /*
   * Load project from Supabase.
   */
  const project =
    await getProject(id);

  if (!project) {
    notFound();
  }

  /*
   * Safely load scenes.
   */
  const scenes: Scene[] =
    Array.isArray(
      project.scenes
    )
      ? (
          project.scenes as Scene[]
        )
      : [];

  /*
   * Existing project content used
   * by Style Discovery.
   */
  const script =
    project.script ?? "";

  const storyboard =
    project.storyboard ?? "";

  /*
   * Read the Trend Production
   * Contract from project settings.
   */
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
      <main className="mx-auto w-full max-w-7xl space-y-6 p-6">

        {/* ============================== */}
        {/* PAGE HEADER                    */}
        {/* ============================== */}

        <section className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-500">
                AI Creator OS
              </p>

              <h1 className="mt-2 text-3xl font-bold text-zinc-100">
                🎬 Scene Studio
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                Build, review, and
                prepare every scene
                for production.
              </p>
            </div>

            <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-600">
                Project
              </p>

              <p className="mt-1 font-semibold text-zinc-300">
                {
                  project.title
                }
              </p>
            </div>
          </div>
        </section>

        {/* ============================== */}
        {/* SCENE TIMING STATUS            */}
        {/* ============================== */}

        <SceneTimingStatus
          scenes={
            scenes
          }
          timingContract={
            timingContract
          }
        />

        {/* ============================== */}
        {/* REPAIR + UNDO SCENE TIMING     */}
        {/* ============================== */}

        <RepairSceneTiming
          projectId={
            project.id
          }
          scenes={
            scenes
          }
          timingContract={
            timingContract
          }
          history={
            project.history
          }
        />

        {/* ============================== */}
        {/* PRODUCTION CONTRACT            */}
        {/* ============================== */}

        {timingContract && (
          <section className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-500">
                  Production Contract
                </p>

                <h2 className="mt-2 text-xl font-bold text-zinc-100">
                  Scene Requirements
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                  Scene timing is
                  controlled by the
                  production contract
                  selected earlier in
                  the workflow.
                </p>
              </div>

              <span className="rounded-full border border-violet-900 bg-violet-950/30 px-3 py-1 text-xs font-semibold text-violet-400">
                {
                  timingContract.exact
                    ? "EXACT"
                    : "ESTIMATED"
                }
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <ContractMetric
                label="Scene Count"
                value={
                  `${timingContract.sceneCount}`
                }
              />

              <ContractMetric
                label="Per Scene"
                value={
                  `${timingContract.sceneDurationSeconds}s`
                }
              />

              <ContractMetric
                label="Total Runtime"
                value={
                  `${timingContract.totalDurationSeconds}s`
                }
              />

              <ContractMetric
                label="Timing"
                value={
                  `${timingContract.sceneCount} × ${timingContract.sceneDurationSeconds}s`
                }
              />
            </div>

            {timingContract.description && (
              <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
                <p className="text-sm leading-6 text-zinc-500">
                  {
                    timingContract.description
                  }
                </p>
              </div>
            )}
          </section>
        )}

        {/* ============================== */}
        {/* STYLE DISCOVERY                */}
        {/* ============================== */}

        <StyleDiscoveryPanel
          scenes={
            scenes
          }
          script={
            script
          }
          storyboard={
            storyboard
          }
        />

        {/* ============================== */}
        {/* SCENE LIST                     */}
        {/* ============================== */}

        <section className="rounded-xl border border-zinc-800 bg-zinc-950/20 p-6">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
              Production Scenes
            </p>

            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-zinc-100">
                  Scenes
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Review and prepare
                  each scene for image,
                  video, and voice
                  generation.
                </p>
              </div>

              <span className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1 text-xs font-semibold text-zinc-400">
                {
                  scenes.length
                }
                {" "}
                {
                  scenes.length === 1
                    ? "SCENE"
                    : "SCENES"
                }
              </span>
            </div>
          </div>

          <SceneList
            projectId={
              project.id
            }
            scenes={
              scenes
            }
          />
        </section>

        {/* ============================== */}
        {/* EMPTY STATE                    */}
        {/* ============================== */}

        {scenes.length === 0 && (
          <section className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950/30 p-8 text-center">
            <div className="text-4xl">
              🎬
            </div>

            <h2 className="mt-4 text-xl font-bold text-zinc-200">
              No scenes yet
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-zinc-500">
              Generate or save a
              storyboard first, then
              build your production
              scenes here.
            </p>
          </section>
        )}
      </main>
    </AppShell>
  );
}

function ContractMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-600">
        {
          label
        }
      </p>

      <p className="mt-2 text-xl font-bold text-zinc-200">
        {
          value
        }
      </p>
    </div>
  );
}