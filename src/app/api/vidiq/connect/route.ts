import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  UnauthorizedError,
} from "@modelcontextprotocol/client";

import {
  createVidIQSession,
} from "@/lib/vidiq/session";

import {
  createVidIQOAuthConnection,
} from "@/lib/vidiq/oauth";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest
) {
  try {
    const projectId =
      req.nextUrl.searchParams.get(
        "projectId"
      );

    if (!projectId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Project ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const callbackUrl =
      `${req.nextUrl.origin}/api/vidiq/callback`;

    const returnTo =
      `/projects/${projectId}/script`;

    const session =
      createVidIQSession(returnTo);

    const {
  client,
  transport,
} =
  createVidIQOAuthConnection(
    session,
    callbackUrl
  );

try {
  await client.connect(
    transport
  );

      return NextResponse.json({
        success: true,
        connected: true,
      });
    } catch (error) {
      if (
        !(
          error instanceof
          UnauthorizedError
        )
      ) {
        throw error;
      }

      const authorizationUrl =
        session.authorizationUrl;

      if (!authorizationUrl) {
        throw new Error(
          "vidIQ did not return an authorization URL."
        );
      }

      return NextResponse.json({
        success: true,
        connected: false,
        authorizationUrl,
      });
    }
  } catch (error) {
    console.error(
      "vidIQ OAuth start error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Unable to connect vidIQ.",
      },
      {
        status: 500,
      }
    );
  }
}