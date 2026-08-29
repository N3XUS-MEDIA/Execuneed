import { PrismaClient } from '@prisma/client'

/**
 * The Prisma client for this app.
 *
 * Imported from `@prisma/client` directly, and NOT re-exported through
 * `@execuneed/db`, for one specific reason: `serverExternalPackages` in
 * next.config only externalises packages the app imports itself. Reached
 * transitively through a compiled workspace package, Prisma gets inlined into
 * a server chunk — and a bundled Prisma resolves its query engine relative to
 * that chunk, under apps/web, where the engine is not. Every database call
 * then fails in production with "could not locate the Query Engine" while
 * local development is perfectly healthy.
 *
 * Cached on globalThis because Next reloads modules on every edit in
 * development and each reload would otherwise open another connection.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
