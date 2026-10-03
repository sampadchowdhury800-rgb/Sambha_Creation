'use client';

/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Article Editor (Premium CMS)
   Full article form with Tiptap rich text editor,
   custom tag input, category dropdown, publish date,
   and unified media section
   ══════════════════════════════════════════════════════════════ */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TiptapLink from '@tiptap/extension-link';
import TiptapImage from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import type { Category, Tag } from '@prisma/client';
import type { ArticleFormData, GalleryImageItem } from '@/types';
import { generateSlug, calculateReadingTime, countWords, generateSeoTitle, generateSeoDescription } from '@/lib/utils';
import TagInput from './TagInput';
import CategorySelect from './CategorySelect';
import MediaSection from './MediaSection';

interface ArticleEditorProps {
  categories: Category[];
  allTags: Tag[];
  article?: ArticleFormData & {
    id?: string;
    slug?: string;
    galleryImages?: GalleryImageItem[];
  };
}

// Helper: get today's date as YYYY-MM-DD in local time
function todayDateString(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export default function ArticleEditor({ categories: initialCategories, allTags, article }: ArticleEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [fullscreen, setFullscreen] = useState(false);
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null);

  // Local categories state so newly created categories appear instantly
  const [localCategories, setLocalCategories] = useState<Category[]>(initialCategories);

  const [form, setForm] = useState<ArticleFormData>({
    title: article?.title || '',
    headline: article?.headline || '',
    description: article?.description || '',
    content: article?.content || '',
    author: article?.author || 'Sambha Creation',
    categoryId: article?.categoryId || initialCategories[0]?.id || '',
    tagIds: article?.tagIds || [],
    featuredImageUrl: article?.featuredImageUrl || null,
    featuredImageId: article?.featuredImageId || null,
    featuredImageAlt: article?.featuredImageAlt || null,
    galleryImages: article?.galleryImages || [],
    videoUrl: article?.videoUrl || null,
    videoPublicId: article?.videoPublicId || null,
    instagramVideo: article?.instagramVideo || '',
    youtubeVideo: article?.youtubeVideo || '',
    status: article?.status || 'DRAFT',
    scheduledAt: article?.scheduledAt || null,
    publishedAt: article?.publishedAt || todayDateString(),
    seoTitle: article?.seoTitle || '',
    seoDescription: article?.seoDescription || '',
  });

  // Tiptap Editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TiptapLink.configure({ openOnClick: false }),
      TiptapImage.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({ placeholder: 'Start writing your article…' }),
      CharacterCount,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: article?.content || '',
    onUpdate: ({ editor: e }) => {
      const html = e.getHTML();
      setForm((prev) => ({ ...prev, content: html }));
    },
  });

  // Auto-generate SEO fields when title/description changes
  useEffect(() => {
    if (!form.seoTitle && form.title) {
      setForm((prev) => ({ ...prev, seoTitle: generateSeoTitle(prev.title) }));
    }
    if (!form.seoDescription && form.description) {
      setForm((prev) => ({ ...prev, seoDescription: generateSeoDescription(prev.description) }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.title, form.description]);

  const updateField = useCallback(<K extends keyof ArticleFormData>(key: K, value: ArticleFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Called when a new category is created inline
  const handleCategoryCreated = useCallback((newCat: Category) => {
    setLocalCategories((prev) => {
      const exists = prev.some((c) => c.id === newCat.id);
      if (exists) return prev;
      return [...prev, newCat].sort((a, b) => a.name.localeCompare(b.name));
    });
    setForm((prev) => ({ ...prev, categoryId: newCat.id }));
  }, []);

  const handleSave = async (status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED', silent = false) => {
    if (saving) return;
    setSaving(true);
    setSaveStatus('saving');

    const slug = article?.slug || generateSlug(form.title);
    const content = editor?.getHTML() || form.content;
    const wordCount = countWords(content);
    const readingTime = calculateReadingTime(content);

    const body = {
      ...form,
      content,
      status,
      slug,
      wordCount,
      readingTime,
      seoTitle: form.seoTitle || generateSeoTitle(form.title),
      seoDescription: form.seoDescription || generateSeoDescription(form.description),
      // Send publishedAt as ISO string so API can parse it
      publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : null,
    };

    try {
      const url = article?.id ? `/api/articles/${article.id}` : '/api/articles';
      const method = article?.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 3000);
        if (!silent) {
          router.push('/admin/articles');
          router.refresh();
        }
      } else {
        const error = await res.json();
        setSaveStatus('error');
        if (!silent) alert(error.message || 'Failed to save article.');
      }
    } catch {
      setSaveStatus('error');
      if (!silent) alert('Error saving article.');
    } finally {
      setSaving(false);
    }
  };

  // Auto-save draft every 30s
  useEffect(() => {
    if (article?.id && form.status === 'DRAFT') {
      autoSaveRef.current = setInterval(() => {
        handleSave('DRAFT', true);
      }, 30000);
      return () => {
        if (autoSaveRef.current) clearInterval(autoSaveRef.current);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article?.id, form.status]);

  // Image upload into Tiptap editor body
  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.url && editor) {
          editor.chain().focus().setImage({ src: data.url, alt: file.name }).run();
        }
      } catch {
        alert('Image upload failed.');
      }
    };
    input.click();
  };

  const wordCount = countWords(form.content);
  const readingTime = calculateReadingTime(form.content);

  // Status indicator
  const statusIndicator = {
    idle: { text: 'Ready', color: 'var(--text-muted)' },
    saving: { text: 'Saving…', color: 'var(--sand)' },
    saved: { text: '✓ Saved', color: 'var(--success)' },
    error: { text: '✗ Error', color: 'var(--danger)' },
  }[saveStatus];

  // Field label style
  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '0.82rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    letterSpacing: '0.02em',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid var(--glass-border)',
    background: 'var(--glass)',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: '20px',
  };

  const editorWrapper = (
    <div style={{
      background: 'var(--glass)',
      border: '1px solid var(--glass-border)',
      borderRadius: 'var(--r-md)',
      overflow: 'hidden',
      ...(fullscreen ? { position: 'fixed', inset: 0, zIndex: 999, borderRadius: 0 } : {}),
    }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', padding: '10px 14px', borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
        <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()} className={`btn-icon ${editor?.isActive('bold') ? 'active' : ''}`} style={{ width: '32px', height: '32px', fontSize: '0.8rem', fontWeight: '800' }} title="Bold">B</button>
        <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} className={`btn-icon ${editor?.isActive('italic') ? 'active' : ''}`} style={{ width: '32px', height: '32px', fontSize: '0.8rem', fontStyle: 'italic' }} title="Italic">I</button>
        <button type="button" onClick={() => editor?.chain().focus().toggleUnderline().run()} className={`btn-icon ${editor?.isActive('underline') ? 'active' : ''}`} style={{ width: '32px', height: '32px', fontSize: '0.8rem', textDecoration: 'underline' }} title="Underline">U</button>
        <div style={{ width: '1px', background: 'var(--glass-border)', margin: '0 4px' }} />
        <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className={`btn-icon ${editor?.isActive('heading', { level: 2 }) ? 'active' : ''}`} style={{ width: '32px', height: '32px', fontSize: '0.7rem' }} title="Heading 2">H2</button>
        <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} className={`btn-icon ${editor?.isActive('heading', { level: 3 }) ? 'active' : ''}`} style={{ width: '32px', height: '32px', fontSize: '0.7rem' }} title="Heading 3">H3</button>
        <div style={{ width: '1px', background: 'var(--glass-border)', margin: '0 4px' }} />
        <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()} className={`btn-icon`} style={{ width: '32px', height: '32px', fontSize: '0.8rem' }} title="Bullet List">•</button>
        <button type="button" onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={`btn-icon`} style={{ width: '32px', height: '32px', fontSize: '0.7rem' }} title="Numbered List">1.</button>
        <button type="button" onClick={() => editor?.chain().focus().toggleBlockquote().run()} className={`btn-icon ${editor?.isActive('blockquote') ? 'active' : ''}`} style={{ width: '32px', height: '32px', fontSize: '0.9rem' }} title="Quote">&ldquo;</button>
        <div style={{ width: '1px', background: 'var(--glass-border)', margin: '0 4px' }} />
        <button type="button" onClick={() => editor?.chain().focus().setTextAlign('left').run()} className={`btn-icon`} style={{ width: '32px', height: '32px', fontSize: '0.65rem' }} title="Align Left">⬑</button>
        <button type="button" onClick={() => editor?.chain().focus().setTextAlign('center').run()} className={`btn-icon`} style={{ width: '32px', height: '32px', fontSize: '0.65rem' }} title="Align Center">⬓</button>
        <button type="button" onClick={() => {
          const url = prompt('Enter URL:');
          if (url) editor?.chain().focus().setLink({ href: url }).run();
        }} className={`btn-icon ${editor?.isActive('link') ? 'active' : ''}`} style={{ width: '32px', height: '32px', fontSize: '0.8rem' }} title="Add Link">🔗</button>
        <button type="button" onClick={handleImageUpload} className={`btn-icon`} style={{ width: '32px', height: '32px', fontSize: '0.8rem' }} title="Insert Image">📷</button>
        <button type="button" onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3 }).run()} className={`btn-icon`} style={{ width: '32px', height: '32px', fontSize: '0.7rem' }} title="Insert Table">⊞</button>
        <div style={{ width: '1px', background: 'var(--glass-border)', margin: '0 4px' }} />
        <button type="button" onClick={() => editor?.chain().focus().undo().run()} className={`btn-icon`} style={{ width: '32px', height: '32px', fontSize: '0.8rem' }} title="Undo">↶</button>
        <button type="button" onClick={() => editor?.chain().focus().redo().run()} className={`btn-icon`} style={{ width: '32px', height: '32px', fontSize: '0.8rem' }} title="Redo">↷</button>
        <button type="button" onClick={() => setFullscreen(!fullscreen)} className={`btn-icon`} style={{ width: '32px', height: '32px', fontSize: '0.8rem', marginLeft: 'auto' }} title={fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>{fullscreen ? '⊠' : '⊡'}</button>
      </div>

      {/* Editor Content */}
      <div style={{ minHeight: fullscreen ? 'calc(100vh - 100px)' : '400px', padding: '20px' }}>
        <EditorContent editor={editor} />
      </div>

      {/* Status bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 14px', borderTop: '1px solid var(--glass-border)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
        <span>{wordCount} words · {readingTime} min read</span>
        <span style={{ color: statusIndicator.color, fontWeight: '500' }}>{statusIndicator.text}</span>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: '900px' }}>

      {/* ── Title ─────────────────────────────────────────── */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Title *</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => updateField('title', e.target.value)}
          required
          placeholder="Article title…"
          style={{ ...inputStyle, fontSize: '1rem', fontWeight: '600' }}
        />
      </div>

      {/* ── Headline ──────────────────────────────────────── */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Headline *</label>
        <textarea
          value={form.headline}
          onChange={(e) => updateField('headline', e.target.value)}
          required
          placeholder="Brief headline…"
          rows={2}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>

      {/* ── Description ───────────────────────────────────── */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Description *</label>
        <textarea
          value={form.description}
          onChange={(e) => updateField('description', e.target.value)}
          required
          placeholder="Full description…"
          rows={3}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>

      {/* ── Rich Text Editor ──────────────────────────────── */}
      <div style={{ marginBottom: '24px' }}>
        <label style={labelStyle}>Content *</label>
        {editorWrapper}
      </div>

      {/* ── Three-column: Author + Category + Publish Date ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <div>
          <label style={labelStyle}>Author</label>
          <input
            type="text"
            value={form.author}
            onChange={(e) => updateField('author', e.target.value)}
            style={{ ...inputStyle, fontSize: '0.85rem', padding: '10px 14px' }}
          />
        </div>
        <div>
          <label style={labelStyle}>Category *</label>
          <CategorySelect
            categories={localCategories}
            value={form.categoryId}
            onChange={(id) => updateField('categoryId', id)}
            onCategoryCreated={handleCategoryCreated}
          />
        </div>
        <div>
          <label style={labelStyle}>Publish Date</label>
          <div style={{ position: 'relative' }}>
            {/* Calendar icon */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            >
              <rect x="1.5" y="2.5" width="13" height="12" rx="2" stroke="currentColor" strokeWidth="1.2" />
              <path d="M5 1v3M11 1v3M1.5 6.5h13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <input
              type="date"
              id="publish-date"
              value={form.publishedAt || ''}
              onChange={(e) => updateField('publishedAt', e.target.value || null)}
              style={{
                ...inputStyle,
                fontSize: '0.85rem',
                padding: '10px 14px 10px 36px',
                colorScheme: 'dark',
                cursor: 'pointer',
              }}
            />
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Defaults to today if blank
          </p>
        </div>
      </div>

      {/* ── Tags ──────────────────────────────────────────── */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Tags</label>
        <TagInput
          allTags={allTags}
          selectedIds={form.tagIds}
          onChange={(ids) => updateField('tagIds', ids)}
        />
      </div>

      {/* ── Media Section ─────────────────────────────────── */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ ...labelStyle, marginBottom: '14px', fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Media
        </label>
        <MediaSection
          featuredImageUrl={form.featuredImageUrl}
          featuredImageId={form.featuredImageId}
          featuredImageAlt={form.featuredImageAlt}
          onFeaturedChange={(url, id, alt) => setForm((prev) => ({ ...prev, featuredImageUrl: url, featuredImageId: id, featuredImageAlt: alt }))}
          galleryImages={form.galleryImages}
          onGalleryChange={(images) => updateField('galleryImages', images)}
          videoUrl={form.videoUrl}
          videoPublicId={form.videoPublicId}
          onVideoChange={(url, publicId) => setForm((prev) => ({ ...prev, videoUrl: url, videoPublicId: publicId }))}
          instagramVideo={form.instagramVideo}
          onInstagramChange={(url) => updateField('instagramVideo', url)}
          youtubeVideo={form.youtubeVideo}
          onYoutubeChange={(url) => updateField('youtubeVideo', url)}
        />
      </div>

      {/* ── SEO Fields (collapsible) ───────────────────────── */}
      <details style={{ marginBottom: '24px', background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '16px' }}>
        <summary style={{ cursor: 'pointer', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.85rem', userSelect: 'none' }}>
          🔍 SEO Settings
        </summary>
        <div style={{ marginTop: '16px' }}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ ...labelStyle, fontSize: '0.78rem', color: 'var(--text-muted)' }}>SEO Title</label>
            <input type="text" value={form.seoTitle} onChange={(e) => updateField('seoTitle', e.target.value)} style={{ ...inputStyle, padding: '8px 12px', fontSize: '0.82rem', borderRadius: '10px' }} />
          </div>
          <div>
            <label style={{ ...labelStyle, fontSize: '0.78rem', color: 'var(--text-muted)' }}>SEO Description</label>
            <textarea value={form.seoDescription} onChange={(e) => updateField('seoDescription', e.target.value)} rows={2} style={{ ...inputStyle, padding: '8px 12px', fontSize: '0.82rem', borderRadius: '10px', resize: 'vertical' }} />
          </div>
        </div>
      </details>

      {/* ── Schedule ──────────────────────────────────────── */}
      {form.status === 'SCHEDULED' && (
        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}>Schedule Date &amp; Time</label>
          <input
            type="datetime-local"
            value={form.scheduledAt || ''}
            onChange={(e) => updateField('scheduledAt', e.target.value || null)}
            style={{ ...inputStyle, width: 'auto', padding: '10px 14px', fontSize: '0.85rem', colorScheme: 'dark' }}
          />
        </div>
      )}

      {/* ── Action Buttons ────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', paddingTop: '20px', borderTop: '1px solid var(--glass-border)', alignItems: 'center' }}>
        <button type="button" onClick={() => handleSave('DRAFT')} className="btn btn-ghost" disabled={saving} style={{ opacity: saving ? 0.6 : 1 }}>
          📝 Save Draft
        </button>
        <button type="button" onClick={() => handleSave('PUBLISHED')} className="btn btn-primary" disabled={saving} style={{ opacity: saving ? 0.6 : 1 }}>
          ✅ Publish Now
        </button>
        <button type="button" onClick={() => { updateField('status', 'SCHEDULED'); handleSave('SCHEDULED'); }} className="btn btn-watch" disabled={saving} style={{ opacity: saving ? 0.6 : 1 }}>
          🕐 Schedule
        </button>
        {saving && (
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '4px' }}>
            Saving…
          </span>
        )}
      </div>
    </div>
  );
}
