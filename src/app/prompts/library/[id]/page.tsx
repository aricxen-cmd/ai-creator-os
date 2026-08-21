import AppShell from "@/components/layout/AppShell";
import PromptDetailEditor from "@/features/prompts/components/PromptDetailEditor";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function PromptDetailPage({
  params,
}: Props) {
  const { id } = await params;

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl space-y-8">
        <PromptDetailEditor
          promptId={id}
        />
      </div>
    </AppShell>
  );
}