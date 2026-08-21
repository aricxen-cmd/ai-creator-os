import AppShell from "@/components/layout/AppShell";
import PromptLibrary from "@/features/prompts/components/PromptLibrary";

export default function PromptLibraryPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-400">
            Prompt Vault
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            📚 Prompt Library
          </h1>

          <p className="mt-3 max-w-3xl text-zinc-400">
            Search, edit, favorite, copy, and reuse your saved prompt collection.
          </p>
        </div>

        <PromptLibrary />
      </div>
    </AppShell>
  );
}