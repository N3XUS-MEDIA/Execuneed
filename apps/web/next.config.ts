import path from 'node:path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@execuneed/ui', '@execuneed/db'],
  // Several lockfiles exist above this directory on some machines; pin the
  // trace root to the monorepo so Next does not guess.
  outputFileTracingRoot: path.join(import.meta.dirname, '../..'),
}

export default nextConfig
