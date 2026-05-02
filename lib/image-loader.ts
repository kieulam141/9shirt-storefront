/**
 * Custom Next.js image loader.
 * Returns the source URL directly so the browser fetches from the CDN
 * without proxying through the Next.js image optimization server.
 * This avoids timeout errors when the CDN is slow, while keeping all
 * the <Image> component benefits (lazy loading, sizes hints, priority, etc.).
 */
export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) {
  const separator = src.includes('?') ? '&' : '?'
  const q = quality ?? 75
  return `${src}${separator}w=${width}&q=${q}`
}
