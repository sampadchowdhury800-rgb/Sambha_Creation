/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Admin Tags Page
   ══════════════════════════════════════════════════════════════ */

import prisma from '@/lib/prisma';
import TagManager from './TagManager';

export default async function AdminTagsPage() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { articles: true } } },
  });

  return (
    <div>
      <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--wheat)', fontFamily: 'Poppins, sans-serif', marginBottom: '24px' }}>
        Tags ({tags.length})
      </h1>
      <TagManager
        tags={tags.map((t) => ({
          id: t.id,
          name: t.name,
          slug: t.slug,
          articleCount: t._count.articles,
        }))}
      />
    </div>
  );
}
