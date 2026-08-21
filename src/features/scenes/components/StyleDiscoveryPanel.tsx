"use client";

import {
  useEffect,
  useState,
} from "react";

import type {
  Scene,
} from "../types";

import {
  detectProductionStyles,
  type SuggestedProductionStyle,
} from "../services/detectProductionStyles";

import {
  createPromptTemplate,
  getPromptTemplates,
  type PromptTemplateRow,
} from "@/lib/supabase/promptTemplates";

interface Props {
  scenes: Scene[];
  script?: string;
  storyboard?: string;
}

export default function StyleDiscoveryPanel({
  scenes,
  script = "",
  storyboard = "",
}: Props) {
  const [
    existingTemplates,
    setExistingTemplates,
  ] =
    useState<
      PromptTemplateRow[]
    >([]);

  const [
    suggestions,
    setSuggestions,
  ] =
    useState<
      SuggestedProductionStyle[]
    >([]);

  const [
    loadingLibrary,
    setLoadingLibrary,
  ] =
    useState(true);

  const [
    detecting,
    setDetecting,
  ] =
    useState(false);

  const [
    saving,
    setSaving,
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

  useEffect(() => {
    loadTemplates();
  }, []);

  async function loadTemplates() {
    setLoadingLibrary(
      true
    );

    try {
      const data =
        await getPromptTemplates();

      setExistingTemplates(
        data
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load Style Template Library."
      );
    } finally {
      setLoadingLibrary(
        false
      );
    }
  }

  async function handleDetect() {
    setDetecting(true);

    setError("");

    setStatus("");

    setSuggestions([]);

    try {
      const detected =
        await detectProductionStyles(
          {
            scenes,
            script,
            storyboard,
          }
        );

      if (
        detected.length ===
        0
      ) {
        setStatus(
          "No production styles were returned."
        );

        return;
      }

      setSuggestions(
        detected
      );

      setStatus(
        `Generated ${detected.length} production style recommendations.`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Production style detection failed."
      );
    } finally {
      setDetecting(
        false
      );
    }
  }

  function selectStyle(
    index: number
  ) {
    setSuggestions(
      (previous) =>
        previous.map(
          (
            style,
            styleIndex
          ) => ({
            ...style,
            selected:
              styleIndex ===
              index,
          })
        )
    );
  }

  function updateStyle(
    index: number,
    field:
      | "name"
      | "description"
      | "styleLock",
    value: string
  ) {
    setSuggestions(
      (previous) =>
        previous.map(
          (
            style,
            styleIndex
          ) =>
            styleIndex ===
            index
              ? {
                  ...style,

                  [field]:
                    value,
                }
              : style
        )
    );
  }

  async function handleSaveSelected() {
    const selected =
      suggestions.find(
        (style) =>
          style.selected
      );

    if (!selected) {
      setError(
        "Select a production style first."
      );

      return;
    }

    if (
      !selected.name.trim() ||
      !selected.styleLock.trim()
    ) {
      setError(
        "The selected style needs a name and Style Lock."
      );

      return;
    }

    setSaving(true);

    setError("");

    setStatus("");

    try {
      await createPromptTemplate(
        selected.name.trim(),
        selected.description.trim(),
        selected.styleLock.trim()
      );

      await loadTemplates();

      setStatus(
        `"${selected.name}" saved to your Style Template Library.`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save production style."
      );
    } finally {
      setSaving(false);
    }
  }

  const selectedStyle =
    suggestions.find(
      (style) =>
        style.selected
    );

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            Visual Direction
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            🎨 Automatic
            Style Discovery
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
            Analyze the
            production and
            generate visual
            style recommendations
            designed for
            consistent AI image
            and video generation.
          </p>
        </div>

        <button
          type="button"
          onClick={
            handleDetect
          }
          disabled={
            detecting ||
            loadingLibrary
          }
          className="rounded-lg bg-emerald-600 px-5 py-3 font-semibold transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {detecting
            ? "🎨 Discovering Styles..."
            : "🎨 Discover Styles"}
        </button>
      </div>

      {/* SAVED LIBRARY */}

      <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-950 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">
              Existing Style
              Library
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              Saved templates
              remain available
              in Prompt Studio
              and Scene Studio.
            </p>
          </div>

          <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400">
            {
              existingTemplates.length
            }
          </span>
        </div>

        {existingTemplates.length >
          0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {existingTemplates.map(
              (template) => (
                <span
                  key={
                    template.id
                  }
                  className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-300"
                >
                  {
                    template.name
                  }
                </span>
              )
            )}
          </div>
        )}
      </div>

      {status && (
        <div className="mt-5 rounded-lg border border-emerald-800 bg-emerald-950/30 p-4 text-sm text-emerald-400">
          {status}
        </div>
      )}

      {error && (
        <div className="mt-5 rounded-lg border border-red-700 bg-red-950/50 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* STYLE OPTIONS */}

      {suggestions.length >
        0 && (
        <div className="mt-8">
          <div>
            <h3 className="text-xl font-bold">
              Style
              Recommendations
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
              Choose one,
              review the Style
              Lock, then save it
              to your production
              library.
            </p>
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-3">
            {suggestions.map(
              (
                style,
                index
              ) => (
                <button
                  key={`${style.name}-${index}`}
                  type="button"
                  onClick={() =>
                    selectStyle(
                      index
                    )
                  }
                  className={`rounded-xl border p-5 text-left transition ${
                    style.selected
                      ? "border-emerald-500 bg-emerald-950/20"
                      : "border-zinc-700 bg-zinc-950 hover:border-zinc-500"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="font-semibold">
                      {
                        style.name
                      }
                    </h4>

                    <span
                      className={
                        style.selected
                          ? "text-emerald-400"
                          : "text-zinc-600"
                      }
                    >
                      {style.selected
                        ? "✓"
                        : "○"}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-zinc-500">
                    {
                      style.description
                    }
                  </p>
                </button>
              )
            )}
          </div>

          {/* EDIT SELECTED */}

          {selectedStyle && (
            <div className="mt-8 rounded-xl border border-emerald-900/60 bg-emerald-950/10 p-5">
              <h3 className="text-lg font-semibold">
                Edit Selected
                Style
              </h3>

              <div className="mt-5">
                <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Template Name
                </label>

                <input
                  value={
                    selectedStyle.name
                  }
                  onChange={(
                    event
                  ) => {
                    const index =
                      suggestions.findIndex(
                        (
                          style
                        ) =>
                          style.selected
                      );

                    if (
                      index !== -1
                    ) {
                      updateStyle(
                        index,
                        "name",
                        event.target
                          .value
                      );
                    }
                  }}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-emerald-500"
                />
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Description
                </label>

                <textarea
                  value={
                    selectedStyle.description
                  }
                  onChange={(
                    event
                  ) => {
                    const index =
                      suggestions.findIndex(
                        (
                          style
                        ) =>
                          style.selected
                      );

                    if (
                      index !== -1
                    ) {
                      updateStyle(
                        index,
                        "description",
                        event.target
                          .value
                      );
                    }
                  }}
                  rows={3}
                  className="w-full resize-y rounded-lg border border-zinc-700 bg-zinc-950 p-4 outline-none transition focus:border-emerald-500"
                />
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Style Lock
                </label>

                <textarea
                  value={
                    selectedStyle.styleLock
                  }
                  onChange={(
                    event
                  ) => {
                    const index =
                      suggestions.findIndex(
                        (
                          style
                        ) =>
                          style.selected
                      );

                    if (
                      index !== -1
                    ) {
                      updateStyle(
                        index,
                        "styleLock",
                        event.target
                          .value
                      );
                    }
                  }}
                  rows={12}
                  className="w-full resize-y rounded-lg border border-zinc-700 bg-zinc-950 p-4 leading-6 text-zinc-300 outline-none transition focus:border-emerald-500"
                />
              </div>

              <button
                type="button"
                onClick={
                  handleSaveSelected
                }
                disabled={
                  saving
                }
                className="mt-5 rounded-lg bg-emerald-600 px-6 py-3 font-semibold transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "💾 Saving Style..."
                  : "💾 Save Style Template"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}