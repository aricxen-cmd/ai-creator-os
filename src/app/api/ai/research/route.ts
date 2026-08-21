import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    const response = await openai.responses.create({
      model: "gpt-5.5",
      input: `
You are the research agent for an AI YouTube Shorts production system.

Research this video topic:

${topic}

Return a concise production-ready research brief containing:

1. The most interesting facts
2. Important statistics or comparisons
3. A strong viral angle
4. Three possible hooks
5. A surprising final reveal

The information should be useful for creating a 30-second YouTube Short.
Keep the response concise and easy for another AI agent to turn into a script.
      `,
    });

    return NextResponse.json({
      research: response.output_text,
    });
  } catch (error) {
    console.error("Research API error:", error);

    return NextResponse.json(
      { error: "Research generation failed" },
      { status: 500 }
    );
  }
}