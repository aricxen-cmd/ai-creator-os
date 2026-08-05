"use client";

import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-8">
      <input
        type="text"
        placeholder="Search..."
        className="w-80 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
      />

      <Button>
        New Project
      </Button>
    </header>
  );
}