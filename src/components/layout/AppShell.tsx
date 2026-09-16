import Sidebar from "./Sidebar";
import Header from "./Header";
import { GlobalVideoStatusBar } from "@/features/jobs";

interface Props {
  children: React.ReactNode;
}

export default function AppShell({ children }: Props) {
  return (
    <div className="flex h-screen bg-zinc-950 text-white">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />
        <GlobalVideoStatusBar />

        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
