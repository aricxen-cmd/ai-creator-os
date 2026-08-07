import AppShell from "@/components/layout/AppShell";
import ResearchForm from "@/features/research/components/ResearchForm";

export default function ResearchPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-5xl">
        <ResearchForm />
      </div>
    </AppShell>
  );
}