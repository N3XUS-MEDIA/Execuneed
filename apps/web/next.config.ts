import path from 'node:path'
import type { NextConfig } from 'next'
import { securityHeaders } from './src/server/securityHeaders'

const dev = process.env.NODE_ENV !== 'production'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@execuneed/ui'],
  // Several lockfiles exist above this directory on some machines; pin the
  // trace root to the monorepo so Next does not guess.
  outputFileTracingRoot: path.join(import.meta.dirname, '../..'),
  poweredByHeader: false,
  /**
   * Prisma must not be bundled.
   *
   * Bundled, its chunk lands under apps/web and it then resolves the query
   * engine relative to that — searching /var/task/apps/web/generated/client and
   * missing the binary entirely, so every database call 500s in production
   * while local is perfectly healthy. Left external, it is required from
   * node_modules at runtime and resolves relative to its own real location.
   */
  serverExternalPackages: ['@prisma/client'],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders({ dev }).map(([key, value]) => ({ key, value })),
      },
    ]
  },
}

export default nextConfig
