"use client";

import {
  Check,
  ChevronRight,
  Clipboard,
  FileText,
  Menu,
  Search,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  PROMPT_NICHES,
  PROMPT_STAGES,
  PromptNiche,
  PromptStage,
  VaultPrompt,
  vaultPrompts,
} from "@/features/prompts/vault";

const nicheColors: Record<PromptNiche, string> = {
  "2D Football":
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  "Animal POV":
    "border-amber-500/30 bg-amber-500/10 text-amber-300",
  "Beginner English":
    "border-blue-500/30 bg-blue-500/10 text-blue-300",
  "AI Toys":
    "border-violet-500/30 bg-violet-500/10 text-violet-300",
  "Self-Improvement":
    "border-rose-500/30 bg-rose-500/10 text-rose-300",
};

export default function PromptVault() {
  const [search, setSearch] = useState("");
  const [niche, setNiche] = useState<"All" | PromptNiche>("All");
  const [stage, setStage] = useState<"All" | PromptStage>("All");
  const [selectedId, setSelectedId] = useState(
    vaultPrompts[0]?.id ?? "",
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filteredPrompts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return vaultPrompts.filter((prompt) => {
      const matchesNiche = niche === "All" || prompt.niche === niche;
      const matchesStage = stage === "All" || prompt.stage === stage;

      const searchableText = [
        prompt.title,
        prompt.description,
        prompt.niche,
        prompt.stage,
        ...prompt.tags,
      ]
        .join(" ")
        .toLowerCase();

      return (
        matchesNiche &&
        matchesStage &&
        (!query || searchableText.includes(query))
      );
    });
  }, [search, niche, stage]);

  const selectedPrompt =
    filteredPrompts.find((prompt) => prompt.id === selectedId) ??
    filteredPrompts[0] ??
    null;

  function stageCount(selectedStage: "All" | PromptStage) {
    return vaultPrompts.filter((prompt) => {
      const matchesStage =
        selectedStage === "All" || prompt.stage === selectedStage;

      const matchesNiche =
        niche === "All" || prompt.niche === niche;

      return matchesStage && matchesNiche;
    }).length;
  }

  async function copyPrompt(prompt: VaultPrompt) {
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      setCopiedId(prompt.id);

      window.setTimeout(() => {
        setCopiedId((current) =>
          current === prompt.id ? null : current,
        );
      }, 1800);
    } catch {
      window.prompt("Copy this prompt:", prompt.prompt);
    }
  }

  function selectStage(nextStage: "All" | PromptStage) {
    setStage(nextStage);
    setSelectedId("");
    setDrawerOpen(false);
  }

  function selectNiche(nextNiche: "All" | PromptNiche) {
    setNiche(nextNiche);
    setSelectedId("");
  }

  const navigationContent = (
    <div className="flex h-full flex-col">
      <div className="border-b border-zinc-800 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Workspace
        </p>

        <h2 className="mt-2 text-lg font-semibold text-white">
          Production Stages
        </h2>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {PROMPT_STAGES.map((option) => {
          const active = stage === option;
          const count = stageCount(option);

          return (
            <button
              key={option}
              type="button"
              onClick={() => selectStage(option)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm transition ${
                active
                  ? "bg-emerald-500 text-zinc-950"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <FileText size={16} />
                {option === "All" ? "All prompts" : option}
              </span>

              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  active
                    ? "bg-black/15 text-zinc-950"
                    : "bg-zinc-800 text-zinc-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="border-t border-zinc-800 p-4">
        <label className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          Niche filter
        </label>

        <select
          value={niche}
          onChange={(event) =>
            selectNiche(event.target.value as "All" | PromptNiche)
          }
          className="mt-2 h-11 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-200 outline-none focus:border-emerald-500"
        >
          {PROMPT_NICHES.map((option) => (
            <option key={option} value={option}>
              {option === "All" ? "All niches" : option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <div className="text-zinc-100">
      <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-emerald-400">
            AI Creator OS
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Prompt Vault Workspace
          </h1>

          <p className="mt-2 text-zinc-400">
            Choose a stage, select a prompt, and work with it in one
            focused space.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="flex h-11 items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm font-medium transition hover:border-zinc-500 xl:hidden"
        >
          <Menu size={18} />
          Production stages
        </button>
      </header>

      <div className="min-h-180 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 xl:grid xl:grid-cols-[220px_340px_minmax(0,1fr)]">
        {/* Desktop mini sidebar */}
        <aside className="hidden border-r border-zinc-800 bg-zinc-950/80 xl:block">
          {navigationContent}
        </aside>

        {/* Middle prompt list */}
        <section className="border-b border-zinc-800 bg-zinc-900/50 xl:border-b-0 xl:border-r">
          <div className="border-b border-zinc-800 p-4">
            <label className="relative block">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                size={17}
              />

              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setSelectedId("");
                }}
                placeholder="Search this vault..."
                className="h-11 w-full rounded-xl border border-zinc-700 bg-zinc-950 pl-10 pr-4 text-sm outline-none placeholder:text-zinc-600 focus:border-emerald-500"
              />
            </label>

            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-300">
                {stage === "All" ? "All prompts" : stage}
              </p>

              <span className="text-xs text-zinc-500">
                {filteredPrompts.length} results
              </span>
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 xl:hidden">
              {PROMPT_NICHES.map((option) => {
                const active = niche === option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => selectNiche(option)}
                    className={`shrink-0 rounded-full border px-3 py-1.5 text-xs transition ${
                      active
                        ? "border-emerald-500 bg-emerald-500 text-zinc-950"
                        : "border-zinc-700 text-zinc-400"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="max-h-105 space-y-2 overflow-y-auto p-3 xl:max-h-180">
            {filteredPrompts.map((prompt) => {
              const active = selectedPrompt?.id === prompt.id;

              return (
                <button
                  key={prompt.id}
                  type="button"
                  onClick={() => setSelectedId(prompt.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    active
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-transparent bg-zinc-950/50 hover:border-zinc-700 hover:bg-zinc-900"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${nicheColors[prompt.niche]}`}
                    >
                      {prompt.niche}
                    </span>

                    <ChevronRight
                      size={17}
                      className={
                        active
                          ? "text-emerald-400"
                          : "text-zinc-600"
                      }
                    />
                  </div>

                  <h3 className="mt-3 font-semibold text-white">
                    {prompt.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-500">
                    {prompt.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {prompt.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] text-zinc-600"
                      >
                        #{tag.replaceAll(" ", "-")}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}

            {filteredPrompts.length === 0 && (
              <div className="p-8 text-center">
                <p className="font-medium text-zinc-300">
                  No prompts found
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStage("All");
                    setNiche("All");
                  }}
                  className="mt-3 text-sm text-emerald-400 hover:text-emerald-300"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Right working editor */}
        <section className="min-w-0 bg-zinc-950/30">
          {selectedPrompt ? (
            <div className="flex h-full min-h-162.5 flex-col">
              <div className="border-b border-zinc-800 p-5 md:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${nicheColors[selectedPrompt.niche]}`}
                      >
                        {selectedPrompt.niche}
                      </span>

                      <span className="rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
                        {selectedPrompt.stage}
                      </span>
                    </div>

                    <h2 className="mt-4 text-2xl font-bold text-white">
                      {selectedPrompt.title}
                    </h2>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                      {selectedPrompt.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyPrompt(selectedPrompt)}
                    className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
                  >
                    {copiedId === selectedPrompt.id ? (
                      <>
                        <Check size={17} />
                        Copied
                      </>
                    ) : (
                      <>
                        <Clipboard size={17} />
                        Copy prompt
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Working prompt
                  </p>

                  <p className="text-xs text-zinc-600">
                    Replace text inside [BRACKETS]
                  </p>
                </div>

                <pre className="min-h-130 whitespace-pre-wrap rounded-2xl border border-zinc-800 bg-black/70 p-5 font-mono text-sm leading-6 text-zinc-300">
                  {selectedPrompt.prompt}
                </pre>
              </div>
            </div>
          ) : (
            <div className="flex min-h-162.5 items-center justify-center p-8 text-center">
              <div>
                <FileText
                  size={38}
                  className="mx-auto text-zinc-700"
                />

                <h2 className="mt-4 text-xl font-semibold">
                  Select a prompt
                </h2>

                <p className="mt-2 text-sm text-zinc-500">
                  Choose a prompt from the middle column to open it
                  here.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Small-screen navigation drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-60 xl:hidden">
          <button
            type="button"
            aria-label="Close navigation drawer"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />

          <aside className="absolute inset-y-0 left-0 w-75 max-w-[85vw] border-r border-zinc-800 bg-zinc-950 shadow-2xl">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close drawer"
              className="absolute right-3 top-3 z-10 rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
            >
              <X size={20} />
            </button>

            {navigationContent}
          </aside>
        </div>
      )}
    </div>
  );
}