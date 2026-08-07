import AppShell from "@/components/layout/AppShell";
import Timeline from "@/features/timeline/components/Timeline";
import { getProject } from "@/lib/supabase/projects";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectPage({
  params,
}: Props) {
  const { id } = await params;

  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <Timeline project={project} />
      </div>
    </AppShell>
  );
}