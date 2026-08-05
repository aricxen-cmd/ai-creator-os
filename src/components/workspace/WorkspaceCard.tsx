import Link from "next/link";

interface WorkspaceCardProps {
  projectId: string;
  title: string;
  icon: string;
  description: string;
  route: string;
}

export default function WorkspaceCard({
  projectId,
  title,
  icon,
  description,
  route,
}: WorkspaceCardProps) {
  return (
    <Link href={`/projects/${projectId}/${route}`}>
      <div className="cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-emerald-500 hover:shadow-lg">
        <div className="text-4xl">{icon}</div>

        <h2 className="mt-4 text-xl font-bold">
          {title}
        </h2>

        <p className="mt-2 text-zinc-400">
          {description}
        </p>

        <div className="mt-6 text-sm text-emerald-400">
          Open →
        </div>
      </div>
    </Link>
  );
}