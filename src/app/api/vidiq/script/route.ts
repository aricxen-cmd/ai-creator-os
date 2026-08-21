import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  getVidIQSession,
} from "@/lib/vidiq/session";

import {
  createVidIQOAuthConnection,
} from "@/lib/vidiq/oauth";

export const runtime = "nodejs";

type VidIQScriptRequest = {
  topic?: string;
  title?: string;
  concept?: string;
  research?: string;
  length?: string;
  tone?: string;
};

function lengthToMinutes(
  length?: string
) {
  switch (length) {
    case "15 Seconds":
    case "30 Seconds":
    case "60 Seconds":
      return 1;

    case "5 Minutes":
      return 5;

    case "10 Minutes":
      return 10;

    case "15 Minutes":
      return 15;

    case "20 Minutes":
      return 20;

    case "30 Minutes":
      return 30;

    default:
      return 10;
  }
}

function findJobId(
  value: unknown
): string | null {
  if (!value) {
    return null;
  }

  if (typeof value === "object") {
    const object =
      value as Record<string, unknown>;

    if (
      typeof object.mcpJobId ===
      "string"
    ) {
      return object.mcpJobId;
    }

    for (
      const child
      of Object.values(object)
    ) {
      const result =
        findJobId(child);

      if (result) {
        return result;
      }
    }
  }

  if (Array.isArray(value)) {
    for (const child of value) {
      const result =
        findJobId(child);

      if (result) {
        return result;
      }
    }
  }

  return null;
}

export async function POST(
  req: NextRequest
) {
  let client:
    | Awaited<
        ReturnType<
          typeof createVidIQOAuthConnection
        >
      >["client"]
    | undefined;

  try {
    const session =
      getVidIQSession();

    if (
      !session?.tokens?.access_token
    ) {
      return NextResponse.json(
        {
          success: false,
          needsAuth: true,
          error:
            "Connect vidIQ first.",
        },
        {
          status: 401,
        }
      );
    }

    const body:
      VidIQScriptRequest =
      await req.json();

    if (!body.topic?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Video topic is required.",
        },
        {
          status: 400,
        }
      );
    }

    const callbackUrl =
      `${req.nextUrl.origin}/api/vidiq/callback`;

    const connection =
      createVidIQOAuthConnection(
        session,
        callbackUrl
      );

    client = connection.client;

    await client.connect(
      connection.transport
    );

    const result =
      await client.callTool({
        name: "vidiq_generate_script",

        arguments: {
          topic: body.topic.trim(),

          title:
            body.title?.trim() ||
            body.topic.trim(),

          concept:
            body.concept?.trim() ||
            `Create an engaging YouTube video about ${body.topic}.`,

          research:
            body.research?.trim() ||
            `Create an accurate and compelling script about ${body.topic}.`,

          lengthMinutes:
            lengthToMinutes(
              body.length
            ),

          tone:
            body.tone?.trim() ||
            "engaging",
        },
      });

    const mcpJobId =
      findJobId(result);

    if (!mcpJobId) {
      console.error(
        "Unexpected vidIQ response:",
        result
      );

      throw new Error(
        "vidIQ did not return a job ID."
      );
    }

    return NextResponse.json({
      success: true,
      status: "started",
      mcpJobId,
    });
  } catch (error) {
    console.error(
      "vidIQ script start error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Unable to start vidIQ script.",
      },
      {
        status: 500,
      }
    );
  } finally {
    try {
      await client?.close();
    } catch {}
  }
}