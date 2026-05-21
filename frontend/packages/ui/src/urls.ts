/** Cross-app URLs for the Zenode monorepo (override via env in each app). */
export const urls = {
  landing: process.env.NEXT_PUBLIC_LANDING_URL ?? 'http://localhost:3000',
  app: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001',
  docs: process.env.NEXT_PUBLIC_DOCS_URL ?? 'http://localhost:3002',
};

export function appPath(path: string) {
  const base = urls.app.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export function docsPath(path: string) {
  const base = urls.docs.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export function landingPath(path: string) {
  const base = urls.landing.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
