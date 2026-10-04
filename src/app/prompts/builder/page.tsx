import AppShell from "@/components/layout/AppShell";

import PromptBuilder from "@/features/prompts/components/PromptBuilder";

import {
  getPromptLibraryItem,
  incrementPromptUse,
  type PromptLibraryRow,
} from "@/lib/supabase/promptLibrary";

interface Props {
  searchParams: Promise<{
    projectId?: string;
    sceneId?: string;
    libraryPromptId?: string;
  }>;
}

export default async function PromptBuilderPage({
  searchParams,
}: Props) {
  const {
    projectId = "",
    sceneId = "",
    libraryPromptId = "",
  } = await searchParams;

  let libraryPrompt:
    | PromptLibraryRow
    | null = null;

  let libraryError = "";

  /*
   * Load selected Prompt Vault item.
   */
  if (libraryPromptId) {
    try {
      libraryPrompt =
        await getPromptLibraryItem(
          libraryPromptId
        );

      if (!libraryPrompt) {
        libraryError =
          "The selected Prompt Vault item could not be found.";
      }
    } catch (error) {
      console.error(
        "Failed to load Prompt Vault item in builder:",
        error
      );

      libraryError =
        error instanceof Error
          ? error.message
          : "Failed to load the selected Prompt Vault item.";
    }
  }

  /*
   * Increase usage count when a
   * Prompt Vault item is opened
   * in the Builder.
   *
   * We do not block the Builder
   * if this counter fails.
   */
  if (libraryPrompt) {
    try {
      await incrementPromptUse(
        libraryPrompt.id,
        libraryPrompt.use_count
      );
    } catch (error) {
      console.error(
        "Failed to increment Prompt Vault use count:",
        error
      );
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}

        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-400">
            Production Builder
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            🛠 Prompt Builder
          </h1>

          <p className="mt-3 max-w-3xl text-zinc-400">
            Build production-ready
            prompts using your reusable
            Cast and Style libraries.
          </p>
        </div>

        {/* Loaded Prompt Vault item */}

        {libraryPrompt && (
          <div className="rounded-xl border border-emerald-800 bg-emerald-950/20 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">
                  Prompt Vault Loaded
                </p>

                <h2 className="mt-2 text-lg font-bold text-white">
                  {libraryPrompt.title}
                </h2>

                {libraryPrompt.description && (
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
                    {
                      libraryPrompt.description
                    }
                  </p>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full border border-emerald-900 bg-emerald-950/40 px-3 py-1 text-xs text-emerald-400">
                    {
                      libraryPrompt.category
                    }
                  </span>

                  {libraryPrompt.tags.map(
                    (tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400"
                      >
                        #{tag}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-xs text-zinc-500">
                Used{" "}
                {libraryPrompt.use_count +
                  1}{" "}
                times
              </div>
            </div>
          </div>
        )}

        {/* Library loading error */}

        {libraryError && (
          <div className="rounded-xl border border-amber-800 bg-amber-950/20 p-5">
            <p className="font-semibold text-amber-400">
              Prompt Vault warning
            </p>

            <p className="mt-2 text-sm text-amber-200/70">
              {libraryError}
            </p>

            <p className="mt-2 text-xs text-zinc-500">
              The Prompt Builder is still
              available below.
            </p>
          </div>
        )}

        {/* Builder */}

        <PromptBuilder
          initialProjectId={
            projectId
          }
          initialSceneId={
            sceneId
          }
          initialPrompt={
            libraryPrompt?.prompt ??
            ""
          }
          initialPromptName={
            libraryPrompt?.title ??
            ""
          }
        />
      </div>
    </AppShell>
  );
}