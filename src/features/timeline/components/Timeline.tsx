"use client";

import Link from "next/link";

import ProgressBar from "./ProgressBar";
import TimelineCard from "./TimelineCard";

import {
  buildTimeline,
} from "../services/timeline";

interface Project {
  id: string;
  title: string;

  research: string | null;
  script: string | null;
  storyboard: string | null;

  scenes: unknown | null;
}

interface Props {
  project: Project;
}

export default function Timeline({
  project,
}: Props) {
  const timeline =
    buildTimeline(project);

  const completed =
    timeline.filter(
      (item) => item.completed
    ).length;

  const progress =
    timeline.length === 0
      ? 0
      : Math.round(
          (completed /
            timeline.length) *
            100
        );

  const current =
    timeline.find(
      (item) =>
        item.current &&
        !item.locked
    ) ??
    timeline.find(
      (item) =>
        !item.completed &&
        !item.locked
    );

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-3xl font-bold">
          Production Timeline
        </h2>

        <p className="mt-2 text-zinc-400">
          {project.title}
        </p>

        <div className="mt-6">
          <ProgressBar
            value={progress}
          />

          <p className="mt-2 text-sm text-zinc-400">
            {progress}% Complete
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {timeline.map(
          (item) => (
            <TimelineCard
              key={item.id}
              projectId={
                project.id
              }
              item={item}
            />
          )
        )}
      </div>

      {current ? (
        <div className="rounded-xl border border-emerald-700 bg-emerald-950/40 p-6">
          <h2 className="text-xl font-bold">
            Continue Working
          </h2>

          <p className="mt-2 text-zinc-300">
            Next step:{" "}
            <strong>
              {current.title}
            </strong>
          </p>

          <Link
            href={`/projects/${project.id}/${current.id}`}
            className="mt-5 inline-flex rounded-lg bg-emerald-600 px-5 py-3 font-semibold transition hover:bg-emerald-500"
          >
            Continue →
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-emerald-700 bg-emerald-950/40 p-6">
          <h2 className="text-xl font-bold">
            Core Production Complete
          </h2>

          <p className="mt-2 text-zinc-300">
            Research, script,
            storyboard, and scenes are
            complete.
          </p>
        </div>
      )}
    </div>
  );
}