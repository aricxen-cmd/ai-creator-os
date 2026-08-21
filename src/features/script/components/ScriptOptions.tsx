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
];

const styles = [
  "Educational",
  "Storytelling",
  "Documentary",
  "Funny",
  "Motivational",
];

const audiences = [
  "General",
  "Kids",
  "Teens",
  "Adults",
];

const providerModels: Record<string, string[]> = {
  OpenAI: ["gpt-5.5"],
  Ollama: ["qwen3:4b"],
};

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
    providerModels[provider] ?? providerModels.Ollama;

  function handleProviderChange(value: string) {
    const nextModels =
      providerModels[value] ?? providerModels.Ollama;

    onChange("provider", value);
    onChange("model", nextModels[0]);
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <SelectField
        label="Platform"
        value={platform}
        options={platforms}
        onChange={(value) =>
          onChange("platform", value)
        }
      />

      <SelectField
        label="Length"
        value={length}
        options={lengths}
        onChange={(value) =>
          onChange("length", value)
        }
      />

      <SelectField
        label="Style"
        value={style}
        options={styles}
        onChange={(value) =>
          onChange("style", value)
        }
      />

      <SelectField
        label="Audience"
        value={audience}
        options={audiences}
        onChange={(value) =>
          onChange("audience", value)
        }
      />

      <SelectField
        label="AI Provider"
        value={provider}
        options={Object.keys(providerModels)}
        onChange={handleProviderChange}
      />

      <SelectField
        label="AI Model"
        value={model}
        options={models}
        onChange={(value) =>
          onChange("model", value)
        }
      />
    </div>
  );
}