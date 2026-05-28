import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['ui', 'database', 'utils'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'utemvtcqgcabehahufhu.supabase.co' },
    ],
  },
}

export default nextConfig
