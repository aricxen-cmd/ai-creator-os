"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Navigation from "./Navigation";

export default function Header() {
  const router = useRouter();

  const [search, setSearch] =
    useState("");

  const [mobileOpen, setMobileOpen] =
    useState(false);

  function handleSearch(
    event: React.FormEvent
  ) {
    event.preventDefault();

    const query =
      search.trim();

    if (!query) {
      return;
    }

    router.push(
      `/prompts/library?search=${encodeURIComponent(
        query
      )}`
    );
  }

  return (
    <header className="relative flex min-h-16 items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-950 px-4 py-3 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="rounded-lg border border-zinc-800 p-2 text-zinc-300 lg:hidden"
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>

      <form
        onSubmit={
          handleSearch
        }
        className="min-w-0 flex-1 lg:max-w-md"
      >
        <input
          type="search"
          value={search}
          onChange={(
            event
          ) =>
            setSearch(
              event.target.value
            )
          }
          placeholder="Search Prompt Vault..."
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white outline-none transition focus:border-emerald-500"
        />
      </form>

      <Link
        href="/projects"
        className="shrink-0 rounded-lg bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 sm:px-4"
      >
        <span className="sm:hidden">+ Project</span>
        <span className="hidden sm:inline">+ New Project</span>
      </Link>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-black/70" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />
          <aside className="relative h-full w-72 max-w-[85vw] overflow-y-auto border-r border-zinc-800 bg-zinc-950 p-5 shadow-2xl">
            <div className="mb-7 flex items-center justify-between">
              <p className="text-xl font-bold">AI Creator OS</p>
              <button type="button" onClick={() => setMobileOpen(false)} className="rounded-lg border border-zinc-800 p-2 text-zinc-400" aria-label="Close navigation"><X size={18} /></button>
            </div>
            <Navigation onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </header>
  );
}
