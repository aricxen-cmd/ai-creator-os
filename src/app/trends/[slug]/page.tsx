import AppShell from "@/components/layout/AppShell";
import { trends } from "@/lib/trends";
import TopicCard from "@/components/trends/TopicCard";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function TrendPage({ params }: Props) {
  const { slug } = await params;

  const trend = trends.find((t) => t.slug === slug);

  if (!trend) {
    return (
      <AppShell>
        <h1 className="text-3xl font-bold">
          Trend not found
        </h1>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-8">

        <div>
          <h1 className="text-4xl font-bold">
            {trend.title}
          </h1>

          <p className="mt-2 text-zinc-400">
            {trend.description}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

          <h2 className="mb-4 text-xl font-bold">
            Trending Topics
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {trend.topics.map((topic) => (
  <TopicCard
    key={topic}
    topic={topic}
  />
))}
          </div>

        </div>

      </div>
    </AppShell>
  );
}