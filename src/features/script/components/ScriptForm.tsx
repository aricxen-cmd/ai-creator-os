"use client";

import {
  useEffect,
  useState,
} from "react";
import ScriptOptions from "./ScriptOptions";
import GenerateButton from "./GenerateButton";
import OutlineBuilder from "./OutlineBuilder";

type FormState = {
  topic: string;
  title: string;
  concept: string;
  research: string;
  platform: string;
  length: string;
  style: string;
  audience: string;
  provider: string;
  model: string;
};

interface ScriptFormProps {
  projectId: string;
}

export default function ScriptForm({
  projectId,
}: ScriptFormProps) {
  const [form, setForm] = useState<FormState>({
    topic: "",
    title: "",
    concept: "",
    research: "",
    platform: "YouTube Shorts",
    length: "30 Seconds",
    style: "Educational",
    audience: "General",
    provider: "OpenAI",
    model: "GPT-5.5",
  });
const [outline, setOutline] =
  useState("");

const [
  outlineLoading,
  setOutlineLoading,
] = useState(false);
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState("");
  const [error, setError] = useState("");
  const [
  vidiqConnected,
  setVidiqConnected,
] = useState(false);

const [
  connectingVidiq,
  setConnectingVidiq,
] = useState(false);

useEffect(() => {
  async function checkVidIQ() {
    try {
      const response =
        await fetch(
          "/api/vidiq/status"
        );

      const data =
        await response.json();

      setVidiqConnected(
        Boolean(data.connected)
      );
    } catch {
      setVidiqConnected(false);
    }
  }

  checkVidIQ();
}, []);

async function connectVidIQ() {
  setConnectingVidiq(true);
  setError("");

  try {
    const response =
      await fetch(
        `/api/vidiq/connect?projectId=${projectId}`
      );

    const data =
      await response.json();

    if (!data.success) {
      throw new Error(
        data.error ||
          "Unable to connect vidIQ."
      );
    }

    if (data.connected) {
      setVidiqConnected(true);
      return;
    }

    if (
      data.authorizationUrl
    ) {
      window.location.href =
        data.authorizationUrl;

      return;
    }

    throw new Error(
      "vidIQ authorization URL was not returned."
    );
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Unable to connect vidIQ."
    );
  } finally {
    setConnectingVidiq(false);
  }
}

  function updateField(field: string, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }
