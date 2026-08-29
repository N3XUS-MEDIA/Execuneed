import Image from 'next/image'

/**
 * The wordmark. White on navy, so it must sit on a navy ground.
 *
 * `priority` because it is above the fold on every page and is part of the
 * LCP element on most of them.
 */
export function Wordmark({
  className,
  width = 220,
}: {
  className?: string
  width?: number
}) {
  return (
    <Image
      src="/brand/logo.png"
      alt="Execuneed"
      width={width}
      height={Math.round((width * 420) / 1960)}
      priority
      // width/height are the intrinsic ratio; CSS drives the rendered size, so
      // both axes must be auto or Next warns the ratio is being distorted.
      style={{ width: '100%', height: 'auto' }}
      className={className}
    />
  )
}
