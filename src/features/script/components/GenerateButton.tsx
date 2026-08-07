interface GenerateButtonProps {
  loading: boolean;
  onClick: () => void;
}

export default function GenerateButton({
  loading,
  onClick,
}: GenerateButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full rounded-lg bg-emerald-600 px-6 py-3 font-semibold transition hover:bg-emerald-500 disabled:opacity-50"
    >
      {loading ? "Generating..." : "✨ Generate Script"}
    </button>
  );
}