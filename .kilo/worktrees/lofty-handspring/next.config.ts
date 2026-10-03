/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Next.js Configuration
   ══════════════════════════════════════════════════════════════ */

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ── Image optimization ─────────────────────────────────────
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // ── Security headers ───────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // ── Experimental features ──────────────────────────────────
  experimental: {
    optimizePackageImports: ['@tiptap/react', '@tiptap/starter-kit'],
  },
};

export default nextConfig;
