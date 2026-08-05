import StatCard from "@/components/ui/StatCard";
import NewProjectDialog from "@/components/projects/NewProjectDialog";
import ProjectCard from "@/components/projects/ProjectCard";
import { getProjects } from "@/lib/supabase/projects";
import AppShell from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";

export default async function DashboardPage() {
  const projects = await getProjects();
  console.log("Projects:", projects);
  return (
    <AppShell>

      <div className="mb-8 flex items-center justify-between">
  <div>
    <h1 className="text-4xl font-bold">
      Dashboard
    </h1>

    <p className="mt-2 text-zinc-400">
      Welcome back to AI Creator OS
    </p>
  </div>

  <NewProjectDialog />
</div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard
  title="Projects"
  value={projects.length}
/>
        <StatCard title="Saved Prompts" value={348} />
        <StatCard title="AI Runs" value={2431} />
        <StatCard title="Videos" value={56} />
      </div>

      {/* Recent Projects */}
<div className="mt-8">
  <Card className="p-6">

  <h2 className="mb-4 text-xl font-bold">
    Recent Projects
  </h2>

  <div className="space-y-4">
    {projects.length === 0 ? (
      <p className="text-zinc-500">
        No projects yet.
      </p>
    ) : (
      projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
        />
      ))
    )}
  </div>

</Card>
      </div>

    </AppShell>
  );
}
