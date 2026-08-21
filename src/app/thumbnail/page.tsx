import AppShell from "@/components/layout/AppShell";

import Link from "next/link";

export default function ThumbnailPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-400">
            Production
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            🖼️ Thumbnail Studio
          </h1>

          <p className="mt-3 max-w-3xl text-zinc-400">
            Plan high-click-through thumbnail concepts and create
            production-ready thumbnail prompts.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-xl font-bold">
              Thumbnail Setup
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Thumbnail generation is being prepared for the first test release.
              You can already use the Prompt Vault thumbnail templates.
            </p>

            <Link href="/prompts/library">
              Prompt Library
            </Link>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-xl font-bold">
              Preview
            </h2>

            <div className="mt-6 flex min-h-105 items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-950/50 p-8 text-center">
              <div>
                <div className="text-5xl">
                  🖼️
                </div>

                <h3 className="mt-4 font-semibold">
                  Thumbnail workspace ready
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
                  Full thumbnail generation will be added after the test release
                  stability pass.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}