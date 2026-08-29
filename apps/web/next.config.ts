import path from 'node:path'
import type { NextConfig } from 'next'
import { securityHeaders } from './src/server/securityHeaders'

const dev = process.env.NODE_ENV !== 'production'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@execuneed/ui', '@execuneed/db'],
  // Several lockfiles exist above this directory on some machines; pin the
  // trace root to the monorepo so Next does not guess.
  outputFileTracingRoot: path.join(import.meta.dirname, '../..'),
  poweredByHeader: false,
  // The query engine is a binary that nothing statically imports, so tracing
  // can miss it. Next's Prisma handling does pick it up, but this makes it
  // explicit rather than depending on that continuing to be true — the failure
  // mode is every database call 500ing in production while local is fine.
  outputFileTracingIncludes: {
    '/**': ['../../packages/db/generated/client/**/*'],
  },
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
