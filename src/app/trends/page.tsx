import AppShell from "@/components/layout/AppShell";

import TrendEngine from "@/features/trends/components/TrendEngine";

export default function TrendsPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-400">
            Content Discovery
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            🔥 Trends Engine
          </h1>

          <p className="mt-3 max-w-3xl text-zinc-400">
            Discover proven video
            structures, production
            formats, story engines,
            visual systems, and
            reusable viral prompt
            templates.
          </p>
        </div>

        <TrendEngine />
      </div>
    </AppShell>
  );
}