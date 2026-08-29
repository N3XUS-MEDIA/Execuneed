import Redis from 'ioredis'

/**
 * Shared Redis connection.
 *
 * Cached on globalThis for the same reason Prisma is: Next reloads modules on
 * every edit in development, and each reload would otherwise open another
 * connection.
 *
 * Returns null when REDIS_URL is unset — local development and CI run without
 * it, and every caller must cope with its absence rather than assume it.
 */
const globalForRedis = globalThis as unknown as { redis?: Redis | null }

export function getRedis(): Redis | null {
  if (globalForRedis.redis !== undefined) return globalForRedis.redis

  const url = process.env.REDIS_URL
  if (!url) {
    globalForRedis.redis = null
    return null
  }

  const client = new Redis(url, {
    // Serverless invocations are short. Fail fast and fall back rather than
    // holding a request open while a dead connection retries.
    maxRetriesPerRequest: 1,
    connectTimeout: 5_000,
    commandTimeout: 3_000,
    lazyConnect: false,
    // Must stay true. On a cold start the first command is issued before the
    // socket finishes connecting; with the offline queue off it fails
    // instantly with "Stream isn't writeable", the limiter silently falls back
    // to its in-memory path, and the protection Redis exists to provide is
    // absent on exactly the requests that matter. maxRetriesPerRequest and
    // commandTimeout bound how long anything can sit in that queue.
    enableOfflineQueue: true,
  })

  // Without a handler an unreachable Redis crashes the process.
  client.on('error', () => {})

  globalForRedis.redis = client
  return client
}
