"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Scene } from "../types";
import { saveScenes } from "@/lib/supabase/scenes";
import { videoEngineRegistry } from "@/features/video-engines";
import { generateScenes } from "../services/sceneGenerator";

interface Props {
  projectId: string;
  initialScenes: Scene[];
  storyboard: string;
}

function createScene(id: number): Scene {
  return {
    id,
    title: `Scene ${id}`,
    narration: "",
    visual: "",
    camera: "Medium shot",
    motion: "Subtle push-in",
    duration: "6s",
    transition: "Cut",
    status: "draft",
    castIds: [],
    generation: {
      engineId: videoEngineRegistry[0]?.id,
      mode: "text-to-video",
      aspectRatio: "9:16",
      durationSeconds: 6,
    },
  };
}

export default function ScenePlanner({ projectId, initialScenes, storyboard }: Props) {
  const router = useRouter();
  const [scenes, setScenes] = useState(initialScenes);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");

  function updateScene(index: number, updates: Partial<Scene>) {
    setScenes((items) => items.map((scene, sceneIndex) => sceneIndex === index ? { ...scene, ...updates } : scene));
  }

  function addScene() {
    const nextId = scenes.reduce((highest, scene) => Math.max(highest, scene.id), 0) + 1;
    setScenes((items) => [...items, createScene(nextId)]);
  }

  function removeScene(index: number) {
    setScenes((items) => items.filter((_, sceneIndex) => sceneIndex !== index));
  }

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      await saveScenes(projectId, scenes);
      setMessage(`Saved ${scenes.length} scenes.`);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save scenes.");
    } finally {
      setSaving(false);
    }
  }

  async function generateFromStoryboard() {
    setGenerating(true);
    setMessage("");
    try {
      const generatedScenes = await generateScenes(storyboard);
      setScenes(generatedScenes.map((scene) => ({
        ...scene,
        status: "draft",
        generation: {
          engineId: videoEngineRegistry[0]?.id,
          mode: "text-to-video",
          aspectRatio: "9:16",
          durationSeconds: Number.parseInt(scene.duration, 10) || 6,
        },
      })));
      setMessage(`Generated ${generatedScenes.length} scenes. Review them, then save the plan.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to generate a scene plan.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">Plan</p>
          <h2 className="mt-2 text-2xl font-bold">Scene Planner</h2>
          <p className="mt-2 text-sm text-zinc-400">Shape the production beats before generating prompts and video.</p>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={generateFromStoryboard} disabled={generating || !storyboard.trim()} className="rounded-lg border border-emerald-700 px-4 py-2.5 text-sm font-semibold text-emerald-400 disabled:opacity-50">{generating ? "Planning..." : "Plan from Storyboard"}</button>
          <button type="button" onClick={addScene} className="rounded-lg border border-zinc-700 px-4 py-2.5 text-sm">+ Add Scene</button>
          <button type="button" onClick={save} disabled={saving} className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold disabled:opacity-50">{saving ? "Saving..." : "Save Plan"}</button>
        </div>
      </div>

      {message && <p className="mt-4 text-sm text-zinc-300">{message}</p>}

      <div className="mt-6 space-y-4">
        {scenes.map((scene, index) => (
          <article key={scene.id} className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
            <div className="grid gap-3 lg:grid-cols-[90px_1fr_110px_200px_auto]">
              <div className="rounded-lg bg-zinc-900 px-3 py-2 text-center text-sm text-zinc-400">Scene {index + 1}</div>
              <input value={scene.title} onChange={(event) => updateScene(index, { title: event.target.value })} className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" aria-label={`Scene ${index + 1} title`} />
              <input value={scene.duration} onChange={(event) => updateScene(index, { duration: event.target.value })} className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" aria-label={`Scene ${index + 1} duration`} />
              <select value={scene.generation?.engineId ?? ""} onChange={(event) => updateScene(index, { generation: { ...scene.generation, engineId: event.target.value } })} className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2" aria-label={`Scene ${index + 1} video engine`}>
                {videoEngineRegistry.map((engine) => <option key={engine.id} value={engine.id}>{engine.provider} {engine.name}</option>)}
              </select>
              <button type="button" onClick={() => removeScene(index)} className="rounded-lg border border-red-900 px-3 py-2 text-sm text-red-400">Remove</button>
            </div>
            <div className="mt-3 grid gap-3 lg:grid-cols-2">
              <textarea value={scene.narration} onChange={(event) => updateScene(index, { narration: event.target.value })} rows={3} placeholder="Narration or dialogue" className="rounded-lg border border-zinc-700 bg-zinc-900 p-3" />
              <textarea value={scene.visual} onChange={(event) => updateScene(index, { visual: event.target.value })} rows={3} placeholder="Visual action and consequence" className="rounded-lg border border-zinc-700 bg-zinc-900 p-3" />
            </div>
          </article>
        ))}
        {!scenes.length && <div className="rounded-lg border border-dashed border-zinc-700 p-8 text-center text-zinc-500">No scenes yet. Add the first production beat.</div>}
      </div>
    </section>
  );
}
