'use client';

/* Tag CRUD manager */

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface TagData {
  id: string;
  name: string;
  slug: string;
  articleCount: number;
}

export default function TagManager({ tags }: { tags: TagData[] }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (res.ok) {
        setName('');
        router.refresh();
      }
    } catch { /* */ }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this tag?')) return;
    await fetch(`/api/tags/${id}`, { method: 'DELETE' });
    router.refresh();
  };

  return (
    <div>
      {/* Create form */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>Tag Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tag name..." onKeyDown={(e) => e.key === 'Enter' && handleCreate()} style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'var(--glass)', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none' }} />
        </div>
        <button onClick={handleCreate} className="btn btn-primary" disabled={saving} style={{ fontSize: '0.82rem' }}>
          {saving ? '...' : '+ Add'}
        </button>
      </div>

      {/* Tag cloud */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {tags.map((tag) => (
          <div key={tag.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '20px', background: 'var(--glass)', border: '1px solid var(--glass-border)', fontSize: '0.82rem' }}>
            <span style={{ color: 'var(--text-primary)' }}>#{tag.name}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({tag.articleCount})</span>
            <button onClick={() => handleDelete(tag.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.75rem', padding: '0 2px', opacity: 0.6 }} title="Delete tag">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}
