"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const router = useRouter();

  const [search, setSearch] =
    useState("");

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
    <header className="flex min-h-16 flex-wrap items-center justify-between gap-4 border-b border-zinc-800 bg-zinc-950 px-6 py-3 lg:px-8">
      <form
        onSubmit={
          handleSearch
        }
        className="w-full max-w-md"
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
        className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
      >
        + New Project
      </Link>
    </header>
  );
}