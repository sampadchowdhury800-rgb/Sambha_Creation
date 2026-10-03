/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Article Detail Page
   Individual article with full SEO
   ══════════════════════════════════════════════════════════════ */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { ArticleStatus } from '@prisma/client';
import AmbientCanvas from '@/components/layout/AmbientCanvas';
import Navbar from '@/components/layout/Navbar';
import FooterMinimal from '@/components/layout/FooterMinimal';
import BackToTop from '@/components/layout/BackToTop';
import NativeBanner from '@/components/ads/NativeBanner';
import CopyLinkButton from './CopyLinkButton';
import Toast from '@/components/ui/Toast';
import JsonLd from '@/components/seo/JsonLd';
import ArticleContent from '@/components/article/ArticleContent';
import { getArticleSchema, getBreadcrumbSchema } from '@/lib/seo';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import { formatDate, getCategoryClass, getCategoryEmoji } from '@/lib/utils';
import type { PublicArticle } from '@/types';

export const revalidate = 60;

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

// ── Generate Metadata ────────────────────────────────────────
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug },
    include: { category: true, tags: true },
  });

  if (!article) return { title: 'Article Not Found' };

  const title = article.seoTitle || `${article.title} — ${SITE_NAME}`;
  const description = article.seoDescription || article.description.slice(0, 160);

  return {
    title: article.title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${SITE_URL}/news/${slug}`,
      images: article.featuredImageUrl ? [{ url: article.featuredImageUrl }] : undefined,
      publishedTime: article.publishedAt?.toISOString(),
      authors: [article.author],
      section: article.category.name,
      tags: article.tags.map((t) => t.name),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: article.featuredImageUrl ? [article.featuredImageUrl] : undefined,
    },
    alternates: {
      canonical: `${SITE_URL}/news/${slug}`,
    },
  };
}

// ── Static Params (for ISR) ──────────────────────────────────
export async function generateStaticParams() {
  try {
    const articles = await prisma.article.findMany({
      where: { status: ArticleStatus.PUBLISHED },
      select: { slug: true },
    });
    return articles.map((a) => ({ slug: a.slug }));
  } catch (error) {
    return [];
  }
}

// ── Page Component ───────────────────────────────────────────
export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      category: true,
      tags: true,
      images: { orderBy: { sortOrder: 'asc' } },
    },
  });

  if (!article || article.status === ArticleStatus.DRAFT) {
    notFound();
  }

  // Get prev/next articles
  const [prevArticle, nextArticle] = await Promise.all([
    prisma.article.findFirst({
      where: {
        status: ArticleStatus.PUBLISHED,
        publishedAt: article.publishedAt ? { lt: article.publishedAt } : undefined,
      },
      orderBy: { publishedAt: 'desc' },
      select: { title: true, slug: true },
    }),
    prisma.article.findFirst({
      where: {
        status: ArticleStatus.PUBLISHED,
        publishedAt: article.publishedAt ? { gt: article.publishedAt } : undefined,
      },
      orderBy: { publishedAt: 'asc' },
      select: { title: true, slug: true },
    }),
  ]);

  // Get related articles (same category, different article)
  const relatedArticles = await prisma.article.findMany({
    where: {
      status: ArticleStatus.PUBLISHED,
      categoryId: article.categoryId,
      id: { not: article.id },
    },
    take: 3,
    orderBy: { publishedAt: 'desc' },
    include: { category: true },
  });

  const publicArticle: PublicArticle = {
    id: article.id,
    title: article.title,
    slug: article.slug,
    headline: article.headline,
    description: article.description,
    content: article.content,
    author: article.author,
    category: {
      name: article.category.name,
      slug: article.category.slug,
      emoji: article.category.emoji,
      cssClass: article.category.cssClass,
    },
    tags: article.tags.map((t) => ({ name: t.name, slug: t.slug })),
    featuredImageUrl: article.featuredImageUrl,
    featuredImageAlt: article.featuredImageAlt,
    images: article.images.map((img) => ({
      url: img.url,
      alt: img.alt,
      width: img.width,
      height: img.height,
      sortOrder: img.sortOrder,
    })),
    instagramVideo: article.instagramVideo,
    youtubeVideo: article.youtubeVideo,
    videoUrl: article.videoUrl || null,
    publishedAt: article.publishedAt?.toISOString() || null,
    readingTime: article.readingTime,
    wordCount: article.wordCount,
    createdAt: article.createdAt.toISOString(),
  };

  const breadcrumbs = [
    { name: 'Home', url: SITE_URL },
    { name: article.category.name, url: `${SITE_URL}/latest` },
    { name: article.title, url: `${SITE_URL}/news/${slug}` },
  ];

  return (
    <>
      <JsonLd data={getArticleSchema(publicArticle)} />
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />

      <AmbientCanvas />
      <Navbar />

      <main>
        <article className="article-page">
          {/* Hero */}
          <section className="page-hero" style={{ paddingBottom: '32px' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <span className={`category-badge ${getCategoryClass(article.category.slug)}`}>
                  {getCategoryEmoji(article.category.slug)} {article.category.name}
                </span>
                {article.readingTime && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    📖 {article.readingTime} min read
                  </span>
                )}
              </div>

              <h1 className="page-hero-title" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.6rem)', lineHeight: '1.2' }}>
                {article.title}
              </h1>

              <p className="page-hero-sub" style={{ fontSize: '1.05rem', lineHeight: '1.7', marginTop: '16px' }}>
                {article.headline}
              </p>

              {/* Meta */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
                <span className="card-author">
                  <span className="author-avatar">{article.author[0]?.toUpperCase()}</span>
                  {article.author}
                </span>
                <span className="card-sep" aria-hidden="true"></span>
                <span className="card-date">{formatDate(article.publishedAt)}</span>
                <CopyLinkButton />
              </div>
            </div>
          </section>

          {/* Content */}
          <div className="container" style={{ maxWidth: '800px' }}>
            {/* Featured Image */}
            {article.featuredImageUrl && (
              <div style={{ marginBottom: '32px', borderRadius: 'var(--r-lg)', overflow: 'hidden', background: 'rgba(0,0,0,0.5)' }}>
                <img
                  src={article.featuredImageUrl}
                  alt={article.featuredImageAlt || article.title}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            )}

            {/* Article Body */}
            <ArticleContent
              content={article.content}
              title={article.title}
              url={`${SITE_URL}/news/${slug}`}
              instagramVideo={article.instagramVideo}
              youtubeVideo={article.youtubeVideo}
            />

            {/* Cloudinary Video */}
            {article.videoUrl && (
              <div style={{ marginTop: '32px', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--wheat)', marginBottom: '14px' }}>🎬 Video</h2>
                <div style={{ borderRadius: 'var(--r-md)', overflow: 'hidden', background: '#000', boxShadow: 'var(--shadow-md)' }}>
                  <video
                    src={article.videoUrl}
                    controls
                    style={{ width: '100%', display: 'block', maxHeight: '480px' }}
                  />
                </div>
              </div>
            )}

            {/* Gallery */}
            {article.images.length > 0 && (
              <div style={{ marginTop: '32px', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--wheat)', marginBottom: '14px' }}>🗂️ Gallery</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                  {article.images.map((img, idx) => (
                    <div key={idx} style={{ borderRadius: '12px', overflow: 'hidden', aspectRatio: '4/3', background: 'rgba(0,0,0,0.3)' }}>
                      <img
                        src={img.url}
                        alt={img.alt || article.title}
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="card-tags" style={{ marginTop: '32px', marginBottom: '32px' }}>
                {article.tags.map((tag) => (
                  <span key={tag.id} className="tag">#{tag.name}</span>
                ))}
              </div>
            )}

            {/* Prev / Next Navigation */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '48px', marginBottom: '48px' }}>
              {prevArticle ? (
                <Link href={`/news/${prevArticle.slug}`} className="btn btn-ghost" style={{ justifyContent: 'flex-start', textAlign: 'left', padding: '16px 20px' }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3L4 7l5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  <span style={{ fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prevArticle.title}</span>
                </Link>
              ) : <div />}
              {nextArticle ? (
                <Link href={`/news/${nextArticle.slug}`} className="btn btn-ghost" style={{ justifyContent: 'flex-end', textAlign: 'right', padding: '16px 20px' }}>
                  <span style={{ fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nextArticle.title}</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l5 4-5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </Link>
              ) : <div />}
            </div>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <section style={{ marginBottom: '48px' }}>
                <h2 className="section-title" style={{ marginBottom: '24px' }}>Related Stories</h2>
                <div className="news-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                  {relatedArticles.map((related) => (
                    <Link key={related.id} href={`/news/${related.slug}`} className="news-card" style={{ textDecoration: 'none' }}>
                      {related.featuredImageUrl && (
                        <div className="card-media" style={{ height: '180px' }}>
                          <div className="card-media-single">
                            <img src={related.featuredImageUrl} alt={related.title} loading="lazy" />
                          </div>
                        </div>
                      )}
                      <div className="card-body" style={{ padding: '16px' }}>
                        <span className={`category-badge ${getCategoryClass(related.category.slug)}`} style={{ marginBottom: '8px', display: 'inline-flex' }}>
                          {related.category.name}
                        </span>
                        <h3 className="card-title" style={{ fontSize: '0.95rem' }}>{related.title}</h3>
                        <span className="card-date">{formatDate(related.publishedAt)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </article>
      </main>

      <NativeBanner />
      <FooterMinimal />
      <BackToTop />
      <Toast />
    </>
  );
}
