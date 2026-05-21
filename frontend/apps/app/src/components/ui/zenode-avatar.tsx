'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { dicebearAvatar, resolveAvatarUrl, type DicebearStyle } from '@zenode/ui/avatars';

type ZenodeAvatarProps = {
  src?: string | null;
  seed: string;
  name?: string;
  className?: string;
  style?: DicebearStyle;
};

/** Radix avatar with DiceBear fallback (no initials). */
export function ZenodeAvatar({
  src,
  seed,
  name = 'User',
  className,
  style = 'avataaars',
}: ZenodeAvatarProps) {
  const primary = resolveAvatarUrl(src, seed, style);
  const backup = dicebearAvatar(seed, style);

  return (
    <Avatar className={className}>
      <AvatarImage src={primary} alt={name} />
      <AvatarFallback className="rounded-lg p-0 overflow-hidden bg-transparent">
        <img src={backup} alt={name} className="h-full w-full object-cover" />
      </AvatarFallback>
    </Avatar>
  );
}
