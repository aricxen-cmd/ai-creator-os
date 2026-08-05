import Link from "next/link";

interface TrendCardProps {
  title: string;
  description: string;
  slug: string;
  color?: string;
}

export default function TrendCard({
  title,
  description,
  slug,
  color = "border-zinc-800",
}: TrendCardProps) {
  return (
    <Link href={`/trends/${slug}`}>
      <div className={`group cursor-pointer rounded-xl border bg-zinc-900 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500 hover:shadow-xl ${color}`}>

        <h2 className="text-xl font-bold">
          {title}
        </h2>

        <p className="mt-3 text-zinc-400">
          {description}
        </p>

        <div className="mt-6 text-emerald-400 opacity-0 group-hover:opacity-100">
          Open Trend →
        </div>

      </div>
    </Link>
  );
}
