import AppShell from "@/components/layout/AppShell";
import NewLibraryPromptForm from "@/features/prompts/components/NewLibraryPromptForm";

export default function NewPromptPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-400">
            Prompt Vault
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            ➕ New Prompt
          </h1>

          <p className="mt-3 max-w-3xl text-zinc-400">
            Add a reusable master
            prompt to your Prompt
            Vault.
          </p>
        </div>

        <NewLibraryPromptForm />
      </div>
    </AppShell>
  );
}