async function generateOutline() {
  if (!form.topic.trim()) {
    setError(
      "Enter a video topic before generating an outline."
    );
    return;
  }

  setOutlineLoading(true);
  setError("");

  try {
    const prompt = `
You are a professional YouTube video outliner.

Create a detailed, retention-focused video outline.

VIDEO DETAILS

Topic:
${form.topic}

Title:
${form.title || form.topic}

Platform:
${form.platform}

Target Length:
${form.length}

Style:
${form.style}

Audience:
${form.audience}

Concept / Angle:
${
  form.concept ||
  "Find the strongest and most interesting angle."
}

Research / Context:
${
  form.research ||
  "No additional research supplied."
}

Create the outline in this exact general structure:

VIDEO OUTLINE

1. COLD OPEN / HOOK
- Immediate attention grabber
- Curiosity gap
- What question is being promised?

2. SETUP
- Introduce the topic
- Explain why the viewer should care
- Establish stakes

3. MAIN SECTION 1
- Main talking point
- Important evidence/facts
- Visual opportunities

4. MAIN SECTION 2
- Next escalation or discovery
- Supporting facts/examples
- Retention beat

5. MAIN SECTION 3
- Strongest or most surprising information
- Payoff setup

6. CLIMAX / PAYOFF
- Answer the main question
- Deliver the biggest insight

7. ENDING
- Final takeaway
- Memorable closing thought

8. CALL TO ACTION
- Natural YouTube CTA

Also include:

RETENTION BEATS
- Where curiosity loops should appear
- Where pattern interrupts should happen
- Where a surprising fact or reveal should occur

VISUAL NOTES
- Suggested visuals/B-roll/animation for each major section

Do NOT write the full script.
Create only the detailed outline.
`;

    const response =
      await fetch(
        "/api/ai/chat",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            prompt,
            provider: "OpenAI",
            model: "GPT-5.5",
          }),
        }
      );

    const data =
      await response.json();

    if (!data.success) {
      throw new Error(
        data.error ||
          "Outline generation failed."
      );
    }

    setOutline(data.response);
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Unable to generate outline."
    );
  } finally {
    setOutlineLoading(false);
  }
}
  async function generateScript() {
  if (!form.topic.trim()) {
    setError(
      "Please enter a video topic."
    );
    return;
  }

  setLoading(true);
  setError("");
  setScript("");

  try {
    // ==========================
    // vidIQ SCRIPT ENGINE
    // ==========================

    if (
      form.provider === "vidIQ"
    ) {
      if (!vidiqConnected) {
        setError(
          "Connect your vidIQ account first."
        );
        return;
      }

      const startResponse =
        await fetch(
          "/api/vidiq/script",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              topic:
                form.topic,

              title:
                form.title ||
                form.topic,

              concept: `
${form.concept ||
`${form.style} ${form.platform} video for ${form.audience}`}

The script should follow the supplied approved video outline.
`,

              research: `
RESEARCH / SOURCE CONTEXT:

${
  form.research ||
  `Create an accurate video about ${form.topic}.`
}

APPROVED VIDEO OUTLINE:

${
  outline ||
  "No outline was generated. Build the strongest structure automatically."
}

IMPORTANT:
Follow the approved outline structure while writing the finished script.
Keep strong transitions between sections.
Preserve the hook, retention beats, payoff, and ending.
`,

              length:
                form.length,

              tone:
                form.style,
            }),
          }
        );

      const startData =
        await startResponse.json();

      if (
        startData.needsAuth
      ) {
        setVidiqConnected(false);

        throw new Error(
          "Your vidIQ connection expired. Connect vidIQ again."
        );
      }

      if (!startData.success) {
        throw new Error(
          startData.error ||
            "Unable to start vidIQ script."
        );
      }

      const mcpJobId =
        startData.mcpJobId;

      if (!mcpJobId) {
        throw new Error(
          "vidIQ did not return a job ID."
        );
      }

      // Poll vidIQ until finished.

      const maxAttempts = 90;

      for (
        let attempt = 0;
        attempt < maxAttempts;
        attempt++
      ) {
        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              2000
            )
        );

        const jobResponse =
          await fetch(
            `/api/vidiq/job?mcpJobId=${encodeURIComponent(
              mcpJobId
            )}`
          );

        const jobData =
          await jobResponse.json();

        if (
          jobData.needsAuth
        ) {
          setVidiqConnected(
            false
          );

          throw new Error(
            "Your vidIQ session expired. Connect vidIQ again."
          );
        }

        if (
          !jobData.success
        ) {
          throw new Error(
            jobData.error ||
              "vidIQ script generation failed."
          );
        }

        if (
          jobData.status ===
          "completed"
        ) {
          setScript(
            jobData.response
          );

          return;
        }

        if (
          jobData.status ===
            "failed" ||
          jobData.status ===
            "expired" ||
          jobData.status ===
            "refunded"
        ) {
          throw new Error(
            jobData.error ||
              "vidIQ could not generate the script."
          );
        }
      }

      throw new Error(
        "vidIQ is still generating the script. Please try again."
      );
    }

    // ==========================
    // NORMAL AI PROVIDERS
    // ==========================

    const prompt = `
Create a ${form.length} script.

Platform:
${form.platform}

Style:
${form.style}

Audience:
${form.audience}

Topic:
${form.topic}

Title:
${form.title || form.topic}

Concept:
${
  form.concept ||
  "Create the strongest angle for this topic."
}

Research:
${
  form.research ||
  "No additional research supplied."
}
`;

    const response =
      await fetch(
        "/api/ai/chat",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            prompt,
            provider:
              form.provider,
            model:
              form.model,
          }),
        }
      );

    const data =
      await response.json();

    if (!data.success) {
      throw new Error(
        data.error ||
          "Script generation failed."
      );
    }

    setScript(
      data.response
    );
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Something went wrong."
    );
  } finally {
    setLoading(false);
  }
}
<OutlineBuilder
  outline={outline}
  loading={outlineLoading}
  onGenerate={generateOutline}
  onChange={setOutline}
