"use client";

import { useRouter } from "next/navigation";

interface TopicCardProps {
  topic: string;
}

export default function TopicCard({
  topic,
}: TopicCardProps) {
  const router = useRouter();

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <h3 className="text-xl font-bold">
        {topic}
      </h3>

      <div className="mt-6 grid gap-3">

        <button
  className="rounded-lg bg-zinc-800 px-4 py-3 hover:bg-zinc-700"
  onClick={() =>
    router.push(`/script?topic=${encodeURIComponent(topic)}`)
  }
>
  ✍️ Generate Script
</button>

        <button
          className="rounded-lg bg-zinc-800 px-4 py-3 hover:bg-zinc-700"
        >
          ✍️ Generate Script
        </button>

        <button
          className="rounded-lg bg-zinc-800 px-4 py-3 hover:bg-zinc-700"
        >
          🎬 Storyboard
        </button>

        <button
          className="rounded-lg bg-zinc-800 px-4 py-3 hover:bg-zinc-700"
        >
          🎥 Scene Prompts
        </button>

      </div>

    </div>
  );
}