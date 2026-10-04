"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import type {
  Scene,
} from "@/features/scenes/types";

import type {
  TrendProjectSettings,
} from "../utils/projectTrendContract";

import {
  validateProductionReadiness,
} from "../engine/validateProductionReadiness";

import {
  updateProject,
} from "@/lib/supabase/updateProject";

interface Props {
  projectId: string;

  scenes: Scene[];

  settings:
    TrendProjectSettings | null;
}

export default function ProductionStatusActions({
  projectId,
  scenes,
  settings,
}: Props) {
  const router =
    useRouter();

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    status,
    setStatus,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const readiness =
    validateProductionReadiness(
      scenes,
      settings
    );

  async function markReady() {
    if (!readiness.ready) {
      setError(
        "This project cannot be marked Production Ready until all blocking scene issues are fixed."
      );

      return;
    }

    setSaving(true);

    setError("");

    setStatus("");

    try {
      await updateProject(
        projectId,
        {
          status:
            "Production Ready",
        }
      );

      setStatus(
        "Project marked Production Ready."
      );

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update project status."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            Project Status
          </p>

          <h2 className="mt-2 text-xl font-bold">
            ✅ Production Ready
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            Once every blocking contract and prompt issue passes validation, mark the project ready for final production.
          </p>

          <p className="mt-3 text-sm">
            Current validation:{" "}
            <span
              className={
                readiness.ready
                  ? "font-semibold text-emerald-400"
                  : "font-semibold text-amber-400"
              }
            >
              {readiness.ready
                ? "Ready"
                : "Needs Work"}
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={
            markReady
          }
          disabled={
            saving ||
            !readiness.ready
          }
          className="shrink-0 rounded-lg bg-emerald-600 px-5 py-3 font-semibold transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : "✅ Mark Production Ready"}
        </button>
      </div>

      {status && (
        <div className="mt-5 rounded-lg border border-emerald-900/60 bg-emerald-950/20 p-4 text-sm text-emerald-400">
          {status}
        </div>
      )}

      {error && (
        <div className="mt-5 rounded-lg border border-red-900/60 bg-red-950/20 p-4 text-sm text-red-300">
          {error}
        </div>
      )}
    </div>
  );
}