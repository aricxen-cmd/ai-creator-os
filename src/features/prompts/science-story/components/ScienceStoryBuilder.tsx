"use client";

import { useState } from "react";
import {
  Beaker,
  Clapperboard,
  Loader2,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import { buildScienceStoryPrompt } from "../buildScienceStoryPrompt";

import type {
  CharacterStyle,
  ScienceStoryInput,
  ScienceStoryLength,
  ScienceStoryPlatform,
  ScienceStoryProductionPack,
  ScienceStoryStyle,
} from "../types";

import ProductionPack from "./ProductionPack";

const DEFAULT_FORM: ScienceStoryInput = {
  topic: "",
  platform: "YouTube Shorts",
  length: "60 Seconds",
  visualStyle: "3D Cinematic",
  sceneCount: 12,
  characterStyle: "3D Human",
  customCharacter: "",
  audience: "General audience",
  additionalInstructions: "",
};

export default function ScienceStoryBuilder() {
  const [form, setForm] =
    useState<ScienceStoryInput>(DEFAULT_FORM);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [productionPack, setProductionPack] =
    useState<ScienceStoryProductionPack | null>(null);

  function updateField<K extends keyof ScienceStoryInput>(
    field: K,
    value: ScienceStoryInput[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleGenerate() {
    if (!form.topic.trim()) {
      setError("Please enter a video idea.");
      return;
    }

    setLoading(true);
    setError("");
    setProductionPack(null);

    try {
      const prompt = buildScienceStoryPrompt(form);

      const response = await fetch("/api/ai/chat", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          prompt,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Generation failed with status ${response.status}.`
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.error || "The AI request failed."
        );
      }

      const rawResponse =
        typeof data.response === "string"
          ? data.response
          : JSON.stringify(data.response);

      const cleanedResponse = rawResponse
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      let parsed: ScienceStoryProductionPack;

      try {
        parsed = JSON.parse(cleanedResponse);
      } catch {
        console.error(
          "Science Story JSON parse error:",
          rawResponse
        );

        throw new Error(
          "The AI responded, but the production pack was not valid JSON."
        );
      }

      setProductionPack(parsed);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while generating the story."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Beaker className="h-6 w-6 text-emerald-500" />

          <h1 className="text-2xl font-bold tracking-tight">
            What If / Science Story
          </h1>
        </div>

        <p className="max-w-3xl text-sm text-muted-foreground">
          Turn one idea into a complete AI video production
          package including the script, characters,
          storyboard, scene prompts, animation prompts,
          audio direction, thumbnails, and metadata.
        </p>
      </div>

      {/* Builder */}

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <WandSparkles className="h-5 w-5" />

            <h2 className="font-semibold">
              Story Settings
            </h2>
          </div>

          <div className="space-y-5">
            {/* Topic */}

            <div className="space-y-2">
              <label
                htmlFor="science-story-topic"
                className="text-sm font-medium"
              >
                Video Idea
              </label>

              <textarea
                id="science-story-topic"
                value={form.topic}
                onChange={(event) =>
                  updateField(
                    "topic",
                    event.target.value
                  )
                }
                placeholder="Example: What if Earth suddenly stopped spinning?"
                className="min-h-28 w-full resize-none rounded-xl border bg-background px-3 py-3 text-sm outline-none transition focus:border-emerald-500"
              />
            </div>

            {/* Platform + Length */}

            <div className="grid grid-cols-2 gap-3">
              <SelectField
                label="Platform"
                value={form.platform}
                options={[
                  "YouTube Shorts",
                  "TikTok",
                  "Instagram Reels",
                  "YouTube",
                ]}
                onChange={(value) =>
                  updateField(
                    "platform",
                    value as ScienceStoryPlatform
                  )
                }
              />

              <SelectField
                label="Length"
                value={form.length}
                options={[
                  "30 Seconds",
                  "60 Seconds",
                  "90 Seconds",
                  "3 Minutes",
                  "5 Minutes",
                ]}
                onChange={(value) =>
                  updateField(
                    "length",
                    value as ScienceStoryLength
                  )
                }
              />
            </div>

            {/* Style + Scenes */}

            <div className="grid grid-cols-2 gap-3">
              <SelectField
                label="Visual Style"
                value={form.visualStyle}
                options={[
                  "3D Cinematic",
                  "3D Medical",
                  "Realistic",
                  "Documentary",
                  "Cartoon",
                  "POV",
                ]}
                onChange={(value) =>
                  updateField(
                    "visualStyle",
                    value as ScienceStoryStyle
                  )
                }
              />

              <div className="space-y-2">
                <label
                  htmlFor="science-story-scenes"
                  className="text-sm font-medium"
                >
                  Scenes
                </label>

                <input
                  id="science-story-scenes"
                  type="number"
                  min={4}
                  max={30}
                  value={form.sceneCount}
                  onChange={(event) => {
                    const value = Number(
                      event.target.value
                    );

                    updateField(
                      "sceneCount",
                      Math.min(
                        30,
                        Math.max(4, value || 4)
                      )
                    );
                  }}
                  className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Character */}

            <SelectField
              label="Character"
              value={form.characterStyle}
              options={[
                "3D Human",
                "Anatomical Human",
                "Astronaut",
                "Scientist",
                "Animal",
                "Custom",
              ]}
              onChange={(value) =>
                updateField(
                  "characterStyle",
                  value as CharacterStyle
                )
              }
            />

            {form.characterStyle === "Custom" && (
              <div className="space-y-2">
                <label
                  htmlFor="science-story-character"
                  className="text-sm font-medium"
                >
                  Custom Character
                </label>

                <textarea
                  id="science-story-character"
                  value={
                    form.customCharacter || ""
                  }
                  onChange={(event) =>
                    updateField(
                      "customCharacter",
                      event.target.value
                    )
                  }
                  placeholder="Describe the recurring character..."
                  className="min-h-24 w-full resize-none rounded-xl border bg-background px-3 py-3 text-sm outline-none transition focus:border-emerald-500"
                />
              </div>
            )}

            {/* Audience */}

            <div className="space-y-2">
              <label
                htmlFor="science-story-audience"
                className="text-sm font-medium"
              >
                Audience
              </label>

              <input
                id="science-story-audience"
                value={form.audience || ""}
                onChange={(event) =>
                  updateField(
                    "audience",
                    event.target.value
                  )
                }
                placeholder="General audience"
                className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-emerald-500"
              />
            </div>

            {/* Extra instructions */}

            <div className="space-y-2">
              <label
                htmlFor="science-story-instructions"
                className="text-sm font-medium"
              >
                Additional Instructions
              </label>

              <textarea
                id="science-story-instructions"
                value={
                  form.additionalInstructions || ""
                }
                onChange={(event) =>
                  updateField(
                    "additionalInstructions",
                    event.target.value
                  )
                }
                placeholder="Optional creative direction..."
                className="min-h-24 w-full resize-none rounded-xl border bg-background px-3 py-3 text-sm outline-none transition focus:border-emerald-500"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
                {error}
              </div>
            )}

            {/* Generate */}

            <button
              type="button"
              disabled={loading}
              onClick={handleGenerate}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Building Production Pack...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Generate Production Pack
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output */}

        <div className="min-w-0">
          {productionPack ? (
            <ProductionPack
              productionPack={productionPack}
            />
          ) : (
            <EmptyProductionPack />
          )}
        </div>
      </div>
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-emerald-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function EmptyProductionPack() {
  return (
    <div className="flex min-h-150 items-center justify-center rounded-2xl border border-dashed bg-card/30 p-8">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10">
          <Clapperboard className="h-7 w-7 text-emerald-500" />
        </div>

        <h2 className="text-lg font-semibold">
          Your production pack will appear here
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Enter a science or What If idea and the
          generator will build your script, characters,
          scenes, image prompts, video prompts,
          thumbnails, and metadata.
        </p>
      </div>
    </div>
  );
}