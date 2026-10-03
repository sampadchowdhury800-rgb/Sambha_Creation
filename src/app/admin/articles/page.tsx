/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Admin Articles List
   ══════════════════════════════════════════════════════════════ */

import prisma from '@/lib/prisma';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import ArticleActions from './ArticleActions';

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { category: true, tags: true },
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--wheat)', fontFamily: 'Poppins, sans-serif' }}>
          Articles ({articles.length})
        </h1>
        <Link href="/admin/articles/new" className="btn btn-primary" style={{ fontSize: '0.82rem' }}>
          ✍️ New Article
        </Link>
      </div>

      <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Title</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Category</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Updated</th>
                <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '14px 16px', maxWidth: '300px' }}>
                    <Link href={`/admin/articles/${article.id}/edit`} style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-primary)', textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {article.title}
                    </Link>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{article.category.name}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: '700',
                      background: article.status === 'PUBLISHED' ? 'rgba(106,156,94,0.2)' : article.status === 'SCHEDULED' ? 'rgba(139,94,60,0.2)' : 'rgba(196,168,130,0.15)',
                      color: article.status === 'PUBLISHED' ? 'var(--success)' : article.status === 'SCHEDULED' ? 'var(--autumn)' : 'var(--sand)',
                    }}>
                      {article.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {formatDate(article.updatedAt)}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <ArticleActions articleId={article.id} slug={article.slug} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
