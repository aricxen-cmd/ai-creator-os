"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  projectId: string;
}

export default function ProjectNavigation({ projectId }: Props) {
  const pathname = usePathname();
  const base = `/projects/${projectId}`;
  const tabs = [
    { name: "Overview", href: base, exact: true },
    { name: "Research", href: `${base}/research` },
    { name: "Script", href: `${base}/script` },
    { name: "Storyboard", href: `${base}/storyboard` },
    { name: "Scenes", href: `${base}/scenes` },
  ];

  return (
    <nav className="flex gap-2 overflow-x-auto border-b border-zinc-800 pb-4" aria-label="Project workflow">
      {tabs.map((tab) => {
        const active = tab.exact ? pathname === tab.href : pathname === tab.href || pathname.startsWith(`${tab.href}/`);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`shrink-0 rounded-lg border px-4 py-2 text-sm font-medium transition ${active
              ? "border-emerald-500 bg-emerald-950/30 text-emerald-300"
              : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-600 hover:text-white"
            }`}
          >
            {tab.name}
          </Link>
        );
      })}
    </nav>
  );
}
