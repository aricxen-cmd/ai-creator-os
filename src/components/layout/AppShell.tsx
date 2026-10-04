import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface Props {
  children: ReactNode;
}

export default function AppShell({ children }: Props) {
  return (
    <div className="flex h-dvh overflow-hidden bg-zinc-950 text-white">
      <div className="shrink-0 overflow-y-auto">
        <Sidebar />
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Header />

        <main className="min-h-0 min-w-0 flex-1 overflow-auto p-4 md:p-6 xl:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}