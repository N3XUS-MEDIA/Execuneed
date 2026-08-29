import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@execuneed/ui', '@execuneed/db'],
}

export default nextConfig