/>
  return (
    <div className="space-y-6 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <div>
        <h2 className="text-2xl font-bold">
          Create a New Script
        </h2>

        <p className="mt-1 text-sm text-zinc-400">
          Choose OpenAI or vidIQ as your script engine.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Video Topic
        </label>

        <input
          type="text"
          value={form.topic}
          onChange={(e) =>
            updateField("topic", e.target.value)
          }
          placeholder="Example: Ronaldo vs Kangaroo"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-emerald-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Video Title
        </label>

        <input
          type="text"
          value={form.title}
          onChange={(e) =>
            updateField("title", e.target.value)
          }
          placeholder="Example: Could Ronaldo Outjump a Kangaroo?"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-emerald-500"
        />
      </div>

      <ScriptOptions
        platform={form.platform}
        length={form.length}
        style={form.style}
        audience={form.audience}
        provider={form.provider}
        model={form.model}
        onChange={updateField}
      />

      {form.provider === "vidIQ" && (
  <div className="rounded-xl border border-purple-700/50 bg-purple-950/30 p-5">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

      <div>
        <div className="font-semibold text-purple-300">
          vidIQ Script Writer
        </div>

        <p className="mt-1 text-sm text-zinc-400">
          Generate YouTube scripts using
          your connected vidIQ account.
        </p>

        <div className="mt-2 text-sm">
          {vidiqConnected ? (
            <span className="text-emerald-400">
              ● vidIQ Connected
            </span>
          ) : (
            <span className="text-yellow-400">
              ● vidIQ Not Connected
            </span>
          )}
        </div>
      </div>

      {!vidiqConnected && (
        <button
          type="button"
          onClick={connectVidIQ}
          disabled={connectingVidiq}
          className="rounded-lg bg-purple-600 px-5 py-3 font-medium text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {connectingVidiq
            ? "Connecting..."
            : "Connect vidIQ"}
        </button>
      )}

    </div>
  </div>
)}

      <div>
        <label className="mb-2 block text-sm font-medium">
          Concept / Angle
        </label>

        <textarea
          value={form.concept}
          onChange={(e) =>
            updateField("concept", e.target.value)
          }
          placeholder="Example: Compare Ronaldo's famous vertical leap with the jumping ability of a red kangaroo."
          rows={4}
          className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-emerald-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Research / Context
        </label>

        <textarea
          value={form.research}
          onChange={(e) =>
            updateField("research", e.target.value)
          }
          placeholder="Paste research, facts, statistics, sources or talking points here..."
          rows={6}
          className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-emerald-500"
        />
      </div>

      <GenerateButton
        loading={loading}
        onClick={generateScript}
      />

      {error && (
        <div className="rounded-lg border border-red-600 bg-red-950 p-4 text-red-300">
          {error}
        </div>
      )}

      {script && (
        <div className="rounded-lg border border-zinc-700 bg-zinc-950 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold">
              Generated Script
            </h3>

            <span className="rounded-md bg-zinc-800 px-3 py-1 text-xs text-zinc-400">
              {form.provider}
            </span>
          </div>

          <pre className="whitespace-pre-wrap font-sans text-zinc-300">
            {script}
          </pre>
        </div>
      )}
    </div>
  );
}