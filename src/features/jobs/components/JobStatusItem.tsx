"use client";

import Link from "next/link";
import type { GenerationJob } from "../types";

const statusColor = {
  queued: "text-amber-400",
  running: "text-sky-400",
  completed: "text-emerald-400",
  failed: "text-red-400",
};

interface Props {
  job: GenerationJob;
  canRetry: boolean;
  onRetry(): void;
  onDismiss(): void;
}

export default function JobStatusItem({ job, canRetry, onRetry, onDismiss }: Props) {
  return (
    <div className="border-t border-zinc-800 px-4 py-3 first:border-t-0">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold uppercase ${statusColor[job.status]}`}>{job.status}</span>
            <p className="truncate text-sm font-medium text-white">{job.title}</p>
          </div>
          {job.error && <p className="mt-1 text-xs text-red-300">{job.error}</p>}
          {job.status === "running" && (
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-800">
              <div className="h-full rounded-full bg-sky-500 transition-all" style={{ width: `${job.progress ?? 10}%` }} />
            </div>
          )}
        </div>
        <div className="flex shrink-0 gap-2 text-xs">
          {job.href && <Link href={job.href} className="text-emerald-400 hover:text-emerald-300">Open</Link>}
          {job.status === "failed" && <button type="button" onClick={onRetry} className="text-sky-400 disabled:text-zinc-600" disabled={!canRetry}>Retry</button>}
          <button type="button" onClick={onDismiss} className="text-zinc-500 hover:text-white">Dismiss</button>
        </div>
      </div>
    </div>
  );
}
