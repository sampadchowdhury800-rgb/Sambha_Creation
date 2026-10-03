'use client';

/* Category CRUD manager */

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CategoryData {
  id: string;
  name: string;
  slug: string;
  emoji: string | null;
  cssClass: string | null;
  articleCount: number;
}

export default function CategoryManager({ categories }: { categories: CategoryData[] }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('');
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), emoji: emoji.trim() || null }),
      });
      if (res.ok) {
        setName('');
        setEmoji('');
        router.refresh();
      }
    } catch { /* */ }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category? Articles in this category will not be deleted.')) return;
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    router.refresh();
  };

  return (
    <div>
      {/* Create form */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name..." style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'var(--glass)', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none' }} />
        </div>
        <div style={{ width: '80px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>Emoji</label>
          <input type="text" value={emoji} onChange={(e) => setEmoji(e.target.value)} placeholder="🏷️" style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'var(--glass)', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none', textAlign: 'center' }} />
        </div>
        <button onClick={handleCreate} className="btn btn-primary" disabled={saving} style={{ fontSize: '0.82rem' }}>
          {saving ? '...' : '+ Add'}
        </button>
      </div>

      {/* List */}
      <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
        {categories.map((cat) => (
          <div key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid var(--glass-border)' }}>
            <div>
              <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>{cat.emoji || '📁'}</span>
              <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{cat.name}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '12px' }}>{cat.articleCount} articles</span>
            </div>
            <button onClick={() => handleDelete(cat.id)} className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: '0.75rem', color: 'var(--danger)' }}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
