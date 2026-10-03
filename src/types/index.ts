/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — TypeScript Types
   ══════════════════════════════════════════════════════════════ */

import type { Article, ArticleImage, Category, Tag } from '@prisma/client';

// ── Article with relations ───────────────────────────────────
export type ArticleWithRelations = Article & {
  category: Category;
  tags: Tag[];
  images: ArticleImage[];
};

// ── Public article (for frontend rendering) ──────────────────
export interface PublicArticle {
  id: string;
  title: string;
  slug: string;
  headline: string;
  description: string;
  content: string;
  author: string;
  category: {
    name: string;
    slug: string;
    emoji: string | null;
    cssClass: string | null;
  };
  tags: { name: string; slug: string }[];
  featuredImageUrl: string | null;
  featuredImageAlt: string | null;
  images: {
    url: string;
    alt: string | null;
    width: number | null;
    height: number | null;
    sortOrder: number;
  }[];
  videoUrl: string | null;
  instagramVideo: string | null;
  youtubeVideo: string | null;
  publishedAt: string | null;
  readingTime: number | null;
  wordCount: number | null;
  createdAt: string;
}

// ── News card data (subset for card rendering) ───────────────
export interface NewsCardData {
  id: string;
  title: string;
  slug: string;
  headline: string;
  description: string;
  author: string;
  date: string;
  category: string;
  categoryClass: string;
  categoryEmoji: string;
  tags: string[];
  images: string[];
  videos: string[];
  instagramVideo: string;
  youtubeVideo: string;
  contentPath?: string;
  content?: string;
  shareLink: string;
}

// ── Search result ────────────────────────────────────────────
export interface SearchResult {
  id: string;
  title: string;
  slug: string;
  category: string;
  categoryClass: string;
  categoryEmoji: string;
  author: string;
  date: string;
  thumbnail: string | null;
}

// ── Share options ────────────────────────────────────────────
export interface ShareOption {
  id: string;
  label: string;
  icon: string;
  color: string;
  border: string;
  getUrl?: (title: string, url: string) => string;
  action?: 'copy';
}

// ── Gallery image (client-side before save) ─────────────────
export interface GalleryImageItem {
  id?: string;        // Existing DB id (undefined for new)
  url: string;        // Cloudinary URL
  publicId: string;   // Cloudinary public_id
  alt?: string | null;
  sortOrder: number;
}

// ── Admin article form ───────────────────────────────────────
export interface ArticleFormData {
  title: string;
  headline: string;
  description: string;
  content: string;
  author: string;
  categoryId: string;
  tagIds: string[];
  featuredImageUrl: string | null;
  featuredImageId: string | null;
  featuredImageAlt: string | null;
  galleryImages: GalleryImageItem[];
  videoUrl: string | null;
  videoPublicId: string | null;
  instagramVideo: string;
  youtubeVideo: string;
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';
  scheduledAt: string | null;
  publishedAt: string | null; // Explicit publish date (YYYY-MM-DD)
  seoTitle: string;
  seoDescription: string;
}

// ── Upload response ──────────────────────────────────────────
export interface UploadResponse {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
}

// ── Theme ────────────────────────────────────────────────────
export type Theme = 'dark' | 'light';
