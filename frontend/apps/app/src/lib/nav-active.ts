/** Match app routes for sidebar active / open states. */
export function isExactPath(pathname: string, url: string) {
  return pathname === url;
}

export function isNestedUnder(pathname: string, baseUrl: string) {
  if (baseUrl === '/') return pathname === '/';
  return pathname === baseUrl || pathname.startsWith(`${baseUrl}/`);
}

export function isNavGroupOpen(pathname: string, groupUrl: string, childUrls: string[]) {
  if (isExactPath(pathname, groupUrl)) return true;
  return childUrls.some((url) => isExactPath(pathname, url) || isNestedUnder(pathname, url));
}
