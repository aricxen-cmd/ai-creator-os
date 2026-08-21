import { NextResponse } from "next/server";
import { updateProjectResearch } from "@/lib/supabase/projects";

export async function POST(req: Request) {
  try {
    const { id, research } = await req.json();

    if (!id || !research) {
      return NextResponse.json(
        { error: "Project ID and research are required" },
        { status: 400 }
      );
    }

    const project = await updateProjectResearch(id, research);

    return NextResponse.json(project);
  } catch (error) {
    console.error("Research save error:", error);

    return NextResponse.json(
      { error: "Failed to save research" },
      { status: 500 }
    );
  }
}