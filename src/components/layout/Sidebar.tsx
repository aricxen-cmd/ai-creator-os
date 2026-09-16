import Navigation from "./Navigation";

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 overflow-y-auto border-r border-zinc-800 bg-zinc-950 p-6 lg:block">
      <h1 className="mb-8 text-2xl font-bold text-white">
        AI Creator OS
      </h1>
      <Navigation />
    </aside>
  );
}
