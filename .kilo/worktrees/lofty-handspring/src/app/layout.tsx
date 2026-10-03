/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Root Layout
   Global CSS, fonts, ad scripts, metadata
   ══════════════════════════════════════════════════════════════ */

import type { Metadata } from 'next';
import { Poppins, Inter, Manrope } from 'next/font/google';

// ── Original CSS files (pixel-perfect preservation) ──────────
import '@/styles/style.css';
import '@/styles/animations.css';
import '@/styles/responsive.css';

import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/constants';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import GlobalAds from '@/components/ads/GlobalAds';

// ── Google Fonts ─────────────────────────────────────────────
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

// ── Default Metadata ─────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Premium Stories`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ['sambha creation', 'latest news', 'entertainment', 'technology', 'culture', 'science', 'lifestyle', 'india'],
  openGraph: {
    title: `${SITE_NAME} — Premium Stories`,
    description: 'Elegantly curated news from India and the world.',
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Premium Stories`,
    description: 'Elegantly curated news from India and the world.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
    types: {
      'application/rss+xml': `${SITE_URL}/feed.xml`,
    },
  },
};

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#020912" />
        <script src="https://www.chowdhuryduo.in/api/ai-support/widget?key=cmumxmekb0001ckv38gaww88j" async></script>
      </head>
      <body
        className={`${poppins.variable} ${inter.variable} ${manrope.variable}`}
      >
        <GlobalAds />
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
