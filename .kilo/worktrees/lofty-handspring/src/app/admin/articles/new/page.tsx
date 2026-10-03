/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Create New Article Page
   ══════════════════════════════════════════════════════════════ */

import prisma from '@/lib/prisma';
import ArticleEditor from '@/components/admin/ArticleEditor';

export default async function NewArticlePage() {
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.tag.findMany({ orderBy: { name: 'asc' } }),
  ]);

  return (
    <div>
      <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--wheat)', fontFamily: 'Poppins, sans-serif', marginBottom: '24px' }}>
        Create New Article
      </h1>
      <ArticleEditor categories={categories} allTags={tags} />
    </div>
  );
}
