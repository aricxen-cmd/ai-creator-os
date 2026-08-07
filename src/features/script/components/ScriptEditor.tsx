interface ScriptEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ScriptEditor({
  value,
  onChange,
}: ScriptEditorProps) {
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-950 p-6">
      <h3 className="mb-4 text-xl font-bold">
        Generated Script
      </h3>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Your AI generated script will appear here..."
        className="min-h-[350px] w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 p-4 outline-none focus:border-emerald-500"
      />
    </div>
  );
}