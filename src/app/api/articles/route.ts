/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Articles API
   GET all / POST create
   ══════════════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { ArticleStatus } from '@prisma/client';
import { generateSlug, calculateReadingTime, countWords, generateSeoTitle, generateSeoDescription } from '@/lib/utils';
import type { GalleryImageItem } from '@/types';

// GET /api/articles — public, returns published articles
export async function GET() {
  const articles = await prisma.article.findMany({
    where: { status: ArticleStatus.PUBLISHED },
    orderBy: { publishedAt: 'desc' },
    include: { category: true, tags: true, images: true },
  });
  return NextResponse.json(articles);
}

// POST /api/articles — admin only, create article
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      title, headline, description, content, author, categoryId,
      tagIds, featuredImageUrl, featuredImageId, featuredImageAlt,
      galleryImages, videoUrl, videoPublicId,
      instagramVideo, youtubeVideo, status, scheduledAt,
      publishedAt: publishedAtRaw,
      seoTitle, seoDescription,
    } = body;

    if (!title || !headline || !description || !content || !categoryId) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    let slug = body.slug || generateSlug(title);

    // Ensure unique slug
    const existing = await prisma.article.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const wordCount = countWords(content);
    const readingTime = calculateReadingTime(content);

    // Resolve publishedAt: use explicit date if provided, else now() when publishing
    let publishedAt: Date | null = null;
    if (status === 'PUBLISHED') {
      publishedAt = publishedAtRaw ? new Date(publishedAtRaw) : new Date();
    }

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        headline,
        description,
        content,
        author: author || 'Sambha Creation',
        categoryId,
        featuredImageUrl: featuredImageUrl || null,
        featuredImageId: featuredImageId || null,
        featuredImageAlt: featuredImageAlt || null,
        videoUrl: videoUrl || null,
        videoPublicId: videoPublicId || null,
        instagramVideo: instagramVideo || null,
        youtubeVideo: youtubeVideo || null,
        status: status as ArticleStatus || ArticleStatus.DRAFT,
        publishedAt,
        scheduledAt: status === 'SCHEDULED' && scheduledAt ? new Date(scheduledAt) : null,
        seoTitle: seoTitle || generateSeoTitle(title),
        seoDescription: seoDescription || generateSeoDescription(description),
        wordCount,
        readingTime,
        tags: tagIds?.length ? { connect: tagIds.map((id: string) => ({ id })) } : undefined,
        // Create gallery images
        images: galleryImages?.length
          ? {
              create: (galleryImages as GalleryImageItem[]).map((img, idx) => ({
                url: img.url,
                publicId: img.publicId,
                alt: img.alt || null,
                sortOrder: img.sortOrder ?? idx,
              })),
            }
          : undefined,
      },
      include: { category: true, tags: true, images: true },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('Create article error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

