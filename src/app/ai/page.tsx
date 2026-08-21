import AppShell from "@/components/layout/AppShell";
import AIStudio from "@/components/ai/AIStudio";

export default function AIStudioPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-400">
            AI Playground
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            🤖 AI Studio
          </h1>

          <p className="mt-3 max-w-3xl text-zinc-400">
            Test prompts, compare ideas, and experiment with AI responses
            before using them inside your projects.
          </p>
        </div>

        <AIStudio />
      </div>
    </AppShell>
  );
}