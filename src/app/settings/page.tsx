import AppShell from "@/components/layout/AppShell";
import SettingsPanel from "@/components/settings/SettingsPanel";

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-400">
            Application
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            ⚙️ Settings
          </h1>

          <p className="mt-3 max-w-3xl text-zinc-400">
            Configure local AI defaults and basic AI Creator OS preferences.
          </p>
        </div>

        <SettingsPanel />
      </div>
    </AppShell>
  );
}