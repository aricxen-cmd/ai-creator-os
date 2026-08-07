export default function ActionBar() {
  return (
    <div className="flex flex-wrap gap-4">
      <button className="rounded-lg bg-emerald-600 px-5 py-3 font-semibold">
        💾 Save
      </button>

      <button className="rounded-lg border border-zinc-700 px-5 py-3">
        📋 Copy
      </button>

      <button className="rounded-lg border border-zinc-700 px-5 py-3">
        ⬇ Download
      </button>

      <button className="rounded-lg border border-red-700 px-5 py-3 text-red-400">
        🗑 Clear
      </button>
    </div>
  );
}