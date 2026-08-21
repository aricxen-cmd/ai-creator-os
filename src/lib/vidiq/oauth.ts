import {
  Client,
  StreamableHTTPClientTransport,
  type OAuthClientMetadata,
  type OAuthClientProvider,
  type OAuthDiscoveryState,
  type StoredOAuthClientInformation,
  type StoredOAuthTokens,
} from "@modelcontextprotocol/client";

import type { VidIQOAuthSession } from "./session";

export const VIDIQ_MCP_URL =
  "https://mcp.vidiq.com/mcp";

export class VidIQOAuthProvider
  implements OAuthClientProvider
{
  constructor(
    private session: VidIQOAuthSession,
    private callbackUrl: string
  ) {}

  get redirectUrl() {
    return this.callbackUrl;
  }

  get clientMetadata(): OAuthClientMetadata {
    return {
      client_name: "AI Creator OS",

      redirect_uris: [
        this.callbackUrl,
      ],

      response_types: [
        "code",
      ],

      grant_types: [
        "authorization_code",
        "refresh_token",
      ],

      token_endpoint_auth_method: "none",
    };
  }

  state() {
    return this.session.state;
  }

  async clientInformation() {
    return this.session.clientInformation;
  }

  async saveClientInformation(
    clientInformation: StoredOAuthClientInformation
  ) {
    this.session.clientInformation =
      clientInformation;
  }

  async tokens() {
    return this.session.tokens;
  }

  async saveTokens(
    tokens: StoredOAuthTokens
  ) {
    this.session.tokens = tokens;
  }

  async redirectToAuthorization(
    authorizationUrl: URL
  ) {
    this.session.authorizationUrl =
      authorizationUrl.toString();
  }

  async saveCodeVerifier(
    codeVerifier: string
  ) {
    this.session.codeVerifier =
      codeVerifier;
  }

  async codeVerifier() {
    if (!this.session.codeVerifier) {
      throw new Error(
        "vidIQ OAuth code verifier is missing."
      );
    }

    return this.session.codeVerifier;
  }

  async saveDiscoveryState(
    discoveryState: OAuthDiscoveryState
  ) {
    this.session.discoveryState =
      discoveryState;
  }

  async discoveryState() {
    return this.session.discoveryState;
  }
}

export function createVidIQOAuthConnection(
  session: VidIQOAuthSession,
  callbackUrl: string
) {
  const provider =
    new VidIQOAuthProvider(
      session,
      callbackUrl
    );

  const transport =
    new StreamableHTTPClientTransport(
      new URL(VIDIQ_MCP_URL),
      {
        authProvider: provider,
      }
    );

  const client = new Client({
    name: "ai-creator-os",
    version: "1.0.0",
  });

  return {
    client,
    transport,
    provider,
  };
}