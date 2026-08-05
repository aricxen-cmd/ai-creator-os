import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({
  project,
}: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="cursor-pointer transition hover:border-emerald-500 hover:shadow-lg">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold">
            {project.title}
          </h2>

          <p className="mt-2 text-zinc-400">
            {project.description || "No description"}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <span className="rounded bg-emerald-600/20 px-3 py-1 text-sm text-emerald-400">
              {project.status}
            </span>

            <span className="text-xs text-zinc-500">
              Open →
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}