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
  updateProject,
} from "@/lib/supabase/updateProject";

import {
  repairContractScenes,
} from "../services/repairContractScenes";

interface Props {
  projectId: string;

  scenes: Scene[];

  settings:
    TrendProjectSettings | null;

  script?: string;

  storyboard?: string;
}

export default function SceneContractActions({
  projectId,
  scenes,
  settings,
  script = "",
  storyboard = "",
}: Props) {
  const router =
    useRouter();

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    status,
    setStatus,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  if (!settings) {
    return null;
  }

  async function handleRepair() {
    setLoading(true);

    setError("");

    setStatus(
      "Checking scene contract..."
    );

    try {
      const result =
        await repairContractScenes({
          scenes,

          settings,

          script,

          storyboard,

          provider:
            "Ollama",

          model:
            "qwen3:4b",
        });

      setStatus(
        "Saving repaired scenes..."
      );

      await updateProject(
        projectId,
        {
          scenes:
            result.scenes,
        }
      );

      if (result.pass) {
        setStatus(
          `Scene contract fixed. ${result.afterCount} scenes are ready.`
        );
      } else {
        setStatus(
          "Scenes were regenerated, but the contract still has warnings or errors."
        );
      }

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to repair scenes."
      );

      setStatus("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            Phase 5 Automation
          </p>

          <h2 className="mt-2 text-xl font-bold">
            🛠 Scene Contract Repair
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            Normalize the scene
            count, regenerate
            missing production
            details, and create
            image, video, narration,
            and audio prompts using
            the active Trend
            contract.
          </p>
        </div>

        <button
          type="button"
          onClick={
            handleRepair
          }
          disabled={
            loading
          }
          className="shrink-0 rounded-lg bg-emerald-600 px-5 py-3 font-semibold transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Repairing..."
            : "🛠 Fix & Generate Scenes"}
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