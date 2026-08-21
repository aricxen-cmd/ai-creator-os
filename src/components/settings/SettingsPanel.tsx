"use client";

import {
  useEffect,
  useState,
} from "react";

const STORAGE_KEY =
  "ai-creator-os-settings";

interface AppSettings {
  provider: string;
  model: string;
  autoSave: boolean;
  defaultPlatform: string;
}

const defaults: AppSettings = {
  provider: "Ollama",
  model: "qwen3:4b",
  autoSave: true,
  defaultPlatform: "YouTube Shorts",
};

export default function SettingsPanel() {
  const [
    settings,
    setSettings,
  ] =
    useState<AppSettings>(
      defaults
    );

  const [
    status,
    setStatus,
  ] = useState("");

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(
          STORAGE_KEY
        );

      if (saved) {
        setSettings({
          ...defaults,
          ...JSON.parse(saved),
        });
      }
    } catch {
      // Ignore malformed local settings.
    }
  }, []);

  function updateSetting<
    K extends keyof AppSettings
  >(
    key: K,
    value: AppSettings[K]
  ) {
    setSettings(
      (previous) => ({
        ...previous,
        [key]: value,
      })
    );

    setStatus("");
  }

  function handleSave() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        settings
      )
    );

    setStatus(
      "Settings saved on this device."
    );
  }

  function handleReset() {
    setSettings(
      defaults
    );

    localStorage.removeItem(
      STORAGE_KEY
    );

    setStatus(
      "Settings reset to defaults."
    );
  }

  return (
    <div className="space-y-6">
      {status && (
        <div className="rounded-lg border border-emerald-800 bg-emerald-950/30 p-4 text-sm text-emerald-400">
          {status}
        </div>
      )}

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-xl font-bold">
          AI Defaults
        </h2>

        <p className="mt-2 text-sm text-zinc-400">
          These preferences are stored locally for this test release.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Field label="Provider">
            <select
              value={
                settings.provider
              }
              onChange={(
                event
              ) =>
                updateSetting(
                  "provider",
                  event.target
                    .value
                )
              }
              className="input"
            >
              <option value="Ollama">
                Ollama
              </option>

              <option value="OpenAI">
                OpenAI
              </option>

              <option value="Groq">
                Groq
              </option>

              <option value="Gemini">
                Gemini
              </option>

              <option value="OpenRouter">
                OpenRouter
              </option>
            </select>
          </Field>

          <Field label="Default Model">
            <input
              value={
                settings.model
              }
              onChange={(
                event
              ) =>
                updateSetting(
                  "model",
                  event.target
                    .value
                )
              }
              placeholder="qwen3:4b"
              className="input"
            />
          </Field>
        </div>

        <Field label="Default Platform">
          <select
            value={
              settings.defaultPlatform
            }
            onChange={(
              event
            ) =>
              updateSetting(
                "defaultPlatform",
                event.target
                  .value
              )
            }
            className="input"
          >
            <option>
              YouTube Shorts
            </option>

            <option>
              YouTube
            </option>

            <option>
              TikTok
            </option>

            <option>
              Instagram Reels
            </option>
          </select>
        </Field>

        <div className="mt-6 flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 p-4">
          <div>
            <p className="font-medium">
              Auto Save
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              Automatically save supported project outputs.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              updateSetting(
                "autoSave",
                !settings.autoSave
              )
            }
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              settings.autoSave
                ? "bg-emerald-600 text-white"
                : "bg-zinc-800 text-zinc-400"
            }`}
          >
            {settings.autoSave
              ? "On"
              : "Off"}
          </button>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={
              handleSave
            }
            className="rounded-lg bg-emerald-600 px-5 py-3 font-semibold transition hover:bg-emerald-500"
          >
            💾 Save Settings
          </button>

          <button
            type="button"
            onClick={
              handleReset
            }
            className="rounded-lg border border-zinc-700 px-5 py-3 text-zinc-300 transition hover:border-zinc-500"
          >
            Reset Defaults
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-amber-800/50 bg-amber-950/10 p-5">
        <p className="font-medium text-amber-300">
          Test Release Note
        </p>

        <p className="mt-2 text-sm leading-6 text-zinc-400">
          These settings currently control saved preferences only.
          Some existing tools still use their own hard-coded provider/model
          defaults. We can connect every studio to this central settings store
          after the release smoke test.
        </p>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid
            rgb(63 63 70);
          background:
            rgb(9 9 11);
          padding:
            0.75rem 1rem;
          color: white;
          outline: none;
        }

        .input:focus {
          border-color:
            rgb(16 185 129);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children:
    React.ReactNode;
}) {
  return (
    <div className="mt-5">
      <label className="mb-2 block text-sm font-medium text-zinc-300">
        {label}
      </label>

      {children}
    </div>
  );
}