import AppShell from "@/components/layout/AppShell";
import PromptPackImporter from "@/features/prompts/components/PromptPackImporter";

export default function PromptPacksPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-400">
            Prompt Packs
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            📦 Prompt Pack Manager
          </h1>

          <p className="mt-3 max-w-3xl text-zinc-400">
            Import built-in AI Creator OS packs or your own JSON prompt collections.
          </p>
        </div>

        <PromptPackImporter />
      </div>
    </AppShell>
  );
}