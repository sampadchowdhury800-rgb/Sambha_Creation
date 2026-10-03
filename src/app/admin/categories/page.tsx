/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Admin Categories Page
   ══════════════════════════════════════════════════════════════ */

import prisma from '@/lib/prisma';
import CategoryManager from './CategoryManager';

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { articles: true } } },
  });

  return (
    <div>
      <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--wheat)', fontFamily: 'Poppins, sans-serif', marginBottom: '24px' }}>
        Categories ({categories.length})
      </h1>
      <CategoryManager
        categories={categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          emoji: c.emoji,
          cssClass: c.cssClass,
          articleCount: c._count.articles,
        }))}
      />
    </div>
  );
}
