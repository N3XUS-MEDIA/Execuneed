import { PrismaClient } from '@prisma/client'

/**
 * P0-L-003 — single Prisma client.
 *
 * Next dev reloads modules on every edit, so cache the client on globalThis or
 * the connection pool exhausts within a few saves.
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

export * from '@prisma/client'
