export type DicebearStyle =
  | 'avataaars'
  | 'identicon'
  | 'bottts'
  | 'pixel-art'
  | 'thumbs'
  | 'notionists';

/** Deterministic avatar from DiceBear (no API key). */
export function dicebearAvatar(
  seed: string,
  style: DicebearStyle = 'avataaars'
): string {
  const safeSeed = encodeURIComponent((seed || 'anonymous').trim().slice(0, 128));
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${safeSeed}`;
}

/** Prefer real profile image; fall back to DiceBear from seed (login, wallet, name). */
export function resolveAvatarUrl(
  primary: string | null | undefined,
  seed: string,
  style: DicebearStyle = 'avataaars'
): string {
  const trimmed = primary?.trim();
  if (trimmed && trimmed.length > 0) return trimmed;
  return dicebearAvatar(seed, style);
}
