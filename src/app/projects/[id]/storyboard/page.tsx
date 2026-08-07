import AppShell from "@/components/layout/AppShell";
import StoryboardForm from "@/features/storyboard/components/StoryboardForm";

export default function StoryboardPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-6xl">
        <StoryboardForm />
      </div>
    </AppShell>
  );
}