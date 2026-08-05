import AppShell from "@/components/layout/AppShell";

export default function ScriptPage() {
  return (
    <AppShell>
      <div className="space-y-8">

        <div>
          <h1 className="text-4xl font-bold">
            Script Studio
          </h1>

          <p className="mt-2 text-zinc-400">
            Generate, edit, and organize YouTube scripts.
          </p>
        </div>

        <textarea
          className="h-125 w-full rounded-xl border border-zinc-800 bg-zinc-900 p-6"
          placeholder="Your AI-generated script will appear here..."
        />

        <div className="flex gap-4">

          <button className="rounded-lg bg-emerald-600 px-6 py-3">
            Generate Script
          </button>

          <button className="rounded-lg bg-zinc-800 px-6 py-3">
            Save
          </button>

        </div>

      </div>
    </AppShell>
  );
}