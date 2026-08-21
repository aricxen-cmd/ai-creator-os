import AppShell from "@/components/layout/AppShell";

import ResearchForm from "@/features/research/components/ResearchForm";

export default function ResearchPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-400">
            Research Engine
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            🔬 Research Studio
          </h1>

          <p className="mt-3 max-w-3xl text-zinc-400">
            Research topics before writing your script.
            Collect useful facts, comparisons, hooks, angles,
            and production notes in one place.
          </p>
        </div>

        <ResearchForm />
      </div>
    </AppShell>
  );
}