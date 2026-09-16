"use client";

import { useEffect, useState } from "react";
import type { Scene } from "../types";
import { detectCastProfiles, type SuggestedCastProfile } from "../services/detectCastProfiles";
import { createCastProfile, getCastProfiles, type CastProfileRow } from "@/lib/supabase/castProfiles";

interface Props {
  scenes: Scene[];
  script: string;
  storyboard: string;
}

export default function CastDiscoveryPanel({ scenes, script, storyboard }: Props) {
  const [library, setLibrary] = useState<CastProfileRow[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestedCastProfile[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getCastProfiles().then(setLibrary).catch(() => setMessage("Cast Library is unavailable."));
  }, []);

  async function detect() {
    setBusy(true);
    setMessage("");
    try {
      const result = await detectCastProfiles({ scenes, script, storyboard });
      setSuggestions(result);
      setMessage(result.length ? `Found ${result.length} reusable characters.` : "No recurring characters found.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Character detection failed.");
    } finally {
      setBusy(false);
    }
  }

  async function saveSelected() {
    const selected = suggestions.filter((profile) => profile.selected);
    const existing = new Set(library.map((profile) => profile.name.trim().toLowerCase()));
    const pending = selected.filter((profile) => !existing.has(profile.name.trim().toLowerCase()));
    if (!pending.length) {
      setMessage("No new selected characters to save.");
      return;
    }
    setBusy(true);
    try {
      await Promise.all(pending.map((profile) => createCastProfile(profile.name, profile.description)));
      setLibrary(await getCastProfiles());
      setMessage(`Saved ${pending.length} characters to Cast Library.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save Cast Library profiles.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">Continuity</p>
          <h2 className="mt-2 text-2xl font-bold">Cast Discovery</h2>
          <p className="mt-2 text-sm text-zinc-400">Find recurring characters and save reusable identity locks.</p>
        </div>
        <button type="button" onClick={detect} disabled={busy} className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold disabled:opacity-50">
          {busy ? "Working..." : "Detect Cast"}
        </button>
      </div>

      {message && <p className="mt-4 text-sm text-zinc-300">{message}</p>}

      {suggestions.length > 0 && (
        <div className="mt-5 space-y-3">
          {suggestions.map((profile, index) => (
            <label key={`${profile.name}-${index}`} className="flex gap-3 rounded-lg border border-zinc-800 bg-zinc-950 p-4">
              <input type="checkbox" checked={profile.selected} onChange={(event) => setSuggestions((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, selected: event.target.checked } : item))} />
              <span><strong>{profile.name}</strong><span className="mt-1 block text-sm leading-6 text-zinc-400">{profile.description}</span></span>
            </label>
          ))}
          <button type="button" onClick={saveSelected} disabled={busy} className="rounded-lg border border-emerald-700 px-4 py-2.5 text-sm font-semibold text-emerald-400 disabled:opacity-50">Save Selected Cast</button>
        </div>
      )}

      <p className="mt-5 text-xs text-zinc-500">{library.length} profiles currently in Cast Library.</p>
    </section>
  );
}
