/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — RSS Feed
   ══════════════════════════════════════════════════════════════ */

import prisma from '@/lib/prisma';
import { ArticleStatus } from '@prisma/client';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import { escHtml } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  const articles = await prisma.article.findMany({
    where: { status: ArticleStatus.PUBLISHED },
    orderBy: { publishedAt: 'desc' },
    take: 20,
    include: { category: true },
  });

  const items = articles
    .map(
      (a) => `
    <item>
      <title>${escHtml(a.title)}</title>
      <link>${SITE_URL}/news/${a.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/news/${a.slug}</guid>
      <description>${escHtml(a.description)}</description>
      <category>${escHtml(a.category.name)}</category>
      <author>${escHtml(a.author)}</author>
      <pubDate>${a.publishedAt?.toUTCString() || ''}</pubDate>
    </item>`
    )
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>Premium news and stories from Sambha Creation</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
