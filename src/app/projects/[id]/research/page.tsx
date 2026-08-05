import AppShell from "@/components/layout/AppShell";

export default function ProjectResearchPage() {
  return (
    <AppShell>
      <div className="space-y-6">

        <h1 className="text-4xl font-bold">
          🔬 Research
        </h1>

        <textarea
          className="h-125 w-full rounded-xl border border-zinc-800 bg-zinc-900 p-6"
          placeholder="Research will appear here..."
        />

        <button className="rounded-lg bg-emerald-600 px-6 py-3">
          Generate Research
        </button>

      </div>
    </AppShell>
  );
}