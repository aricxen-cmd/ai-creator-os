import {
  Client,
  StreamableHTTPClientTransport,
  type AuthProvider,
} from "@modelcontextprotocol/client";

export const VIDIQ_MCP_URL = "https://mcp.vidiq.com/mcp";

export interface VidIQConnection {
  client: Client;
  transport: StreamableHTTPClientTransport;
}

/**
 * Creates an authenticated connection to vidIQ MCP.
 *
 * For now the access token will be supplied by our OAuth layer.
 * We are NOT putting a vidIQ token in NEXT_PUBLIC_* or the browser.
 */
export async function createVidIQClient(
  accessToken: string
): Promise<VidIQConnection> {
  if (!accessToken) {
    throw new Error("VIDIQ_AUTH_REQUIRED");
  }

  const authProvider: AuthProvider = {
    async token() {
      return accessToken;
    },
  };

  const client = new Client({
    name: "ai-creator-os",
    version: "1.0.0",
  });

  const transport = new StreamableHTTPClientTransport(
    new URL(VIDIQ_MCP_URL),
    {
      authProvider,
    }
  );

  await client.connect(transport);

  return {
    client,
    transport,
  };
}

export async function listVidIQTools(accessToken: string) {
  const { client } = await createVidIQClient(accessToken);

  try {
    return await client.listTools();
  } finally {
    await client.close();
  }
}