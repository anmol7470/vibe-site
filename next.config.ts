import '@/lib/env/client'
import '@/lib/env/server'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  devIndicators: false,
  reactCompiler: true,
}

export default nextConfig
