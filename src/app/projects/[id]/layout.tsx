import { getProject } from "@/lib/supabase/projects";
import { notFound } from "next/navigation";
import ProjectNavigation from "@/components/projects/ProjectNavigation";

interface Props {
  children: React.ReactNode;

  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectLayout({
  children,
  params,
}: Props) {
  const { id } = await params;

  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">
          {project.title}
        </h1>

        <p className="mt-2 text-zinc-400">
          {project.description || "No description"}
        </p>
      </div>

      <ProjectNavigation projectId={id} />

      {children}
    </div>
  );
}
