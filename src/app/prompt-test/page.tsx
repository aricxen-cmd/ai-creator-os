import {
  getModels,
  getPromptCategories,
  getPromptTemplates,
  getStylePresets,
} from "@/features/prompts";

interface PromptTemplate {
  id: string;
  name: string;
  category?: string | null;
  default_model?: string | null;
  aspect_ratio?: string | null;
  requires_reference_image?: boolean;
}

interface StatCardProps {
  value: number;
  label: string;
}

interface BadgeProps {
  children: React.ReactNode;
}

export default function PromptTestPage() {
  const templates = getPromptTemplates();
  const styles = getStylePresets();
  const models = getModels();
  const categories = getPromptCategories();

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">
            Prompt Engine v2
          </h1>

          <p className="text-zinc-400 mt-2">
            AI Creator OS prompt database test
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            value={templates.length}
            label="Prompt Templates"
          />

          <StatCard
            value={styles.length}
            label="Style Presets"
          />

          <StatCard
            value={models.length}
            label="Models"
          />

          <StatCard
            value={categories.length}
            label="Categories"
          />
        </div>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
          <h2 className="text-xl font-semibold mb-5">
            First 10 Templates
          </h2>

          <div className="grid gap-3">
            {templates.slice(0, 10).map((template: PromptTemplate) => (
              <div
                key={template.id}
                className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 hover:border-emerald-500 transition"
              >
                <div className="font-semibold">
                  {template.name}
                </div>

                <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-400">
                  <Badge>
                    {template.category ?? "No category"}
                  </Badge>

                  <Badge>
                    {template.default_model ?? "Any model"}
                  </Badge>

                  <Badge>
                    {template.aspect_ratio ?? "Any ratio"}
                  </Badge>

                  {template.requires_reference_image && (
                    <Badge>
                      Reference Image
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  value,
  label,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="text-3xl font-bold text-emerald-400">
        {value}
      </div>

      <div className="text-sm text-zinc-400 mt-1">
        {label}
      </div>
    </div>
  );
}

function Badge({
  children,
}: BadgeProps) {
  return (
    <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1">
      {children}
    </span>
  );
}