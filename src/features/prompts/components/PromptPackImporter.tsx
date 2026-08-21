"use client";

import { useMemo, useState } from "react";

import { starterPromptPack } from "../packs/starterPack";
import { creatorMegaPack } from "../packs/creatorMegaPack";

import type {
  PromptPack,
  PromptPackItem,
} from "../packs/types";

import {
  createPromptLibraryItem,
} from "@/lib/supabase/promptLibrary";

interface Props {
  onImported?: () => void;
}

interface ImportResult {
  imported: number;
  skipped: number;
}

const builtInPacks: PromptPack[] = [
  starterPromptPack,
  creatorMegaPack,
];

export default function PromptPackImporter({
  onImported,
}: Props) {
  const [
    selectedPackId,
    setSelectedPackId,
  ] = useState(
    starterPromptPack.id
  );

  const [
    customPack,
    setCustomPack,
  ] =
    useState<PromptPack | null>(
      null
    );

  const selectedPack =
    useMemo(() => {
      if (
        customPack &&
        selectedPackId ===
          customPack.id
      ) {
        return customPack;
      }

      return (
        builtInPacks.find(
          (pack) =>
            pack.id ===
            selectedPackId
        ) ??
        starterPromptPack
      );
    }, [
      customPack,
      selectedPackId,
    ]);

  const [
    selectedIndexes,
    setSelectedIndexes,
  ] =
    useState<number[]>(
      starterPromptPack.prompts.map(
        (_, index) =>
          index
      )
    );

  const [
    importing,
    setImporting,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    status,
    setStatus,
  ] =
    useState("");

  function loadPack(
    pack: PromptPack
  ) {
    setSelectedPackId(
      pack.id
    );

    setSelectedIndexes(
      pack.prompts.map(
        (_, index) =>
          index
      )
    );

    setError("");

    setStatus(
      `${pack.name} loaded.`
    );
  }

  function handleBuiltInPackChange(
    id: string
  ) {
    const pack =
      builtInPacks.find(
        (item) =>
          item.id === id
      );

    if (!pack) {
      return;
    }

    setCustomPack(null);

    loadPack(pack);
  }

  function togglePrompt(
    index: number
  ) {
    setSelectedIndexes(
      (previous) =>
        previous.includes(
          index
        )
          ? previous.filter(
              (item) =>
                item !==
                index
            )
          : [
              ...previous,
              index,
            ]
    );
  }

  function selectAll() {
    setSelectedIndexes(
      selectedPack.prompts.map(
        (_, index) =>
          index
      )
    );
  }

  function clearAll() {
    setSelectedIndexes(
      []
    );
  }

  async function importPrompts(
    prompts: PromptPackItem[]
  ): Promise<ImportResult> {
    let imported = 0;
    let skipped = 0;

    for (const item of prompts) {
      const result =
        await createPromptLibraryItem(
          {
            title:
              item.title,

            category:
              item.category,

            description:
              item.description,

            prompt:
              item.prompt,

            tags:
              item.tags,
          }
        );

      if (result.created) {
        imported++;
      } else {
        skipped++;
      }
    }

    return {
      imported,
      skipped,
    };
  }

  async function handleImport() {
    if (
      selectedIndexes.length ===
      0
    ) {
      setError(
        "Select at least one prompt to import."
      );

      return;
    }

    setImporting(true);
    setError("");
    setStatus("");

    try {
      const selectedPrompts =
        selectedIndexes
          .map(
            (index) =>
              selectedPack.prompts[
                index
              ]
          )
          .filter(
            (
              item
            ): item is PromptPackItem =>
              Boolean(item)
          );

      const result =
        await importPrompts(
          selectedPrompts
        );

      setStatus(
        `Import complete. ${result.imported} new prompt${
          result.imported === 1
            ? ""
            : "s"
        } added. ${result.skipped} duplicate${
          result.skipped === 1
            ? ""
            : "s"
        } skipped.`
      );

      onImported?.();
    } catch (err) {
      setError(
        getErrorMessage(
          err
        )
      );
    } finally {
      setImporting(
        false
      );
    }
  }

  async function handleJsonFile(
    file:
      | File
      | undefined
  ) {
    if (!file) {
      return;
    }

    setError("");
    setStatus("");

    try {
      const text =
        await file.text();

      const parsed =
        JSON.parse(
          text
        ) as unknown;

      const validated =
        validatePromptPack(
          parsed
        );

      setCustomPack(
        validated
      );

      loadPack(
        validated
      );

      setStatus(
        `Loaded JSON pack "${validated.name}" with ${validated.prompts.length} prompts.`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Invalid prompt pack JSON."
      );
    }
  }

  function resetStarterPack() {
    setCustomPack(null);

    loadPack(
      starterPromptPack
    );
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            Bulk Import
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            📦 Prompt Pack
            Importer
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
            Install built-in
            AI Creator OS prompt
            packs or import
            your own JSON
            collections.
          </p>
        </div>

        <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400">
          v
          {
            selectedPack.version
          }
        </span>
      </div>

      {/* BUILT-IN PACKS */}

      <div className="mt-6">
        <label className="mb-2 block text-sm font-medium text-zinc-300">
          Built-In Prompt Pack
        </label>

        <select
          value={
            customPack
              ? ""
              : selectedPackId
          }
          onChange={(
            event
          ) =>
            handleBuiltInPackChange(
              event.target
                .value
            )
          }
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-200 outline-none transition focus:border-emerald-500"
        >
          {customPack && (
            <option value="">
              Custom JSON Pack
            </option>
          )}

          {builtInPacks.map(
            (pack) => (
              <option
                key={
                  pack.id
                }
                value={
                  pack.id
                }
              >
                {pack.name} (
                {
                  pack.prompts
                    .length
                }
                )
              </option>
            )
          )}
        </select>
      </div>

      {/* JSON IMPORT */}

      <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-5">
        <h3 className="font-semibold">
          Import JSON Prompt
          Pack
        </h3>

        <p className="mt-2 text-sm text-zinc-500">
          Choose a JSON file
          using the AI Creator
          OS prompt-pack format.
        </p>

        <input
          type="file"
          accept="application/json,.json"
          onChange={(
            event
          ) =>
            handleJsonFile(
              event.target
                .files?.[0]
            )
          }
          className="mt-4 block w-full text-sm text-zinc-400 file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-zinc-200 hover:file:bg-zinc-700"
        />

        <button
          type="button"
          onClick={
            resetStarterPack
          }
          className="mt-4 text-xs text-zinc-500 transition hover:text-white"
        >
          Reset to Starter
          Pack
        </button>
      </div>

      {/* PACK SUMMARY */}

      <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-950 p-5">
        <h3 className="text-lg font-semibold">
          {
            selectedPack.name
          }
        </h3>

        <p className="mt-2 text-sm leading-6 text-zinc-500">
          {
            selectedPack.description
          }
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-500">
            {
              selectedPack.prompts
                .length
            }{" "}
            prompts
          </span>

          <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-500">
            Version{" "}
            {
              selectedPack.version
            }
          </span>
        </div>
      </div>

      {/* CONTROLS */}

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={selectAll}
          className="text-xs text-emerald-400 transition hover:text-emerald-300"
        >
          Select All
        </button>

        <button
          type="button"
          onClick={clearAll}
          className="text-xs text-zinc-500 transition hover:text-white"
        >
          Clear
        </button>

        <span className="text-xs text-zinc-600">
          {
            selectedIndexes.length
          }{" "}
          selected
        </span>
      </div>

      {/* PROMPT PREVIEW */}

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {selectedPack.prompts.map(
          (
            item,
            index
          ) => {
            const selected =
              selectedIndexes.includes(
                index
              );

            return (
              <button
                key={`${item.title}-${index}`}
                type="button"
                onClick={() =>
                  togglePrompt(
                    index
                  )
                }
                className={`rounded-xl border p-4 text-left transition ${
                  selected
                    ? "border-emerald-500 bg-emerald-950/20"
                    : "border-zinc-700 bg-zinc-950 opacity-70"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wide text-zinc-600">
                      {
                        item.category
                      }
                    </span>

                    <h4 className="mt-1 font-semibold">
                      {
                        item.title
                      }
                    </h4>
                  </div>

                  <span
                    className={
                      selected
                        ? "text-emerald-400"
                        : "text-zinc-600"
                    }
                  >
                    {selected
                      ? "✓"
                      : "○"}
                  </span>
                </div>

                <p className="mt-3 text-xs leading-5 text-zinc-500">
                  {
                    item.description
                  }
                </p>
              </button>
            );
          }
        )}
      </div>

      {/* RESULT */}

      {status && (
        <div className="mt-5 rounded-lg border border-emerald-800 bg-emerald-950/30 p-4 text-sm text-emerald-400">
          {status}
        </div>
      )}

      {error && (
        <div className="mt-5 rounded-lg border border-red-700 bg-red-950/50 p-4">
          <p className="text-sm font-semibold text-red-300">
            Import failed
          </p>

          <p className="mt-2 whitespace-pre-wrap text-sm text-red-300">
            {error}
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={
          handleImport
        }
        disabled={
          importing ||
          selectedIndexes.length ===
            0
        }
        className="mt-6 rounded-lg bg-emerald-600 px-6 py-3 font-semibold transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {importing
          ? "📦 Importing..."
          : `📦 Import ${selectedIndexes.length} Prompts`}
      </button>
    </div>
  );
}

function validatePromptPack(
  value: unknown
): PromptPack {
  if (
    typeof value !==
      "object" ||
    value === null
  ) {
    throw new Error(
      "JSON file must contain a prompt pack object."
    );
  }

  const data =
    value as Record<
      string,
      unknown
    >;

  if (
    typeof data.id !==
      "string" ||
    typeof data.name !==
      "string" ||
    typeof data.description !==
      "string" ||
    typeof data.version !==
      "string" ||
    !Array.isArray(
      data.prompts
    )
  ) {
    throw new Error(
      "JSON file does not match the AI Creator OS prompt-pack format."
    );
  }

  const prompts =
    data.prompts.map(
      (
        rawPrompt,
        index
      ) => {
        if (
          typeof rawPrompt !==
            "object" ||
          rawPrompt === null
        ) {
          throw new Error(
            `Prompt ${index + 1} is invalid.`
          );
        }

        const item =
          rawPrompt as Record<
            string,
            unknown
          >;

        if (
          typeof item.title !==
            "string" ||
          typeof item.category !==
            "string" ||
          typeof item.description !==
            "string" ||
          typeof item.prompt !==
            "string" ||
          !Array.isArray(
            item.tags
          ) ||
          !item.tags.every(
            (tag) =>
              typeof tag ===
              "string"
          )
        ) {
          throw new Error(
            `Prompt ${index + 1} has invalid fields.`
          );
        }

        return {
          title:
            item.title,

          category:
            item.category,

          description:
            item.description,

          prompt:
            item.prompt,

          tags:
            item.tags as string[],
        };
      }
    );

  return {
    id:
      data.id,

    name:
      data.name,

    description:
      data.description,

    version:
      data.version,

    prompts,
  };
}

function getErrorMessage(
  error: unknown
): string {
  if (
    error instanceof Error
  ) {
    return error.message;
  }

  if (
    typeof error ===
      "object" &&
    error !== null
  ) {
    const value =
      error as Record<
        string,
        unknown
      >;

    if (
      typeof value.message ===
      "string"
    ) {
      return value.message;
    }
  }

  return "Unknown import error.";
}