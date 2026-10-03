/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Shared Utilities
   ══════════════════════════════════════════════════════════════ */

import { CATEGORY_CSS_MAP, CATEGORY_EMOJI_MAP, READING_SPEED_WPM, SITE_URL } from './constants';

// ── Format date to "26 June 2026" ───────────────────────────
export function formatDate(dateStr: string | Date | null): string {
  if (!dateStr) return '';
  const date = new Date(typeof dateStr === 'string' ? dateStr + 'T00:00:00' : dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// ── Format ISO date ──────────────────────────────────────────
export function formatISODate(date: Date | string | null): string {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
}

// ── Get category CSS class ───────────────────────────────────
export function getCategoryClass(category: string | null | undefined): string {
  return CATEGORY_CSS_MAP[category?.toLowerCase() || ''] || 'cat-default';
}

// ── Get category emoji ───────────────────────────────────────
export function getCategoryEmoji(category: string | null | undefined): string {
  return CATEGORY_EMOJI_MAP[category?.toLowerCase() || ''] || '📰';
}

// ── Generate URL slug ────────────────────────────────────────
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120);
}

// ── Calculate reading time ───────────────────────────────────
export function calculateReadingTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / READING_SPEED_WPM));
}

// ── Count words ──────────────────────────────────────────────
export function countWords(content: string): number {
  const text = content.replace(/<[^>]*>/g, '');
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// ── Escape HTML ──────────────────────────────────────────────
export function escHtml(s: string | null | undefined): string {
  return String(s || '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] || c
  );
}

// ── Get article URL ──────────────────────────────────────────
export function getArticleUrl(slug: string): string {
  return `${SITE_URL}/news/${slug}`;
}

// ── Get full URL ─────────────────────────────────────────────
export function getFullUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

// ── Debounce ─────────────────────────────────────────────────
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return function (...args: Parameters<T>) {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

// ── Truncate text ────────────────────────────────────────────
export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen).replace(/\s+\S*$/, '') + '…';
}

// ── Strip HTML tags ──────────────────────────────────────────
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

// ── Generate SEO title ───────────────────────────────────────
export function generateSeoTitle(title: string): string {
  return `${title} — Sambha Creation`;
}

// ── Generate SEO description ─────────────────────────────────
export function generateSeoDescription(description: string): string {
  return truncate(stripHtml(description), 160);
}
