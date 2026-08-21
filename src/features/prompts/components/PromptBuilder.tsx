"use client";
import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import PromptVariablePanel from "./PromptVariablePanel";

import { buildProductionPrompt } from "../buildPrompt";

import type { PromptBuilderInput, PromptType } from "../types";

import {
  getCastProfiles,
  type CastProfileRow,
} from "@/lib/supabase/castProfiles";

import {
  getPromptTemplates,
  type PromptTemplateRow,
} from "@/lib/supabase/promptTemplates";

import {
  createSavedPrompt,
  deleteSavedPrompt,
  getSavedPrompts,
  type SavedPromptRow,
} from "@/lib/supabase/savedPrompts";

import { getProjects } from "@/lib/supabase/projects";

import type { Project } from "@/types/project";

interface PromptBuilderProps {
  initialProjectId?: string;

  initialSceneId?: string;

  initialPrompt?: string;

  initialPromptName?: string;
}

const promptTypes: {
  value: PromptType;
  label: string;
}[] = [
  {
    value: "image",
    label: "🖼️ Image Prompt",
  },
  {
    value: "video",
    label: "🎥 Video Prompt",
  },
  {
    value: "scene",
    label: "🎬 Scene Prompt",
  },
  {
    value: "thumbnail",
    label: "📸 Thumbnail Prompt",
  },
  {
    value: "character",
    label: "🎭 Character Prompt",
  },
];

const styles = [
  "",
  "Cinematic",
  "Photorealistic",
  "2D Animation",
  "3D Animation",
  "Claymation",
  "Anime",
  "Documentary",
  "Commercial",
  "Hyperrealistic",
];

const cameraOptions = [
  "",
  "Wide Shot",
  "Medium Shot",
  "Close-Up",
  "Extreme Close-Up",
  "Low Angle",
  "High Angle",
  "Over-the-Shoulder",
  "POV",
  "Tracking Shot",
  "Dolly Shot",
];

const lightingOptions = [
  "",
  "Natural Daylight",
  "Golden Hour",
  "Soft Studio Lighting",
  "Dramatic Cinematic Lighting",
  "Neon Lighting",
  "High Contrast",
  "Low Key",
  "Bright Commercial Lighting",
];

const moodOptions = [
  "",
  "Epic",
  "Funny",
  "Suspenseful",
  "Emotional",
  "Energetic",
  "Mysterious",
  "Inspirational",
  "Dark",
  "Playful",
];

const durations = [
  "",
  "3 seconds",
  "5 seconds",
  "6 seconds",
  "8 seconds",
  "10 seconds",
];

const defaultForm: PromptBuilderInput = {
  type: "image",
  templateId: "",
  subject: "",
  action: "",
  environment: "",
  style: "Cinematic",
  camera: "",
  lighting: "",
  mood: "",
  duration: "",
  selectedCastIds: [],
  castLock: "",
  styleLock: "",
  extraInstructions: "",
};

