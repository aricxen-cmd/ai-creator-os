import AppShell from "@/components/layout/AppShell";

import PromptBuilder from "@/features/prompts/components/PromptBuilder";

import {
  getPromptLibraryItem,
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
  } =
    await searchParams;

  const libraryPrompt =
    libraryPromptId
      ? await getPromptLibraryItem(
          libraryPromptId
        )
      : null;

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-400">
            Production Builder
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            🛠 Prompt Builder
          </h1>

          <p className="mt-3 max-w-3xl text-zinc-400">
            Build production-ready
            prompts using your
            reusable Cast and Style
            libraries.
          </p>
        </div>

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