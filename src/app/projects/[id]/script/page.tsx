import AppShell from "@/components/layout/AppShell";
import ScriptForm from "@/features/script/components/ScriptForm";
import { getProject } from "@/lib/supabase/projects";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ScriptPage({
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
            ✍️ AI Script Studio
          </h1>

          <p className="mt-2 text-zinc-400">
            Generate a script using this project's saved research.
          </p>
        </div>

        <ScriptForm
          projectId={project.id}
          initialScript={project.script ?? ""}
          research={project.research ?? ""}
        />
      </div>
    </AppShell>
  );
}