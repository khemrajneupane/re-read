import { withPayload } from '@payloadcms/next/withPayload'

import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.CLOUDFLARE_IMAGE_URL
  ? `https://${process.env.CLOUDFLARE_IMAGE_URL}`
  : undefined || process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    minimumCacheTTL: 2678400,
    formats: ['image/webp'],
    deviceSizes: [640, 768, 1024],
    imageSizes: [32, 64],
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL].map((item) => {
        const url = new URL(item)
        return {
          protocol: url.protocol.replace(':', ''),
          hostname: url.hostname,
          pathname: '/book-storage/**', // restrict bucket
        }
      }),
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'js.stripe.com' },
      { protocol: 'https', hostname: 'q.stripe.com' }, // Required for Stripe elements
      { protocol: 'https', hostname: 'files.stripe.com' }, // For Stripe file uploads
      { protocol: 'https', hostname: process.env.CLOUDFLARE_IMAGE_URL }, // For CLOUDFLARE
      { protocol: 'https', hostname: 'used-books.netlify.app' }, // For CLOUDFLARE
    ],
  },
  reactStrictMode: true,
  redirects,
  devIndicators: false,
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