export default function PromptBuilder({
  initialProjectId = "",
  initialSceneId = "",
  initialPrompt = "",
  initialPromptName = "",
}: PromptBuilderProps) {
  const [form, setForm] = useState<PromptBuilderInput>(defaultForm);

  const [prompt, setPrompt] = useState(initialPrompt);
  const [variableTemplate, setVariableTemplate] = useState(initialPrompt);
  const [promptName, setPromptName] = useState(initialPromptName);

  const [castProfiles, setCastProfiles] = useState<CastProfileRow[]>([]);

  const [templates, setTemplates] = useState<PromptTemplateRow[]>([]);

  const [savedPrompts, setSavedPrompts] = useState<SavedPromptRow[]>([]);

  const [projects, setProjects] = useState<Project[]>([]);

  const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId);

  const [selectedSceneId, setSelectedSceneId] = useState(initialSceneId);

  const [loading, setLoading] = useState(false);

  const [libraryLoading, setLibraryLoading] = useState(true);

  const [error, setError] = useState("");

  const [status, setStatus] = useState("");

  useEffect(() => {
    loadLibraries();
  }, []);

  async function loadLibraries() {
    setLibraryLoading(true);

    setError("");

    try {
      const [castData, templateData, savedPromptData, projectData] =
        await Promise.all([
          getCastProfiles(),
          getPromptTemplates(),
          getSavedPrompts(),
          getProjects(),
        ]);

      setCastProfiles(castData);

      setTemplates(templateData);

      setSavedPrompts(savedPromptData);

      setProjects(projectData);
    } catch (err) {
      setError(
        getErrorMessage(err, "Failed to load Prompt Builder libraries."),
      );
    } finally {
      setLibraryLoading(false);
    }
  }

  const activeTemplate = useMemo(
    () => templates.find((template) => template.id === form.templateId),
    [templates, form.templateId],
  );

  function updateField(field: keyof PromptBuilderInput, value: string) {
    setForm((previous) => ({
      ...previous,

      [field]: value,
    }));
  }

  function handleTemplateChange(id: string) {
    const template = templates.find((item) => item.id === id);

    setForm((previous) => ({
      ...previous,

      templateId: id,

      styleLock: template?.style_lock ?? "",
    }));

    if (template) {
      setStatus(`${template.name} Style Lock loaded.`);
    } else {
      setStatus("");
    }
  }

  function rebuildCastLock(selectedIds: string[]) {
    return castProfiles
      .filter((profile) => selectedIds.includes(profile.id))
      .map(
        (profile) => `${profile.name.toUpperCase()}:\n${profile.description}`,
      )
      .join("\n\n");
  }

  function toggleCast(castId: string) {
    setForm((previous) => {
      const selected = previous.selectedCastIds ?? [];

      const nextSelected = selected.includes(castId)
        ? selected.filter((id) => id !== castId)
        : [...selected, castId];

      return {
        ...previous,

        selectedCastIds: nextSelected,

        castLock: rebuildCastLock(nextSelected),
      };
    });
  }

  function handleBuildPrompt() {
    setError("");

    if (!form.subject.trim()) {
      setError("Please enter a subject.");

      return;
    }

    const result = buildProductionPrompt(form);

    setPrompt(result);

    setStatus("Production prompt built.");
  }

  async function polishWithAI() {
    if (!form.subject.trim()) {
      setError("Please enter a subject first.");

      return;
    }

    const basePrompt = prompt.trim() || buildProductionPrompt(form);

    setLoading(true);
    setError("");
    setStatus("");

    try {
      const instruction = `
You are a professional AI prompt engineer specializing in AI-generated video and imagery.

Improve the following production prompt.

PROMPT TYPE:
${form.type}

BASE PROMPT:
${basePrompt}

CRITICAL CONSISTENCY RULES:

CAST LOCK:
If a CAST LOCK exists, preserve every identifying character detail exactly.

Preserve:
- face
- body proportions
- hairstyle
- hair color
- skin tone
- clothing
- footwear
- accessories
- colors
- age appearance
- distinguishing features

Never redesign a locked character.

STYLE LOCK:
If a STYLE LOCK exists, preserve it exactly.

Preserve:
- rendering style
- realism level
- materials
- textures
- lighting language
- animation style
- color treatment
- visual production style

Never introduce a conflicting style.

GENERAL RULES:

- Preserve the requested action.
- Preserve the environment.
- Improve visual specificity.
- Improve spatial relationships.
- Improve composition.
- Improve lighting.
- Remove ambiguity.
- Remove contradictory instructions.
- Avoid unnecessary filler.
- Do not randomly add characters or objects.

IMAGE PROMPT:
Describe one exact frame.
Do not describe temporal camera movement.

VIDEO PROMPT:
Clearly describe subject motion.
Clearly describe environmental motion.
Clearly describe camera movement.
Respect the requested duration.

SCENE PROMPT:
Maintain character and visual continuity.
Make the scene production-ready.

CHARACTER PROMPT:
Prioritize repeatable character design details.

THUMBNAIL PROMPT:
Prioritize immediate readability.
Use strong expression or action.
Use clear focal hierarchy.
Avoid clutter.

Return ONLY the final polished prompt.

Do not include commentary.
Do not include markdown headings.
`.trim();

      const response = await fetch("/api/ai/chat", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          type: "scene-prompts",

          provider: "Ollama",

          model: "qwen3:4b",

          prompt: instruction,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "AI request failed.");
      }

      if (!data.success) {
        throw new Error(data.error || "Prompt generation failed.");
      }

      if (typeof data.response !== "string" || !data.response.trim()) {
        throw new Error("AI returned an empty prompt.");
      }

      setPrompt(data.response.trim());

      setStatus("Prompt polished with Ollama.");
    } catch (err) {
      setError(getErrorMessage(err, "Something went wrong."));
    } finally {
      setLoading(false);
    }
  }

  async function handleSavePrompt() {
    if (!prompt.trim()) {
      setError("Build or generate a prompt first.");

      return;
    }

    if (!promptName.trim()) {
      setError("Enter a name for the prompt.");

      return;
    }

    setError("");
    setStatus("");

    try {
      await createSavedPrompt({
        name: promptName.trim(),

        promptType: form.type,

        prompt,

        templateId: form.templateId || null,

        castIds: form.selectedCastIds ?? [],

        projectId: selectedProjectId || null,

        sceneId: selectedSceneId ? Number(selectedSceneId) : null,

        metadata: {
          subject: form.subject,

          action: form.action,

          environment: form.environment,

          style: form.style,

          camera: form.camera,

          lighting: form.lighting,

          mood: form.mood,

          duration: form.duration,

          extraInstructions: form.extraInstructions,
        },
      });

      setPromptName("");

      setStatus("Prompt saved.");

      await loadLibraries();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to save prompt."));
    }
  }

  function handleLoadSavedPrompt(saved: SavedPromptRow) {
    setPrompt(saved.prompt);

    setVariableTemplate(saved.prompt);

    setPromptName(saved.name);

    setStatus(`Loaded "${saved.name}".`);
  }

  async function handleDeleteSavedPrompt(id: string) {
    setError("");
    setStatus("");

    try {
      await deleteSavedPrompt(id);

      setSavedPrompts((previous) =>
        previous.filter((saved) => saved.id !== id),
      );

      setStatus("Saved prompt deleted.");
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete prompt."));
    }
  }

  async function handleCopy() {
    if (!prompt.trim()) {
      return;
    }

    try {
      await navigator.clipboard.writeText(prompt);

      setStatus("Prompt copied.");
    } catch {
      setError("Unable to copy prompt.");
    }
  }

  function handleDownload() {
    if (!prompt.trim()) {
      return;
    }

    const blob = new Blob([prompt], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");

    anchor.href = url;

    anchor.download = `${form.type}-prompt.txt`;

    document.body.appendChild(anchor);

    anchor.click();

    anchor.remove();

    URL.revokeObjectURL(url);

    setStatus("Prompt downloaded.");
  }

  function handleClearPrompt() {
    setPrompt("");
    setPromptName("");
    setVariableTemplate("");
    setError("");
    setStatus("");
  }

  return (
    <div className="space-y-6">
      {variableTemplate.trim() && (
        <PromptVariablePanel
          template={variableTemplate}
          onApply={(completedPrompt) => {
            setPrompt(completedPrompt);

            setStatus("Prompt variables applied.");
          }}
        />
      )}

      {initialProjectId && (
        <div className="rounded-lg border border-emerald-800 bg-emerald-950/30 p-4">
          <p className="text-sm font-medium text-emerald-400">
            ✓ Scene destination loaded
          </p>

          <p className="mt-1 text-xs text-zinc-400">
            Project: {initialProjectId}
            {initialSceneId ? ` · Scene ${initialSceneId}` : ""}
          </p>
        </div>
      )}

      {libraryLoading && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-400">
          Loading Prompt Builder libraries...
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-700 bg-red-950/50 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {status && (
        <div className="rounded-lg border border-emerald-800 bg-emerald-950/30 p-4 text-sm text-emerald-400">
          {status}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[430px_1fr]">
        <div className="space-y-6">
          <Panel
            title="Prompt Settings"
            description="Choose the type of production prompt you want."
          >
            <Field label="Prompt Type">
              <select
                value={form.type}
                onChange={(event) =>
                  updateField("type", event.target.value as PromptType)
                }
                className="input"
              >
                {promptTypes.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
          </Panel>

          <Panel title="🎨 Style" description="Select a saved Style Template.">
            <Field label="Style Template">
              <select
                value={form.templateId ?? ""}
                onChange={(event) => handleTemplateChange(event.target.value)}
                className="input"
              >
                <option value="">No Style Template</option>

                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </Field>

            {activeTemplate && (
              <div className="rounded-lg border border-emerald-900 bg-emerald-950/20 p-4">
                <p className="font-medium text-emerald-400">
                  {activeTemplate.name}
                </p>

                {activeTemplate.description && (
                  <p className="mt-2 text-xs leading-5 text-zinc-500">
                    {activeTemplate.description}
                  </p>
                )}
              </div>
            )}

            <Link
              href="/prompts/templates"
              className="inline-block text-sm font-medium text-emerald-400 hover:text-emerald-300"
            >
              Manage Style Templates →
            </Link>
          </Panel>

          <Panel
            title="🎭 Cast"
            description="Select the saved characters visible in this prompt."
          >
            {castProfiles.length === 0 ? (
              <div className="rounded-lg border border-dashed border-zinc-700 p-5 text-center">
                <p className="text-sm text-zinc-500">No Cast Profiles found.</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {castProfiles.map((profile) => {
                  const selected =
                    form.selectedCastIds?.includes(profile.id) ?? false;

                  return (
                    <button
                      key={profile.id}
                      type="button"
                      onClick={() => toggleCast(profile.id)}
                      className={`rounded-lg border p-4 text-left transition ${
                        selected
                          ? "border-emerald-500 bg-emerald-950/30"
                          : "border-zinc-700 bg-zinc-950 hover:border-zinc-500"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold">{profile.name}</span>

                        <span
                          className={
                            selected ? "text-emerald-400" : "text-zinc-600"
                          }
                        >
                          {selected ? "✓" : "+"}
                        </span>
                      </div>

                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-500">
                        {profile.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}

            <Link
              href="/prompts/cast"
              className="inline-block text-sm font-medium text-emerald-400 hover:text-emerald-300"
            >
              Manage Cast Library →
            </Link>
          </Panel>

          <Panel
            title="🎬 Scene Details"
            description="Describe exactly what you want to generate."
          >
            <Field label="Subject">
              <textarea
                value={form.subject}
                onChange={(event) => updateField("subject", event.target.value)}
                rows={3}
                placeholder="Main subject"
                className="input resize-y"
              />
            </Field>

            <Field label="Action">
              <textarea
                value={form.action ?? ""}
                onChange={(event) => updateField("action", event.target.value)}
                rows={3}
                placeholder="What happens?"
                className="input resize-y"
              />
            </Field>

            <Field label="Environment">
              <textarea
                value={form.environment ?? ""}
                onChange={(event) =>
                  updateField("environment", event.target.value)
                }
                rows={3}
                placeholder="Location and environment"
                className="input resize-y"
              />
            </Field>

            <Field label="Additional Style">
              <select
                value={form.style ?? ""}
                onChange={(event) => updateField("style", event.target.value)}
                className="input"
              >
                {styles.map((value) => (
                  <option key={value || "none"} value={value}>
                    {value || "Not specified"}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Camera">
              <select
                value={form.camera ?? ""}
                onChange={(event) => updateField("camera", event.target.value)}
                className="input"
              >
                {cameraOptions.map((value) => (
                  <option key={value || "none"} value={value}>
                    {value || "Not specified"}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Lighting">
              <select
                value={form.lighting ?? ""}
                onChange={(event) =>
                  updateField("lighting", event.target.value)
                }
                className="input"
              >
                {lightingOptions.map((value) => (
                  <option key={value || "none"} value={value}>
                    {value || "Not specified"}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Mood">
              <select
                value={form.mood ?? ""}
                onChange={(event) => updateField("mood", event.target.value)}
                className="input"
              >
                {moodOptions.map((value) => (
                  <option key={value || "none"} value={value}>
                    {value || "Not specified"}
                  </option>
                ))}
              </select>
            </Field>

            {(form.type === "video" || form.type === "scene") && (
              <Field label="Duration">
                <select
                  value={form.duration ?? ""}
                  onChange={(event) =>
                    updateField("duration", event.target.value)
                  }
                  className="input"
                >
                  {durations.map((value) => (
                    <option key={value || "none"} value={value}>
                      {value || "Not specified"}
                    </option>
                  ))}
                </select>
              </Field>
            )}

            <Field label="Extra Instructions">
              <textarea
                value={form.extraInstructions ?? ""}
                onChange={(event) =>
                  updateField("extraInstructions", event.target.value)
                }
                rows={4}
                placeholder="Aspect ratio, continuity rules, restrictions..."
                className="input resize-y"
              />
            </Field>

            <button
              type="button"
              onClick={handleBuildPrompt}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-5 py-3 font-semibold transition hover:border-emerald-500"
            >
              🧱 Build Prompt
            </button>

            <button
              type="button"
              onClick={polishWithAI}
              disabled={loading}
              className="w-full rounded-lg bg-emerald-600 px-5 py-3 font-semibold transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "✨ Polishing..." : "✨ Polish with Ollama"}
            </button>
          </Panel>
        </div>

        <div className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <Panel
            title="🧠 Production Prompt"
            description="Your final prompt with Cast and Style Locks injected."
          >
            <div className="flex flex-wrap gap-2">
              {(form.selectedCastIds?.length ?? 0) > 0 && (
                <span className="rounded-full border border-emerald-900 bg-emerald-950/30 px-3 py-1 text-xs text-emerald-400">
                  🔒 {form.selectedCastIds?.length} Cast
                </span>
              )}

              {form.styleLock?.trim() && (
                <span className="rounded-full border border-emerald-900 bg-emerald-950/30 px-3 py-1 text-xs text-emerald-400">
                  🔒 Style
                </span>
              )}

              <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs uppercase text-zinc-400">
                {form.type}
              </span>
            </div>

            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Your production prompt will appear here..."
              className="input min-h-150 resize-y leading-7"
            />

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleCopy}
                disabled={!prompt.trim()}
                className="rounded-lg bg-emerald-600 px-5 py-3 font-semibold disabled:opacity-50"
              >
                📋 Copy
              </button>

              <button
                type="button"
                onClick={handleDownload}
                disabled={!prompt.trim()}
                className="rounded-lg border border-zinc-700 px-5 py-3 disabled:opacity-50"
              >
                ⬇ Download
              </button>

              <button
                type="button"
                onClick={handleClearPrompt}
                disabled={!prompt.trim()}
                className="rounded-lg border border-red-800 px-5 py-3 text-red-400 disabled:opacity-50"
              >
                🗑 Clear
              </button>
            </div>
          </Panel>

          <Panel
            title="💾 Save Prompt"
            description="Save the final production prompt globally or attach it to a project and scene."
          >
            <Field label="Prompt Name">
              <input
                value={promptName}
                onChange={(event) => setPromptName(event.target.value)}
                placeholder="Example: Scene 3 Final Prompt"
                className="input"
              />
            </Field>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Project">
                <select
                  value={selectedProjectId}
                  onChange={(event) => {
                    setSelectedProjectId(event.target.value);

                    setSelectedSceneId("");
                  }}
                  className="input"
                >
                  <option value="">No Project</option>

                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Scene #">
                <input
                  type="number"
                  min="1"
                  value={selectedSceneId}
                  onChange={(event) => setSelectedSceneId(event.target.value)}
                  placeholder="Scene #"
                  className="input"
                />
              </Field>
            </div>

            <button
              type="button"
              onClick={handleSavePrompt}
              disabled={!prompt.trim()}
              className="rounded-lg bg-emerald-600 px-5 py-3 font-semibold transition hover:bg-emerald-500 disabled:opacity-50"
            >
              💾 Save Prompt
            </button>
          </Panel>

          <Panel
            title="📚 Saved Production Prompts"
            description="Reload previously generated final prompts."
          >
            <div className="max-h-125 space-y-3 overflow-y-auto pr-1">
              {savedPrompts.length === 0 ? (
                <div className="rounded-lg border border-dashed border-zinc-700 p-5 text-center text-sm text-zinc-500">
                  No saved production prompts yet.
                </div>
              ) : (
                savedPrompts.map((saved) => (
                  <div
                    key={saved.id}
                    className="rounded-lg border border-zinc-700 bg-zinc-950 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{saved.name}</p>

                        <p className="mt-1 text-xs uppercase tracking-wide text-zinc-500">
                          {saved.prompt_type}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => handleLoadSavedPrompt(saved)}
                          className="text-xs text-emerald-400"
                        >
                          Load
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteSavedPrompt(saved.id)}
                          className="text-xs text-red-400"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <p className="mt-3 line-clamp-3 whitespace-pre-wrap text-xs leading-5 text-zinc-500">
                      {saved.prompt}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Panel>
        </div>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid rgb(63 63 70);
          background: rgb(9 9 11);
          padding: 0.75rem 1rem;
          color: white;
          outline: none;
        }

        .input:focus {
          border-color: rgb(16 185 129);
        }

        .input::placeholder {
          color: rgb(113 113 122);
        }
      `}</style>
    </div>
  );
}

function Panel({
  title,
  description,
  children,
}: {
  title: string;

  description?: string;

  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="text-xl font-bold">{title}</h2>

      {description && (
        <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
      )}

      <div className="mt-6 space-y-5">{children}</div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;

  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-zinc-300">
        {label}
      </label>

      {children}
    </div>
  );
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const value = error as Record<string, unknown>;

    if (typeof value.message === "string") {
      return value.message;
    }
  }

  return fallback;
}
