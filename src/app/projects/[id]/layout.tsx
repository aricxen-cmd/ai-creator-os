import Link from "next/link";
import { getProject } from "@/lib/supabase/projects";
import { notFound } from "next/navigation";

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

  const tabs = [
    { name: "Overview", href: `/projects/${id}` },
    { name: "Research", href: `/projects/${id}/research` },
    { name: "Script", href: `/projects/${id}/script` },
    { name: "Storyboard", href: `/projects/${id}/storyboard` },
    { name: "Scene Prompts", href: `/projects/${id}/scene-prompts` },
    { name: "Thumbnail", href: `/projects/${id}/thumbnail` },
    { name: "Assets", href: `/projects/${id}/assets` },
  ];

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

      <div className="flex flex-wrap gap-3 border-b border-zinc-800 pb-4">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className="rounded-lg bg-zinc-900 px-4 py-2 hover:bg-emerald-600"
          >
            {tab.name}
          </Link>
        ))}
      </div>

      {children}
    </div>
  );
}