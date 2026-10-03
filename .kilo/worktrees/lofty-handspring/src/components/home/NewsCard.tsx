'use client';

/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — News Card
   Pixel-perfect replica of original buildCard() in news.js
   ══════════════════════════════════════════════════════════════ */

import { useState, useCallback } from 'react';
import Link from 'next/link';
import GallerySlider from '@/components/media/GallerySlider';
import Lightbox from '@/components/media/Lightbox';
import ShareModal from '@/components/article/ShareModal';
import { formatDate, getArticleUrl } from '@/lib/utils';
import type { NewsCardData } from '@/types';
import DOMPurify from 'isomorphic-dompurify';

interface NewsCardProps {
  article: NewsCardData;
  index: number;
}

export default function NewsCard({ article, index }: NewsCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [content, setContent] = useState<string | null>(article.content || null);
  const [loading, setLoading] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);

  // Build media items for gallery
  const mediaItems = [
    ...(article.images || []).map((src) => ({ type: 'image' as const, src, alt: article.title })),
    ...(article.videos || []).map((src) => ({ type: 'video' as const, src })),
  ];

  const handleReadMore = useCallback(async () => {
    if (expanded) {
      setExpanded(false);
      return;
    }

    if (!content && article.contentPath) {
      setLoading(true);
      try {
        const resp = await fetch(article.contentPath);
        const html = await resp.text();
        setContent(html);
      } catch {
        setContent(`<p>${article.description}</p>`);
      }
      setLoading(false);
    }
    setExpanded(true);
  }, [expanded, content, article.contentPath, article.description]);

  const handleLightbox = (idx: number) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  const shareUrl = article.shareLink || getArticleUrl(article.slug || article.id);

  return (
    <>
      <article
        className="news-card"
        data-news-id={article.id}
        data-category={article.category}
        style={{ animationDelay: `${index * 0.08}s` }}
      >
        {/* Media */}
        {mediaItems.length > 0 && (
          <GallerySlider mediaItems={mediaItems} onExpand={handleLightbox} />
        )}

        {/* Card Body */}
        <div className="card-body">
          {/* Header Row */}
          <div className="card-header-row">
            <div className="card-meta">
              <span className={`category-badge ${article.categoryClass}`}>
                <span>{article.categoryEmoji}</span> {article.category}
              </span>
            </div>
          </div>

          {/* Author + Date */}
          <div className="card-meta" style={{ marginBottom: '12px' }}>
            <span className="card-author">
              <span className="author-avatar">
                {article.author?.[0]?.toUpperCase() || 'S'}
              </span>
              {article.author}
            </span>
            <span className="card-sep" aria-hidden="true"></span>
            <span className="card-date">{formatDate(article.date)}</span>
          </div>

          {/* Title */}
          <h2 className="card-title">{article.title}</h2>

          {/* Headline */}
          <p className="card-headline">{article.headline}</p>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="card-tags">
              {article.tags.map((tag) => (
                <span key={tag} className="tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Expandable Content */}
          <div className={`card-full-content-wrapper${expanded ? ' expanded' : ''}`}>
            <div className="card-full-content-inner">
              <div className="card-full-content">
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '24px' }}>
                    <div className="loading-dots">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                ) : (
                  content && (
                    <div
                      className="article-body"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(content),
                      }}
                    />
                  )
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="card-actions">
            <button
              className="btn btn-read btn-ripple"
              onClick={handleReadMore}
              aria-expanded={expanded}
            >
              {loading ? (
                <>
                  <span className="loading-dots" style={{ display: 'inline-flex', gap: '3px' }}>
                    <span style={{ width: '4px', height: '4px' }}></span>
                    <span style={{ width: '4px', height: '4px' }}></span>
                    <span style={{ width: '4px', height: '4px' }}></span>
                  </span>
                  Loading…
                </>
              ) : expanded ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M11 9L7 5 3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  Read Less
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  Read News
                </>
              )}
            </button>

            <div className="card-video-actions" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {article.instagramVideo && (
                <a
                  href={article.instagramVideo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-watch btn-ripple"
                  title="Watch Instagram Video"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: '#E1306C' }}>
                    <rect x="2" y="2" width="10" height="10" rx="3" stroke="currentColor" strokeWidth="1.2"/>
                    <circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
                    <circle cx="10.5" cy="3.5" r="0.5" fill="currentColor"/>
                  </svg>
                  <span>Instagram</span>
                </a>
              )}

              {article.youtubeVideo && (
                <a
                  href={article.youtubeVideo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-watch btn-ripple"
                  title="Watch YouTube Video"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: '#FF0000' }}>
                    <path d="M13 4.5C13 3.5 12.2 2.7 11.2 2.7H2.8C1.8 2.7 1 3.5 1 4.5V9.5C1 10.5 1.8 11.3 2.8 11.3H11.2C12.2 11.3 13 10.5 13 9.5V4.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 5.5L9 7L6 8.5V5.5Z" fill="currentColor"/>
                  </svg>
                  <span>YouTube</span>
                </a>
              )}
            </div>

            <div className="card-actions-right">
              <button
                className="btn btn-share btn-ripple"
                onClick={() => setShareOpen(true)}
                aria-label={`Share: ${article.title}`}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="10.5" cy="2.5" r="1.8" stroke="currentColor" strokeWidth="1.2" /><circle cx="3.5" cy="7" r="1.8" stroke="currentColor" strokeWidth="1.2" /><circle cx="10.5" cy="11.5" r="1.8" stroke="currentColor" strokeWidth="1.2" /><path d="M5.1 6.1l3.8-2.7M5.1 7.9l3.8 2.7" stroke="currentColor" strokeWidth="1.1" /></svg>
                Share
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          mediaItems={mediaItems}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      {/* Share Modal */}
      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        title={article.title}
        url={shareUrl}
      />
    </>
  );
}
