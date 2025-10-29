import '@/lib/env'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  devIndicators: false,
  reactCompiler: true,
}

export default nextConfig
