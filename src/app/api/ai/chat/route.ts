import { NextRequest, NextResponse } from "next/server";
import { chatWithOpenAI } from "@/features/ai/providers/openai";

export async function POST(req: NextRequest) {
  try {
    const {
      prompt,
      provider = "OpenAI",
      model = "gpt-5.5",
    } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        {
          success: false,
          error: "Prompt is required.",
        },
        { status: 400 }
      );
    }

    let response = "";

    switch (provider) {
      case "OpenAI":
        response = await chatWithOpenAI(prompt, model);
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            error: `Provider "${provider}" is not supported yet.`,
          },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      response,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown server error",
      },
      { status: 500 }
    );
  }
}