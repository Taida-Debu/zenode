'use client';

import { AppImage } from './app-image';
import { resolveAvatarUrl, type DicebearStyle } from '../lib/avatars';

type UserAvatarProps = {
  src?: string | null;
  seed: string;
  name?: string;
  size?: number;
  className?: string;
  style?: DicebearStyle;
};

export function UserAvatar({
  src,
  seed,
  name = 'User',
  size = 40,
  className = '',
  style = 'avataaars',
}: UserAvatarProps) {
  const url = resolveAvatarUrl(src, seed, style);

  return (
    <AppImage
      src={url}
      alt={name}
      width={size}
      height={size}
      className={`rounded-full object-cover bg-green-500/10 ${className}`}
    />
  );
}
