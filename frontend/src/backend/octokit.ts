import { App } from 'octokit';

let cachedApp: App | null | undefined;

function normalizePrivateKey(key: string): string {
  return key.replace(/\\n/g, '\n');
}

/** Returns GitHub App client or null when credentials are not configured. */
export function getGitHubApp(): App | null {
  if (cachedApp !== undefined) {
    return cachedApp;
  }

  const appId =
    process.env.GITHUB_APP_ID ?? process.env.NEXT_PUBLIC_GITHUB_APP_ID;
  const privateKeyRaw =
    process.env.GITHUB_APP_PRIVATE_KEY ?? process.env.NEXT_PUBLIC_GITHUB_TOKEN;

  if (!appId || !privateKeyRaw) {
    cachedApp = null;
    return null;
  }

  cachedApp = new App({
    appId,
    privateKey: normalizePrivateKey(privateKeyRaw),
  });

  return cachedApp;
}
