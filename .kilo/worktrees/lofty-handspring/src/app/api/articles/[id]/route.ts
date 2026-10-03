/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Single Article API
   GET / PUT / DELETE by ID
   ══════════════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { ArticleStatus } from '@prisma/client';
import { calculateReadingTime, countWords, generateSeoTitle, generateSeoDescription } from '@/lib/utils';
import type { GalleryImageItem } from '@/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/articles/[id]
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const article = await prisma.article.findUnique({
    where: { id },
    include: { category: true, tags: true, images: { orderBy: { sortOrder: 'asc' } } },
  });

  if (!article) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(article);
}

// PUT /api/articles/[id] — admin only
export async function PUT(req: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const {
      title, slug, headline, description, content, author, categoryId,
      tagIds, featuredImageUrl, featuredImageId, featuredImageAlt,
      galleryImages, videoUrl, videoPublicId,
      instagramVideo, youtubeVideo, status, scheduledAt,
      publishedAt: publishedAtRaw,
      seoTitle, seoDescription,
    } = body;

    const wordCount = countWords(content || '');
    const readingTime = calculateReadingTime(content || '');

    // Determine publishedAt: prefer explicit date from form, fallback to existing, then now()
    const existingArticle = await prisma.article.findUnique({ where: { id }, select: { publishedAt: true, status: true } });
    let publishedAt: Date | null = existingArticle?.publishedAt ?? null;
    if (status === 'PUBLISHED') {
      if (publishedAtRaw) {
        publishedAt = new Date(publishedAtRaw);
      } else if (!publishedAt) {
        publishedAt = new Date();
      }
    } else if (status !== 'PUBLISHED') {
      // Keep existing publishedAt for drafts/scheduled (don't wipe a previously published date)
      publishedAt = existingArticle?.publishedAt ?? null;
    }

    // Sync gallery images: delete all existing then recreate (simple and reliable)
    await prisma.articleImage.deleteMany({ where: { articleId: id } });

    const article = await prisma.article.update({
      where: { id },
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
        status: status as ArticleStatus,
        publishedAt,
        scheduledAt: status === 'SCHEDULED' && scheduledAt ? new Date(scheduledAt) : null,
        seoTitle: seoTitle || generateSeoTitle(title),
        seoDescription: seoDescription || generateSeoDescription(description),
        wordCount,
        readingTime,
        tags: { set: tagIds?.map((tid: string) => ({ id: tid })) || [] },
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
      include: { category: true, tags: true, images: { orderBy: { sortOrder: 'asc' } } },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error('Update article error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/articles/[id] — admin only
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    console.error('Delete article error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
