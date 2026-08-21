"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  applyPromptVariables,
  extractPromptVariables,
} from "../utils/promptVariables";

interface Props {
  template: string;

  onApply: (
    completedPrompt: string
  ) => void;
}

const multilineVariables =
  new Set([
    "SCRIPT",
    "STORYBOARD",
    "SCENE",
    "CAST_LOCK",
    "STYLE_LOCK",
    "CHARACTER_DESCRIPTION",
    "PROMPT",
    "RESEARCH",
    "CONTEXT",
    "EXTRA_INSTRUCTIONS",
  ]);

export default function PromptVariablePanel({
  template,
  onApply,
}: Props) {
  const variables =
    useMemo(
      () =>
        extractPromptVariables(
          template
        ),
      [template]
    );

  const [
    values,
    setValues,
  ] =
    useState<
      Record<
        string,
        string
      >
    >({});

  const [
    status,
    setStatus,
  ] =
    useState("");

  useEffect(() => {
    setValues(
      (previous) => {
        const next:
          Record<
            string,
            string
          > = {};

        for (
          const variable of
          variables
        ) {
          next[
            variable.key
          ] =
            previous[
              variable.key
            ] ?? "";
        }

        return next;
      }
    );
  }, [variables]);

  if (
    variables.length === 0
  ) {
    return null;
  }

  function updateValue(
    key: string,
    value: string
  ) {
    setValues(
      (previous) => ({
        ...previous,

        [key]:
          value,
      })
    );

    setStatus("");
  }

  function handleApply() {
    const completed =
      applyPromptVariables(
        template,
        values
      );

    onApply(
      completed
    );

    const remaining =
      extractPromptVariables(
        completed
      );

    if (
      remaining.length >
      0
    ) {
      setStatus(
        `${remaining.length} variable${
          remaining.length ===
          1
            ? ""
            : "s"
        } still need values.`
      );
    } else {
      setStatus(
        "All variables applied."
      );
    }
  }

  function handleClear() {
    const empty:
      Record<
        string,
        string
      > = {};

    for (
      const variable of
      variables
    ) {
      empty[
        variable.key
      ] = "";
    }

    setValues(empty);
    setStatus("");
  }

  const completedCount =
    variables.filter(
      (variable) =>
        Boolean(
          values[
            variable.key
          ]?.trim()
        )
    ).length;

  return (
    <div className="rounded-xl border border-emerald-900/60 bg-emerald-950/10 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            Smart Template
          </p>

          <h2 className="mt-2 text-xl font-bold">
            🧩 Prompt Variables
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Fill in the detected
            placeholders and AI
            Creator OS will build
            the completed prompt
            automatically.
          </p>
        </div>

        <span className="rounded-full border border-emerald-900 bg-emerald-950/40 px-3 py-1 text-xs text-emerald-400">
          {completedCount}/
          {variables.length} filled
        </span>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {variables.map(
          (variable) => {
            const multiline =
              multilineVariables.has(
                variable.key
              );

            return (
              <div
                key={
                  variable.key
                }
                className={
                  multiline
                    ? "md:col-span-2"
                    : ""
                }
              >
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  {
                    variable.label
                  }
                </label>

                <p className="mb-2 text-[11px] text-zinc-600">
                  [
                  {
                    variable.key
                  }
                  ]
                </p>

                {multiline ? (
                  <textarea
                    value={
                      values[
                        variable.key
                      ] ?? ""
                    }
                    onChange={(
                      event
                    ) =>
                      updateValue(
                        variable.key,
                        event.target
                          .value
                      )
                    }
                    rows={5}
                    placeholder={`Enter ${variable.label.toLowerCase()}...`}
                    className="variable-input resize-y leading-6"
                  />
                ) : (
                  <input
                    value={
                      values[
                        variable.key
                      ] ?? ""
                    }
                    onChange={(
                      event
                    ) =>
                      updateValue(
                        variable.key,
                        event.target
                          .value
                      )
                    }
                    placeholder={`Enter ${variable.label.toLowerCase()}...`}
                    className="variable-input"
                  />
                )}
              </div>
            );
          }
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={
            handleApply
          }
          className="rounded-lg bg-emerald-600 px-5 py-3 font-semibold transition hover:bg-emerald-500"
        >
          🧩 Apply Variables
        </button>

        <button
          type="button"
          onClick={
            handleClear
          }
          className="rounded-lg border border-zinc-700 px-5 py-3 text-zinc-300 transition hover:border-zinc-500"
        >
          Clear Fields
        </button>
      </div>

      {status && (
        <p className="mt-4 text-sm text-emerald-400">
          {status}
        </p>
      )}

      <style jsx>{`
        .variable-input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid
            rgb(63 63 70);
          background:
            rgb(9 9 11);
          padding:
            0.75rem 1rem;
          color: white;
          outline: none;
        }

        .variable-input:focus {
          border-color:
            rgb(16 185 129);
        }

        .variable-input::placeholder {
          color:
            rgb(82 82 91);
        }
      `}</style>
    </div>
  );
}