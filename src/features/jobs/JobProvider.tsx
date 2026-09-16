"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { GenerationJob, StartGenerationJob } from "./types";

const STORAGE_KEY = "ai-creator-os:generation-jobs";
const MAX_SAVED_JOBS = 12;

type JobExecutor = () => Promise<unknown>;

interface JobContextValue {
  jobs: GenerationJob[];
  runJob<T>(input: StartGenerationJob, executor: () => Promise<T>): Promise<T>;
  retryJob(id: string): Promise<void>;
  dismissJob(id: string): void;
  clearCompleted(): void;
  setJobProgress(id: string, progress: number): void;
}

const JobContext = createContext<JobContextValue | null>(null);

function loadJobs(): GenerationJob[] {
  if (typeof window === "undefined") return [];

  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as GenerationJob[];
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, MAX_SAVED_JOBS).map((job) => job.status === "running" || job.status === "queued"
      ? { ...job, status: "failed", error: "Generation was interrupted. Run it again.", updatedAt: Date.now() }
      : job);
  } catch {
    return [];
  }
}

function createJobId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `job-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function JobProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<GenerationJob[]>(loadJobs);
  const executors = useRef(new Map<string, JobExecutor>());

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs.slice(0, MAX_SAVED_JOBS)));
  }, [jobs]);

  const patchJob = useCallback((id: string, updates: Partial<GenerationJob>) => {
    setJobs((current) => current.map((job) => job.id === id
      ? { ...job, ...updates, updatedAt: Date.now() }
      : job));
  }, []);

  const execute = useCallback(async <T,>(id: string, executor: () => Promise<T>) => {
    executors.current.set(id, executor);
    patchJob(id, { status: "running", progress: 10, error: undefined });

    try {
      const result = await executor();
      patchJob(id, { status: "completed", progress: 100 });
      return result;
    } catch (error) {
      patchJob(id, {
        status: "failed",
        progress: undefined,
        error: error instanceof Error ? error.message : "Generation failed.",
      });
      throw error;
    }
  }, [patchJob]);

  const runJob = useCallback(async <T,>(input: StartGenerationJob, executor: () => Promise<T>) => {
    const id = createJobId();
    const now = Date.now();
    const job: GenerationJob = {
      id,
      ...input,
      status: "queued",
      progress: 0,
      createdAt: now,
      updatedAt: now,
    };
    setJobs((current) => [job, ...current].slice(0, MAX_SAVED_JOBS));
    return execute(id, executor);
  }, [execute]);

  const retryJob = useCallback(async (id: string) => {
    const executor = executors.current.get(id);
    if (!executor) {
      patchJob(id, { error: "Return to the original tool to run this job again." });
      return;
    }
    await execute(id, executor).then(() => undefined).catch(() => undefined);
  }, [execute, patchJob]);

  const value = useMemo<JobContextValue>(() => ({
    jobs,
    runJob,
    retryJob,
    dismissJob: (id) => setJobs((current) => current.filter((job) => job.id !== id)),
    clearCompleted: () => setJobs((current) => current.filter((job) => job.status !== "completed")),
    setJobProgress: (id, progress) => patchJob(id, { progress: Math.max(0, Math.min(100, progress)) }),
  }), [jobs, patchJob, retryJob, runJob]);

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
}

export function useGenerationJobs() {
  const context = useContext(JobContext);
  if (!context) throw new Error("useGenerationJobs must be used inside JobProvider.");
  return context;
}
