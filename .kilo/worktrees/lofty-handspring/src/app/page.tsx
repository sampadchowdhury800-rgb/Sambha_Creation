/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Homepage
   Server Component fetching articles from database
   ══════════════════════════════════════════════════════════════ */

import prisma from '@/lib/prisma';
import { ArticleStatus } from '@prisma/client';
import AmbientCanvas from '@/components/layout/AmbientCanvas';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/home/Hero';
import NewsFeed from '@/components/home/NewsFeed';
import FooterFull from '@/components/layout/FooterFull';
import BackToTop from '@/components/layout/BackToTop';
import LeaderboardBanner from '@/components/ads/LeaderboardBanner';
import NativeBanner from '@/components/ads/NativeBanner';
import SmallBanner from '@/components/ads/SmallBanner';
import Toast from '@/components/ui/Toast';
import JsonLd from '@/components/seo/JsonLd';
import { getOrganizationSchema, getWebSiteSchema } from '@/lib/seo';
import { formatISODate, getCategoryClass, getCategoryEmoji, getArticleUrl } from '@/lib/utils';
import type { NewsCardData } from '@/types';

export const revalidate = 60; // ISR: revalidate every 60 seconds

async function getArticles(): Promise<NewsCardData[]> {
  const now = new Date();

  // Also publish any scheduled articles whose time has arrived
  await prisma.article.updateMany({
    where: {
      status: ArticleStatus.SCHEDULED,
      scheduledAt: { lte: now },
    },
    data: {
      status: ArticleStatus.PUBLISHED,
      publishedAt: now,
    },
  });

  const articles = await prisma.article.findMany({
    where: { status: ArticleStatus.PUBLISHED },
    orderBy: { publishedAt: 'desc' },
    include: {
      category: true,
      tags: true,
      images: { orderBy: { sortOrder: 'asc' } },
    },
  });

  return articles.map((a) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    headline: a.headline,
    description: a.description,
    author: a.author,
    date: formatISODate(a.publishedAt),
    category: a.category.name,
    categoryClass: getCategoryClass(a.category.slug),
    categoryEmoji: getCategoryEmoji(a.category.slug),
    tags: a.tags.map((t) => t.name),
    images: [
      ...(a.featuredImageUrl ? [a.featuredImageUrl] : []),
      ...a.images.map((img) => img.url),
    ],
    videos: a.videoUrl ? [a.videoUrl] : [],
    instagramVideo: a.instagramVideo || '',
    youtubeVideo: a.youtubeVideo || '',
    content: a.content || '',
    shareLink: getArticleUrl(a.slug),
  }));
}

export default async function HomePage() {
  const articles = await getArticles();

  return (
    <>
      <JsonLd data={getOrganizationSchema()} />
      <JsonLd data={getWebSiteSchema()} />

      <AmbientCanvas />
      <Navbar showSearch newsData={articles} />
      
      <LeaderboardBanner />
      
      <main>
        <Hero />
        <NewsFeed articles={articles} />
      </main>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', margin: '2rem 0' }}>
        <NativeBanner />
        <SmallBanner />
      </div>

      <FooterFull />
      <BackToTop />
      <Toast />
    </>
  );
}
