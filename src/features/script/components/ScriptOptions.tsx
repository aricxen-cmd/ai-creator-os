interface ScriptOptionsProps {
  platform: string;
  length: string;
  style: string;
  audience: string;
  provider: string;
  model: string;
  onChange: (field: string, value: string) => void;
}

const platforms = [
  "YouTube Shorts",
  "YouTube",
  "TikTok",
  "Instagram Reels",
];

const lengths = [
  "15 Seconds",
  "30 Seconds",
  "60 Seconds",
  "5 Minutes",
  "10 Minutes",
  "15 Minutes",
  "20 Minutes",
  "30 Minutes",
];

const styles = [
  "Educational",
  "Storytelling",
  "Documentary",
  "Funny",
  "Motivational",
  "High Energy",
  "Conversational",
];

const audiences = [
  "General",
  "Kids",
  "Teens",
  "Adults",
];

const providers = [
  "OpenAI",
  "vidIQ",
  "Gemini",
  "Groq",
  "OpenRouter",
];

const normalModels = [
  "GPT-5.5",
  "GPT-5 Mini",
  "Gemini 2.5 Flash",
  "Llama 3.3",
];

interface SelectFieldProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: SelectFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-zinc-300">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-emerald-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function ScriptOptions({
  platform,
  length,
  style,
  audience,
  provider,
  model,
  onChange,
}: ScriptOptionsProps) {
  const models =
    provider === "vidIQ"
      ? ["vidIQ Script Writer"]
      : normalModels;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <SelectField
        label="Platform"
        value={platform}
        options={platforms}
        onChange={(v) => onChange("platform", v)}
      />

      <SelectField
        label="Length"
        value={length}
        options={lengths}
        onChange={(v) => onChange("length", v)}
      />

      <SelectField
        label="Style"
        value={style}
        options={styles}
        onChange={(v) => onChange("style", v)}
      />

      <SelectField
        label="Audience"
        value={audience}
        options={audiences}
        onChange={(v) => onChange("audience", v)}
      />

      <SelectField
        label="Script Engine"
        value={provider}
        options={providers}
        onChange={(v) => {
          onChange("provider", v);

          if (v === "vidIQ") {
            onChange("model", "vidIQ Script Writer");
          }

          if (v === "OpenAI") {
            onChange("model", "GPT-5.5");
          }
        }}
      />

      <SelectField
        label="AI Model"
        value={model}
        options={models}
        onChange={(v) => onChange("model", v)}
      />
    </div>
  );
}