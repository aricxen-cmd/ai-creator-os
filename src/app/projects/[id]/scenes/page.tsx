import AppShell from "@/components/layout/AppShell";

import {
  getProject,
} from "@/lib/supabase/projects";

import {
  notFound,
} from "next/navigation";

import SceneList from "@/features/scenes/components/SceneList";
import CastDiscoveryPanel from "@/features/scenes/components/CastDiscoveryPanel";
import ScenePlanner from "@/features/scenes/components/ScenePlanner";
import { normalizeScenes } from "@/lib/supabase/scenes";

import StyleDiscoveryPanel from "@/features/scenes/components/StyleDiscoveryPanel";

import type {
  Scene,
} from "@/features/scenes/types";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ScenesPage({
  params,
}: Props) {
  const { id } =
    await params;

  const project =
    await getProject(id);

  if (!project) {
    notFound();
  }

  const scenes: Scene[] = normalizeScenes(project.scenes);

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-400">
            Production
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            🎬 Scene Studio
          </h1>

          <p className="mt-3 max-w-3xl text-zinc-400">
            Discover your
            characters, choose
            the visual direction,
            review per-scene
            cast, and generate
            production-ready
            image and video
            prompts.
          </p>
        </div>

        {/* CAST DISCOVERY */}

        <ScenePlanner
          projectId={project.id}
          initialScenes={scenes}
        />

        <CastDiscoveryPanel
          scenes={scenes}
          script={
            project.script ??
            ""
          }
          storyboard={
            project.storyboard ??
            ""
          }
        />

        {/* STYLE DISCOVERY */}

        <StyleDiscoveryPanel
          scenes={scenes}
          script={
            project.script ??
            ""
          }
          storyboard={
            project.storyboard ??
            ""
          }
        />

        {/* SCENE AUTOMATION */}

        <SceneList
          projectId={
            project.id
          }
          scenes={
            scenes
          }
        />
      </div>
    </AppShell>
  );
}
