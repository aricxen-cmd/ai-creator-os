"use client";

interface OutlineBuilderProps {
  outline: string;
  loading: boolean;
  onGenerate: () => void;
  onChange: (value: string) => void;
}

export default function OutlineBuilder({
  outline,
  loading,
  onGenerate,
  onChange,
}: OutlineBuilderProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold">
            🧠 Video Outliner
          </h3>

          <p className="mt-1 text-sm text-zinc-400">
            Build and edit the structure before writing the full script.
          </p>
        </div>

        <button
          type="button"
          onClick={onGenerate}
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Building Outline..."
            : outline
              ? "Regenerate Outline"
              : "Generate Outline"}
        </button>
      </div>

      {outline ? (
        <textarea
          value={outline}
          onChange={(e) =>
            onChange(e.target.value)
          }
          rows={18}
          className="w-full resize-y rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-4 leading-7 text-zinc-200 outline-none transition focus:border-blue-500"
        />
      ) : (
        <div className="rounded-lg border border-dashed border-zinc-700 p-8 text-center text-sm text-zinc-500">
          Your video outline will appear here.
        </div>
      )}
    </div>
  );
}