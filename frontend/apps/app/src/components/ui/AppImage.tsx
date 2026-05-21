'use client';

import Image, { type ImageProps } from 'next/image';

type AppImageProps = Omit<ImageProps, 'alt'> & {
  alt: string;
  /** When true, skips optimization (blob/data URLs). */
  unoptimized?: boolean;
};

/**
 * Wrapper around next/image with aspect-ratio-safe defaults when CSS resizes one axis.
 */
export function AppImage({
  className = '',
  style,
  width,
  height,
  unoptimized,
  ...props
}: AppImageProps) {
  const isBlobOrData =
    typeof props.src === 'string' &&
    (props.src.startsWith('blob:') || props.src.startsWith('data:'));

  return (
    <Image
      width={width}
      height={height}
      className={className}
      style={{ height: 'auto', ...style }}
      unoptimized={unoptimized ?? isBlobOrData}
      {...props}
    />
  );
}
