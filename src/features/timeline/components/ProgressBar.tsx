interface Props {
  value: number;
}

export default function ProgressBar({
  value,
}: Props) {
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-800">
      <div
        className="h-full rounded-full bg-emerald-500 transition-all"
        style={{
          width: `${value}%`,
        }}
      />
    </div>
  );
}