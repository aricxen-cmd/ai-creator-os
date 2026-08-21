import AppShell from "@/components/layout/AppShell";

import StoryboardForm from "@/features/storyboard/components/StoryboardForm";

import {
  getProject,
} from "@/lib/supabase/projects";

import {
  notFound,
} from "next/navigation";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function StoryboardPage({
  params,
}: Props) {
  const { id } =
    await params;

  const project =
    await getProject(id);

  if (!project) {
    notFound();
  }

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
            Turn the project's
            saved script into a
            structured visual
            storyboard and save
            it back to the
            production.
          </p>
        </div>

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