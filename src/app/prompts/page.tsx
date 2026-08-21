import AppShell from "@/components/layout/AppShell";
import Link from "next/link";

const tools = [
  {
    title: "Prompt Library",
    description:
      "Browse, search, favorite, edit, copy, and reuse saved prompts.",
    href: "/prompts/library",
    icon: "📚",
  },
  {
    title: "Prompt Packs",
    description:
      "Import built-in and JSON prompt packs with duplicate protection.",
    href: "/prompts/packs",
    icon: "📦",
  },
  {
    title: "Prompt Builder",
    description:
      "Build production-ready prompts with Cast Lock, Style Lock, and Ollama.",
    href: "/prompts/builder",
    icon: "🛠",
  },
  {
    title: "Style Templates",
    description:
      "Manage reusable visual Style Locks for consistent productions.",
    href: "/prompts/templates",
    icon: "🎨",
  },
  {
    title: "Cast Library",
    description:
      "Manage reusable character profiles and Cast Locks.",
    href: "/prompts/cast",
    icon: "🎭",
  },
];

export default function PromptsPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-400">
            Prompt Engine
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            🧠 Prompt Hub
          </h1>

          <p className="mt-3 max-w-3xl text-zinc-400">
            Manage your prompt library, production templates,
            reusable cast profiles, prompt packs, and production builder
            from one place.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-emerald-500"
            >
              <div className="text-3xl">
                {tool.icon}
              </div>

              <h2 className="mt-4 text-xl font-bold">
                {tool.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {tool.description}
              </p>

              <p className="mt-5 text-sm font-medium text-emerald-400">
                Open →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}