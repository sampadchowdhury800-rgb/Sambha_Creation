/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — SEO Helpers
   JSON-LD structured data generators
   ══════════════════════════════════════════════════════════════ */

import { SITE_NAME, SITE_URL } from './constants';
import type { PublicArticle } from '@/types';

// ── Organization Schema ──────────────────────────────────────
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/assets/logo.png`,
    sameAs: [
      'https://www.instagram.com/_sambha_creation',
      'https://www.facebook.com/SambhaCreation',
      'https://www.youtube.com/@sambhaanimation',
    ],
  };
}

// ── WebSite Schema ───────────────────────────────────────────
export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/latest?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

// ── NewsArticle Schema ───────────────────────────────────────
export function getArticleSchema(article: PublicArticle) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.description,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/assets/logo.png`,
      },
    },
    datePublished: article.publishedAt,
    dateModified: article.createdAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/news/${article.slug}`,
    },
    ...(article.featuredImageUrl && {
      image: [article.featuredImageUrl],
    }),
    ...(article.wordCount && { wordCount: article.wordCount }),
    articleSection: article.category.name,
    keywords: article.tags.map((t) => t.name).join(', '),
  };
}

// ── BreadcrumbList Schema ────────────────────────────────────
export function getBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
