import type { NextConfig } from 'next'
import { PRIVATE_RESPONSE_HEADERS } from './src/lib/http-security.ts'

const storageHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: { root: process.cwd() },
  images: {
    remotePatterns: storageHost ? [{
      protocol: 'https', hostname: storageHost,
      pathname: '/storage/v1/object/public/website-images/**', search: '',
    }] : [],
    maximumRedirects: 0,
    dangerouslyAllowSVG: false,
    dangerouslyAllowLocalIP: false,
  },
  experimental: { serverActions: { bodySizeLimit: '8mb' } },
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ...(process.env.NODE_ENV === 'production'
          ? [{ key: 'Strict-Transport-Security', value: 'max-age=31536000' }] : []),
        { key: 'Content-Security-Policy', value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'" },
      ],
    }, ...['/admin/:path*', '/login'].map(source => ({
      source,
      headers: Object.entries(PRIVATE_RESPONSE_HEADERS).map(([key, value]) => ({ key, value })),
    }))]
  },
}
export default nextConfig
