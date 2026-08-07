import Link from "next/link";
import { TimelineItem } from "../types";

interface Props {
  projectId: string;
  item: TimelineItem;
}

export default function TimelineCard({
  projectId,
  item,
}: Props) {
  const icon = item.completed
    ? "✅"
    : item.current
    ? "🟡"
    : item.locked
    ? "🔒"
    : "⚪";

  return (
    <Link
      href={
        item.locked
          ? "#"
          : `/projects/${projectId}/${item.id}`
      }
      className={`block rounded-xl border p-5 transition ${
        item.locked
          ? "cursor-not-allowed border-zinc-800 bg-zinc-900 opacity-50"
          : "border-zinc-700 bg-zinc-900 hover:border-emerald-500"
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {icon} {item.title}
        </h3>

        <span className="text-sm text-zinc-400">
          {item.progress}%
        </span>
      </div>
    </Link>
  );
}