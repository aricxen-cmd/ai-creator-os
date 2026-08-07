import AppShell from "@/components/layout/AppShell";
import ProjectCard from "@/components/projects/ProjectCard";
import NewProjectDialog from "@/components/projects/NewProjectDialog";
import { getProjects } from "@/lib/supabase/projects";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold">Projects</h1>

            <p className="mt-2 text-zinc-400">
              Create and manage your AI video projects.
            </p>
          </div>

          <NewProjectDialog />
        </div>

        {/* Project Count */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-sm text-zinc-400">Total Projects</p>

          <p className="mt-1 text-3xl font-bold">
            {projects.length}
          </p>
        </div>

        {/* Projects */}
        {projects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/50 p-12 text-center">
            <div className="text-5xl">🎬</div>

            <h2 className="mt-4 text-xl font-semibold">
              No projects yet
            </h2>

            <p className="mt-2 text-zinc-400">
              Create your first project to start building AI-powered videos.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}