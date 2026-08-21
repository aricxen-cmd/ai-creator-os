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
    <Link
      href={`/projects/${projectId}/${route}`}
      className="block"
    >
      <div className="h-full rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-emerald-500 hover:bg-zinc-900/80">
        <div className="text-3xl">
          {icon}
        </div>

        <h3 className="mt-4 text-xl font-bold">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-zinc-400">
          {description}
        </p>

        <div className="mt-5 text-sm font-medium text-emerald-400">
          Open →
        </div>
      </div>
    </Link>
  );
}