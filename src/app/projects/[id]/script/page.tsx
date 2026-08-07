import AppShell from "@/components/layout/AppShell";
import ScriptForm from "@/features/script/components/ScriptForm";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ScriptPage({
  params,
}: Props) {
  const { id } = await params;

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl space-y-8">

        <div>
          <h1 className="text-4xl font-bold">
            ✍️ AI Script Studio
          </h1>

          <p className="mt-2 text-zinc-400">
            Create viral scripts for YouTube, TikTok, Instagram and Shorts.
          </p>
        </div>

        <div>
          <ScriptForm />
        </div>

      </div>
    </AppShell>
  );
}