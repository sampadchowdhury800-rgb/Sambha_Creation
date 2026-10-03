/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Admin Dashboard
   ══════════════════════════════════════════════════════════════ */

import prisma from '@/lib/prisma';
import { ArticleStatus } from '@prisma/client';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export default async function AdminDashboard() {
  const [total, published, draft, scheduled, recentArticles] = await Promise.all([
    prisma.article.count(),
    prisma.article.count({ where: { status: ArticleStatus.PUBLISHED } }),
    prisma.article.count({ where: { status: ArticleStatus.DRAFT } }),
    prisma.article.count({ where: { status: ArticleStatus.SCHEDULED } }),
    prisma.article.findMany({
      take: 5,
      orderBy: { updatedAt: 'desc' },
      include: { category: true },
    }),
  ]);

  const stats = [
    { label: 'Total Articles', value: total, icon: '📰', color: 'var(--prairie)' },
    { label: 'Published', value: published, icon: '✅', color: 'var(--success)' },
    { label: 'Drafts', value: draft, icon: '📝', color: 'var(--sand)' },
    { label: 'Scheduled', value: scheduled, icon: '🕐', color: 'var(--autumn)' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--wheat)', fontFamily: 'Poppins, sans-serif' }}>Dashboard</h1>
        <Link href="/admin/articles/new" className="btn btn-primary" style={{ fontSize: '0.82rem' }}>
          ✍️ New Article
        </Link>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}>
        {stats.map((stat) => (
          <div key={stat.label} style={{
            padding: '24px',
            background: 'var(--glass)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--r-md)',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{stat.icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: stat.color, fontFamily: 'Poppins, sans-serif' }}>{stat.value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Articles */}
      <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--wheat)', marginBottom: '16px' }}>Recent Articles</h2>
      <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
        {recentArticles.map((article) => (
          <Link
            key={article.id}
            href={`/admin/articles/${article.id}/edit`}
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '16px 20px', borderBottom: '1px solid var(--glass-border)',
              textDecoration: 'none', transition: 'background 0.2s',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {article.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {article.category.name} · {formatDate(article.updatedAt)}
              </div>
            </div>
            <span style={{
              padding: '4px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: '700',
              background: article.status === 'PUBLISHED' ? 'rgba(106,156,94,0.2)' : article.status === 'SCHEDULED' ? 'rgba(139,94,60,0.2)' : 'rgba(196,168,130,0.15)',
              color: article.status === 'PUBLISHED' ? 'var(--success)' : article.status === 'SCHEDULED' ? 'var(--autumn)' : 'var(--sand)',
              flexShrink: 0, marginLeft: '12px',
            }}>
              {article.status}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
