"use client";

import { useState } from "react";
import { useGenerationJobs } from "../JobProvider";
import JobStatusItem from "./JobStatusItem";

export default function GlobalVideoStatusBar() {
  const { jobs, retryJob, dismissJob, clearCompleted } = useGenerationJobs();
  const [expanded, setExpanded] = useState(false);

  if (!jobs.length) return null;

  const active = jobs.filter((job) => job.status === "running" || job.status === "queued").length;
  const failed = jobs.filter((job) => job.status === "failed").length;

  return (
    <aside className="border-b border-zinc-800 bg-zinc-900/95 text-white shadow-lg backdrop-blur">
      <div className="flex min-h-11 items-center justify-between gap-4 px-6 lg:px-8">
        <button type="button" onClick={() => setExpanded((value) => !value)} className="flex min-w-0 items-center gap-3 text-left">
          <span className={active ? "text-sky-400" : failed ? "text-red-400" : "text-emerald-400"}>●</span>
          <span className="truncate text-sm font-medium">{active ? `${active} generation job${active === 1 ? "" : "s"} running` : failed ? `${failed} generation job${failed === 1 ? "" : "s"} need attention` : `${jobs.length} recent generation job${jobs.length === 1 ? "" : "s"}`}</span>
          <span className="text-xs text-zinc-500">{expanded ? "Hide" : "Details"}</span>
        </button>
        <button type="button" onClick={clearCompleted} className="text-xs text-zinc-400 hover:text-white">Clear completed</button>
      </div>
      {expanded && (
        <div className="max-h-72 overflow-auto border-t border-zinc-800">
          {jobs.map((job) => (
            <JobStatusItem key={job.id} job={job} canRetry={job.status === "failed"} onRetry={() => void retryJob(job.id)} onDismiss={() => dismissJob(job.id)} />
          ))}
        </div>
      )}
    </aside>
  );
}
