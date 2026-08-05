import AppShell from "@/components/layout/AppShell";
import TrendCard from "@/components/trends/TrendCard";

export default function TrendsPage() {
  const trends = [
  {
    title: "Artificial Intelligence",
    slug: "artificial-intelligence",
    description: "Latest AI tools, robotics, ChatGPT, automation, and future technology.",
  },
  {
    title: "Finance",
    slug: "finance",
    description: "Investing, stocks, crypto, passive income, and wealth-building ideas.",
  },
  {
    title: "Gaming",
    slug: "gaming",
    description: "New releases, esports, gameplay ideas, and gaming news.",
  },
  {
    title: "History",
    slug: "history",
    description: "Historical events, documentaries, mysteries, and timelines.",
  },
  {
    title: "Technology",
    slug: "technology",
    description: "Consumer tech, gadgets, software, and innovation.",
  },
  {
    title: "Space",
    slug: "space",
    description: "NASA, SpaceX, astronomy, and discoveries beyond Earth.",
  },
  {
    title: "Comedy",
    slug: "comedy",
    description: "Funny concepts, memes, and viral entertainment formats.",
  },
  {
    title: "Horror",
    slug: "horror",
    description: "Scary stories, creepy facts, paranormal, and suspense.",
  },
];

  return (
    <AppShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">
            🔥 Trends Lab
          </h1>

          <p className="mt-2 text-zinc-400">
            Discover trending ideas for your next YouTube project.
          </p>
        </div>

        <input
          type="text"
          placeholder="Search trends..."
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3"
        />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
  {trends.map((trend) => (
    <TrendCard
      key={trend.title}
      title={trend.title}
      slug={trend.slug}
      description={trend.description}
    />
  ))}
</div>
        </div>
      </div>
    </AppShell>
  );
}