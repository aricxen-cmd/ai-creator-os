import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  Client,
  StreamableHTTPClientTransport,
} from "@modelcontextprotocol/client";

import {
  VIDIQ_MCP_URL,
  VidIQOAuthProvider,
} from "@/lib/vidiq/oauth";

import {
  getVidIQSession,
} from "@/lib/vidiq/session";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest
) {
  try {
    const session =
      getVidIQSession();

    if (!session) {
      return NextResponse.redirect(
        new URL(
          "/projects?vidiq=missing-session",
          req.url
        )
      );
    }

    const returnedState =
      req.nextUrl.searchParams.get(
        "state"
      );

    if (
      !returnedState ||
      returnedState !==
        session.state
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid vidIQ OAuth state.",
        },
        {
          status: 400,
        }
      );
    }

    const callbackUrl =
      `${req.nextUrl.origin}/api/vidiq/callback`;

    const provider =
      new VidIQOAuthProvider(
        session,
        callbackUrl
      );

    /*
     * First transport:
     * exchange OAuth authorization
     * code for tokens.
     */

    const authTransport =
      new StreamableHTTPClientTransport(
        new URL(VIDIQ_MCP_URL),
        {
          authProvider: provider,
        }
      );

    await authTransport.finishAuth(
      req.nextUrl.searchParams
    );

    /*
     * MCP requires a fresh transport
     * after completing OAuth.
     */

    const transport =
      new StreamableHTTPClientTransport(
        new URL(VIDIQ_MCP_URL),
        {
          authProvider: provider,
        }
      );

    const client =
      new Client({
        name: "ai-creator-os",
        version: "1.0.0",
      });

    await client.connect(
      transport
    );

    await client.close();

    const redirectUrl =
      new URL(
        session.returnTo,
        req.nextUrl.origin
      );

    redirectUrl.searchParams.set(
      "vidiq",
      "connected"
    );

    return NextResponse.redirect(
      redirectUrl
    );
  } catch (error) {
    console.error(
      "vidIQ OAuth callback error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "vidIQ authorization failed.",
      },
      {
        status: 500,
      }
    );
  }
}