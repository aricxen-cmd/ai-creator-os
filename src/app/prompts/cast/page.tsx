import AppShell from "@/components/layout/AppShell";

import CastLibraryManager from "@/features/prompts/components/CastLibraryManager";

export default function CastLibraryPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-400">
            Character Consistency
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            🎭 Cast Library
          </h1>

          <p className="mt-3 max-w-3xl text-zinc-400">
            Create and manage
            reusable character
            Cast Locks for your
            productions.
          </p>
        </div>

        <CastLibraryManager />
      </div>
    </AppShell>
  );
}