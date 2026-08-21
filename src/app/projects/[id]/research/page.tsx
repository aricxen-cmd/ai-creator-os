import AppShell from "@/components/layout/AppShell";
import ResearchForm from "@/features/research/components/ResearchForm";
import { getProject } from "@/lib/supabase/projects";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ResearchPage({
  params,
}: Props) {
  const { id } = await params;

  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <h1 className="text-4xl font-bold">
            🔬 Research Studio
          </h1>

          <p className="mt-2 text-zinc-400">
            Research your topic and save the results directly to this project.
          </p>
        </div>

        <ResearchForm
          projectId={project.id}
          initialResearch={project.research ?? ""}
        />
      </div>
    </AppShell>
  );
}