import { getPrompts } from "@/lib/supabase/prompts";
import CategoryBadge from "@/components/prompts/CategoryBadge";

export default async function PromptVaultPage() {
  const prompts = await getPrompts();

  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold">
        Prompt Vault
      </h1>

      <p className="mt-2 text-zinc-500">
        Store and organize all of your AI prompts.
      </p>

      <div className="mt-8 space-y-4">
        {prompts.map((prompt) => (
          <div
            key={prompt.id}
            className="rounded-lg border p-6"
          >
            <h2 className="text-xl font-bold">
              {prompt.title}
            </h2>

            <div className="mt-4">
  <CategoryBadge category={prompt.category} />
</div>
          </div>
        ))}

        {prompts.length === 0 && (
          <p className="text-zinc-500">
            No prompts yet.
          </p>
        )}
      </div>
    </main>
  );
}