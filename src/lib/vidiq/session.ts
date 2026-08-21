import type {
  OAuthDiscoveryState,
  StoredOAuthClientInformation,
  StoredOAuthTokens,
} from "@modelcontextprotocol/client";

export type VidIQOAuthSession = {
  state: string;
  returnTo: string;
  authorizationUrl?: string;
  codeVerifier?: string;
  clientInformation?: StoredOAuthClientInformation;
  tokens?: StoredOAuthTokens;
  discoveryState?: OAuthDiscoveryState;
};

declare global {
  var vidiqOAuthSession: VidIQOAuthSession | undefined;
}

export function createVidIQSession(
  returnTo: string
): VidIQOAuthSession {
  const session: VidIQOAuthSession = {
    state: crypto.randomUUID(),
    returnTo,
  };

  globalThis.vidiqOAuthSession = session;

  return session;
}

export function getVidIQSession() {
  return globalThis.vidiqOAuthSession;
}

export function clearVidIQSession() {
  globalThis.vidiqOAuthSession = undefined;
}