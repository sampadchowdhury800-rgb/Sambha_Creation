/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Edit Article Page
   ══════════════════════════════════════════════════════════════ */

import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ArticleEditor from '@/components/admin/ArticleEditor';

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;

  const [article, categories, tags] = await Promise.all([
    prisma.article.findUnique({
      where: { id },
      include: { category: true, tags: true, images: { orderBy: { sortOrder: 'asc' } } },
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.tag.findMany({ orderBy: { name: 'asc' } }),
  ]);

  if (!article) notFound();

  return (
    <div>
      <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--wheat)', fontFamily: 'Poppins, sans-serif', marginBottom: '24px' }}>
        Edit Article
      </h1>
      <ArticleEditor
        categories={categories}
        allTags={tags}
        article={{
          id: article.id,
          title: article.title,
          slug: article.slug,
          headline: article.headline,
          description: article.description,
          content: article.content,
          author: article.author,
          categoryId: article.categoryId,
          tagIds: article.tags.map((t) => t.id),
          featuredImageUrl: article.featuredImageUrl,
          featuredImageId: article.featuredImageId,
          featuredImageAlt: article.featuredImageAlt,
          galleryImages: article.images.map((img) => ({
            id: img.id,
            url: img.url,
            publicId: img.publicId,
            alt: img.alt,
            sortOrder: img.sortOrder,
          })),
          videoUrl: article.videoUrl || null,
          videoPublicId: article.videoPublicId || null,
          instagramVideo: article.instagramVideo || '',
          youtubeVideo: article.youtubeVideo || '',
          status: article.status,
          scheduledAt: article.scheduledAt?.toISOString().slice(0, 16) || null,
          publishedAt: article.publishedAt?.toISOString().slice(0, 10) || null,
          seoTitle: article.seoTitle || '',
          seoDescription: article.seoDescription || '',
        }}
      />
    </div>
  );
}
