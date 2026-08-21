import { NextRequest, NextResponse } from "next/server";
import { runAIJob } from "@/features/core/engine/aiEngine";
import type {
  AIJobType,
} from "@/features/core/engine/types";
import type {
  AIProvider,
} from "@/features/ai/types/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const prompt =
      typeof body.prompt === "string"
        ? body.prompt.trim()
        : "";

    const provider = (
      typeof body.provider === "string"
        ? body.provider.toLowerCase()
        : "openai"
    ) as AIProvider;

    const model =
      typeof body.model === "string" && body.model.trim()
        ? body.model.trim()
        : "gpt-5.5";

    const type = (
      typeof body.type === "string"
        ? body.type
        : "script"
    ) as AIJobType;

    if (!prompt) {
      return NextResponse.json(
        {
          success: false,
          error: "Prompt is required.",
        },
        { status: 400 }
      );
    }

    const result = await runAIJob({
      type,
      provider,
      model,
      prompt,
    });

    return NextResponse.json({
      success: true,
      response: result.output,
    });
  } catch (error) {
    console.error("AI API Error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown server error.",
      },
      { status: 500 }
    );
  }
}