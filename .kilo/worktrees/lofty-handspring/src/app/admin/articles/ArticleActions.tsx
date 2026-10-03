'use client';

/* Article action buttons (edit, view, delete) */

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ArticleActionsProps {
  articleId: string;
  slug: string;
}

export default function ArticleActions({ articleId, slug }: ArticleActionsProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this article? This cannot be undone.')) return;

    try {
      const res = await fetch(`/api/articles/${articleId}`, { method: 'DELETE' });
      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to delete article.');
      }
    } catch {
      alert('Error deleting article.');
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
      <Link
        href={`/admin/articles/${articleId}/edit`}
        className="btn btn-ghost"
        style={{ padding: '6px 12px', fontSize: '0.75rem' }}
      >
        ✏️ Edit
      </Link>
      <a
        href={`/news/${slug}`}
        target="_blank"
        className="btn btn-ghost"
        style={{ padding: '6px 12px', fontSize: '0.75rem' }}
      >
        👁️ View
      </a>
      <button
        onClick={handleDelete}
        className="btn btn-ghost"
        style={{ padding: '6px 12px', fontSize: '0.75rem', color: 'var(--danger)' }}
      >
        🗑️ Delete
      </button>
    </div>
  );
}
