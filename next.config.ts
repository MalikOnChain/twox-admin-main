import type { NextConfig } from 'next'

/**
 * API proxy: `src/app/api/admin-bff/[...path]/route.ts` (runtime env — works on Vercel).
 * Set ADMIN_BACKEND_INTERNAL_URL in .env.local and Vercel (server-only).
 */
const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

export default nextConfig
