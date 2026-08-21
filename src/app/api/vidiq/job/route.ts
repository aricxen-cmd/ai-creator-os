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

function findValue(
  value: unknown,
  key: string
): unknown {
  if (!value) {
    return undefined;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const found =
        findValue(item, key);

      if (
        found !== undefined
      ) {
        return found;
      }
    }

    return undefined;
  }

  if (
    typeof value === "object"
  ) {
    const object =
      value as Record<
        string,
        unknown
      >;

    if (key in object) {
      return object[key];
    }

    for (
      const child
      of Object.values(object)
    ) {
      const found =
        findValue(
          child,
          key
        );

      if (
        found !== undefined
      ) {
        return found;
      }
    }
  }

  return undefined;
}

function extractText(
  value: unknown
): string | null {
  if (
    typeof value === "string"
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const text =
        extractText(item);

      if (text) {
        return text;
      }
    }
  }

  if (
    value &&
    typeof value === "object"
  ) {
    const object =
      value as Record<
        string,
        unknown
      >;

    for (const key of [
      "script",
      "text",
      "content",
      "output",
      "result",
    ]) {
      if (key in object) {
        const text =
          extractText(
            object[key]
          );

        if (text) {
          return text;
        }
      }
    }

    for (
      const child
      of Object.values(object)
    ) {
      const text =
        extractText(child);

      if (text) {
        return text;
      }
    }
  }

  return null;
}

export async function GET(
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
    const mcpJobId =
      req.nextUrl.searchParams.get(
        "mcpJobId"
      );

    if (!mcpJobId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "mcpJobId is required.",
        },
        {
          status: 400,
        }
      );
    }

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
            "vidIQ is not connected.",
        },
        {
          status: 401,
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
        name: "vidiq_job_poll",

        arguments: {
          mcpJobId,
        },
      });

    const status =
      findValue(
        result,
        "status"
      );

    const normalizedStatus =
      typeof status === "string"
        ? status.toLowerCase()
        : "unknown";

    if (
      normalizedStatus ===
      "inprogress"
    ) {
      return NextResponse.json({
        success: true,
        status: "inprogress",
      });
    }

    if (
      normalizedStatus ===
        "failed" ||
      normalizedStatus ===
        "expired" ||
      normalizedStatus ===
        "refunded"
    ) {
      const error =
        findValue(
          result,
          "error"
        );

      return NextResponse.json(
        {
          success: false,
          status:
            normalizedStatus,

          error:
            typeof error ===
            "string"
              ? error
              : "vidIQ script generation failed.",
        },
        {
          status: 500,
        }
      );
    }

    if (
      normalizedStatus ===
      "completed"
    ) {
      const rawResult =
        findValue(
          result,
          "result"
        ) ?? result;

      const script =
        extractText(
          rawResult
        );

      if (!script) {
        console.error(
          "Unable to parse vidIQ script:",
          result
        );

        throw new Error(
          "vidIQ finished, but the script could not be read."
        );
      }

      return NextResponse.json({
        success: true,
        status: "completed",
        response: script,
      });
    }

    return NextResponse.json({
      success: true,
      status:
        normalizedStatus,
    });
  } catch (error) {
    console.error(
      "vidIQ job polling error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Unable to check vidIQ job.",
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