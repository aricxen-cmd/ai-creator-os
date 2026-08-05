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

  const sections = [
  {
    title: "Research",
    icon: "🔬",
    route: "research",
  },
  {
    title: "Script",
    icon: "✍️",
    route: "script",
  },
  {
    title: "Storyboard",
    icon: "🎬",
    route: "storyboard",
  },
  {
    title: "Scene Prompts",
    icon: "🎥",
    route: "scene-prompts",
  },
  {
    title: "Thumbnail",
    icon: "🖼️",
    route: "thumbnail",
  },
  {
    title: "Assets",
    icon: "📦",
    route: "assets",
  },
];

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="grid gap-6 md:grid-cols-3">

  <WorkspaceCard
    projectId={project.id}
    title="Research"
    icon="🔬"
    description="Research your topic"
    route="research"
  />

  <WorkspaceCard
    projectId={project.id}
    title="Script"
    icon="✍️"
    description="Write your script"
    route="script"
  />

  <WorkspaceCard
    projectId={project.id}
    title="Storyboard"
    icon="🎬"
    description="Create scenes"
    route="storyboard"
  />

  <WorkspaceCard
    projectId={project.id}
    title="Scene Prompts"
    icon="🎥"
    description="Generate AI prompts"
    route="scene-prompts"
  />

  <WorkspaceCard
    projectId={project.id}
    title="Thumbnail"
    icon="🖼️"
    description="Design thumbnails"
    route="thumbnail"
  />

  <WorkspaceCard
    projectId={project.id}
    title="Assets"
    icon="📦"
    description="Manage assets"
    route="assets"
  />

</div>
      </div>
    </AppShell>
  );
}