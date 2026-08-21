import {
  NextResponse,
} from "next/server";

import {
  getVidIQSession,
} from "@/lib/vidiq/session";

export const runtime = "nodejs";

export async function GET() {
  const session =
    getVidIQSession();

  return NextResponse.json({
    success: true,

    connected: Boolean(
      session?.tokens?.access_token
    ),
  });
}