/** Cross-app URLs for the Zenode monorepo (override via env in each app). */
const isDev = process.env.NODE_ENV === 'development';

export const urls = {
  landing: process.env.NEXT_PUBLIC_LANDING_URL ?? (isDev ? 'http://localhost:3000' : 'https://zenode.vercel.app'),
  app: process.env.NEXT_PUBLIC_APP_URL ?? (isDev ? 'http://localhost:3001' : 'https://zenode-app.vercel.app'),
  docs:
    process.env.NEXT_PUBLIC_DOCS_URL ??
    (isDev ? 'http://localhost:3002' : 'https://zenode-docs.vercel.app'),
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
