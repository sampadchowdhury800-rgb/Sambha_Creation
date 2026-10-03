/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Latest News Page
   ══════════════════════════════════════════════════════════════ */

import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { ArticleStatus } from '@prisma/client';
import AmbientCanvas from '@/components/layout/AmbientCanvas';
import Navbar from '@/components/layout/Navbar';
import NewsFeed from '@/components/home/NewsFeed';
import FooterMinimal from '@/components/layout/FooterMinimal';
import BackToTop from '@/components/layout/BackToTop';
import Toast from '@/components/ui/Toast';
import { formatISODate, getCategoryClass, getCategoryEmoji, getArticleUrl } from '@/lib/utils';
import type { NewsCardData } from '@/types';

export const metadata: Metadata = {
  title: 'Latest News',
  description: 'Browse all the latest stories from Sambha Creation — curated news from India and around the world.',
};

export const revalidate = 60;

async function getArticles(): Promise<NewsCardData[]> {
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

export default async function LatestPage() {
  const articles = await getArticles();

  return (
    <>
      <AmbientCanvas />
      <Navbar showSearch newsData={articles} />

      <main>
        <section className="page-hero">
          <div className="container">
            <div className="hero-badge" style={{ marginBottom: '24px' }}>
              <span className="hero-badge-dot"></span> Latest
            </div>
            <h1 className="page-hero-title">Latest News</h1>
            <p className="page-hero-sub">Stay updated with the newest stories from around the world.</p>
          </div>
        </section>

        <NewsFeed articles={articles} />
      </main>

      <FooterMinimal />
      <BackToTop />
      <Toast />
    </>
  );
}
