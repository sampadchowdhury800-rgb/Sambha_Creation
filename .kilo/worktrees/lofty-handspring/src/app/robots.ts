/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Robots.txt
   ══════════════════════════════════════════════════════════════ */

import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/secure-admin-login/', '/api/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
