interface Props {
  category: string;
}

export default function CategoryBadge({
  category,
}: Props) {
  return (
    <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-white">
      {category}
    </span>
  );
}