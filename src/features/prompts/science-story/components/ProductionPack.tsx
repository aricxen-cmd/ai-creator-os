"use client";

import { useState } from "react";
import {
  BookOpen,
  Clapperboard,
  Copy,
  FileText,
  Image as ImageIcon,
  Music,
  Sparkles,
  UserRound,
} from "lucide-react";

import type {
  ScienceStoryProductionPack,
} from "../types";

interface ProductionPackProps {
  productionPack: ScienceStoryProductionPack;
}

type Tab =
  | "overview"
  | "script"
  | "characters"
  | "scenes"
  | "thumbnails"
  | "metadata";

export default function ProductionPack({
  productionPack,
}: ProductionPackProps) {
  const [tab, setTab] =
    useState<Tab>("overview");

  const tabs: {
    id: Tab;
    label: string;
  }[] = [
    { id: "overview", label: "Overview" },
    { id: "script", label: "Script" },
    { id: "characters", label: "Characters" },
    { id: "scenes", label: "Scenes" },
    { id: "thumbnails", label: "Thumbnail" },
    { id: "metadata", label: "Metadata" },
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border bg-card p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-emerald-500/10 p-2">
            <Sparkles className="h-5 w-5 text-emerald-500" />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-emerald-500">
              Production Pack
            </p>

            <h2 className="mt-1 text-xl font-bold">
              {productionPack.title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {productionPack.concept}
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex min-w-max gap-2">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                tab === item.id
                  ? "bg-emerald-600 text-white"
                  : "border bg-card hover:bg-muted"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "overview" && (
        <div className="space-y-4">
          <Section
            icon={<Sparkles />}
            title="Hook"
            text={productionPack.hook}
          />

          <Section
            icon={<BookOpen />}
            title="Research Summary"
            text={
              productionPack.researchSummary
            }
          />

          <Section
            icon={<Clapperboard />}
            title="Visual Direction"
            text={
              productionPack.visualDirection
            }
          />

          <Section
            icon={<Music />}
            title="Music Direction"
            text={
              productionPack.musicDirection
            }
          />
        </div>
      )}

      {tab === "script" && (
        <Section
          icon={<FileText />}
          title="Complete Script"
          text={productionPack.script}
          copy
        />
      )}

      {tab === "characters" && (
        <div className="space-y-4">
          {productionPack.characters?.map(
            (character, index) => (
              <div
                key={`${character.name}-${index}`}
                className="rounded-2xl border bg-card p-6"
              >
                <div className="mb-4 flex items-center gap-2">
                  <UserRound className="h-5 w-5 text-emerald-500" />

                  <h3 className="font-semibold">
                    {character.name}
                  </h3>
                </div>

                <Info
                  label="Role"
                  value={character.role}
                />

                <Info
                  label="Description"
                  value={character.description}
                />

                <Info
                  label="Appearance"
                  value={character.appearance}
                />

                <Info
                  label="Clothing"
                  value={character.clothing}
                />

                <PromptBox
                  title="Character Prompt"
                  text={
                    character.characterPrompt
                  }
                />

                <PromptBox
                  title="Continuity Lock"
                  text={
                    character.continuityPrompt
                  }
                />
              </div>
            )
          )}
        </div>
      )}

      {tab === "scenes" && (
        <div className="space-y-4">
          {productionPack.scenes?.map(
            (scene) => (
              <div
                key={scene.sceneNumber}
                className="rounded-2xl border bg-card p-6"
              >
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-500">
                      Scene {scene.sceneNumber}
                    </p>

                    <h3 className="mt-1 font-semibold">
                      {scene.title}
                    </h3>
                  </div>

                  <span className="rounded-lg bg-muted px-3 py-1 text-xs">
                    {scene.duration}
                  </span>
                </div>

                <Info
                  label="Narration"
                  value={scene.narration}
                />

                <Info
                  label="On-Screen Text"
                  value={scene.onScreenText}
                />

                <PromptBox
                  title="Text → Image"
                  text={
                    scene.textToImagePrompt
                  }
                />

                <PromptBox
                  title="Image → Video"
                  text={
                    scene.imageToVideoPrompt
                  }
                />

                {scene.soundEffects?.length >
                  0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Sound Effects
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {scene.soundEffects.map(
                        (effect) => (
                          <span
                            key={effect}
                            className="rounded-lg bg-muted px-3 py-1 text-xs"
                          >
                            {effect}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}

                {scene.transition && (
                  <Info
                    label="Transition"
                    value={scene.transition}
                  />
                )}
              </div>
            )
          )}
        </div>
      )}

      {tab === "thumbnails" && (
        <div className="space-y-4">
          {productionPack.thumbnails?.map(
            (thumbnail, index) => (
              <div
                key={`${thumbnail.title}-${index}`}
                className="rounded-2xl border bg-card p-6"
              >
                <div className="mb-4 flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-emerald-500" />

                  <h3 className="font-semibold">
                    {thumbnail.title}
                  </h3>
                </div>

                <Info
                  label="Concept"
                  value={thumbnail.concept}
                />

                <Info
                  label="Text Overlay"
                  value={thumbnail.textOverlay}
                />

                <PromptBox
                  title="Thumbnail Prompt"
                  text={thumbnail.prompt}
                />
              </div>
            )
          )}
        </div>
      )}

      {tab === "metadata" && (
        <div className="space-y-4">
          <div className="rounded-2xl border bg-card p-6">
            <h3 className="mb-4 font-semibold">
              Video Titles
            </h3>

            <div className="space-y-2">
              {productionPack.metadata?.titles?.map(
                (title, index) => (
                  <div
                    key={`${title}-${index}`}
                    className="rounded-xl bg-muted p-3 text-sm"
                  >
                    {title}
                  </div>
                )
              )}
            </div>
          </div>

          <Section
            icon={<FileText />}
            title="Description"
            text={
              productionPack.metadata
                ?.description || ""
            }
            copy
          />

          <div className="rounded-2xl border bg-card p-6">
            <h3 className="mb-3 font-semibold">
              Keywords
            </h3>

            <div className="flex flex-wrap gap-2">
              {productionPack.metadata?.keywords?.map(
                (keyword) => (
                  <span
                    key={keyword}
                    className="rounded-lg bg-muted px-3 py-1 text-xs"
                  >
                    {keyword}
                  </span>
                )
              )}
            </div>

            <h3 className="mb-3 mt-6 font-semibold">
              Hashtags
            </h3>

            <div className="flex flex-wrap gap-2">
              {productionPack.metadata?.hashtags?.map(
                (hashtag) => (
                  <span
                    key={hashtag}
                    className="rounded-lg bg-emerald-500/10 px-3 py-1 text-xs text-emerald-500"
                  >
                    {hashtag}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({
  icon,
  title,
  text,
  copy = false,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  copy?: boolean;
}) {
  return (
    <div className="rounded-2xl border bg-card p-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="text-emerald-500">
            {icon}
          </div>

          <h3 className="font-semibold">
            {title}
          </h3>
        </div>

        {copy && <CopyButton text={text} />}
      </div>

      <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
        {text}
      </p>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  if (!value) return null;

  return (
    <div className="mb-4">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>

      <p className="whitespace-pre-wrap text-sm leading-6">
        {value}
      </p>
    </div>
  );
}

function PromptBox({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  if (!text) return null;

  return (
    <div className="mt-4 rounded-xl border bg-muted/30 p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-500">
          {title}
        </p>

        <CopyButton text={text} />
      </div>

      <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
        {text}
      </p>
    </div>
  );
}

function CopyButton({
  text,
}: {
  text: string;
}) {
  async function copy() {
    await navigator.clipboard.writeText(
      text || ""
    );
  }

  return (
    <button
      type="button"
      onClick={copy}
      title="Copy"
      className="rounded-lg border p-2 transition hover:bg-muted"
    >
      <Copy className="h-4 w-4" />
    </button>
  );
}