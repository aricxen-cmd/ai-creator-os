import AppShell from "@/components/layout/AppShell";
import { getProject } from "@/lib/supabase/projects";
import { notFound } from "next/navigation";
import WorkspaceCard from "@/components/workspace/WorkspaceCard";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectWorkspace({
  params,
}: Props) {
  const { id } = await params;

  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  return (
    <AppShell>
      <div className="space-y-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-400">
            Project Workspace
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {project.title}
          </h2>

          <p className="mt-2 text-zinc-400">
            Move through the AI video production workflow.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <WorkspaceCard
            projectId={project.id}
            title="Research"
            icon="🔬"
            description="Research your topic and save useful context."
            route="research"
          />

          <WorkspaceCard
            projectId={project.id}
            title="Script"
            icon="✍️"
            description="Generate and edit your production script."
            route="script"
          />

          <WorkspaceCard
            projectId={project.id}
            title="Storyboard"
            icon="🎬"
            description="Turn your script into structured scenes."
            route="storyboard"
          />

          <WorkspaceCard
            projectId={project.id}
            title="Scenes"
            icon="🎭"
            description="Manage scenes, cast, and automatic AI prompts."
            route="scenes"
          />
        </div>
      </div>
    </AppShell>
  );
}