'use client';

/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Article Content Renderer
   Renders sanitized HTML content with share buttons
   ══════════════════════════════════════════════════════════════ */

import { useState } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import ShareModal from './ShareModal';

interface ArticleContentProps {
  content: string;
  title: string;
  url: string;
  instagramVideo?: string | null;
  youtubeVideo?: string | null;
}

export default function ArticleContent({ content, title, url, instagramVideo, youtubeVideo }: ArticleContentProps) {
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <>
      <div
        className="article-body static-page-content"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
      />

      {/* Share Section */}
      <div style={{ marginTop: '32px' }}>
        <button className="btn btn-share btn-ripple" onClick={() => setShareOpen(true)}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="10.5" cy="2.5" r="1.8" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="3.5" cy="7" r="1.8" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="10.5" cy="11.5" r="1.8" stroke="currentColor" strokeWidth="1.2" />
            <path d="M5.1 6.1l3.8-2.7M5.1 7.9l3.8 2.7" stroke="currentColor" strokeWidth="1.1" />
          </svg>
          Share This Story
        </button>
      </div>

      {/* Watch Video Section */}
      {(instagramVideo || youtubeVideo) && (
        <div style={{ marginTop: '32px', marginBottom: '16px', padding: '24px', background: 'var(--glass)', borderRadius: 'var(--r-lg)', border: '1px solid var(--glass-border)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.4rem' }}>📹</span> Watch Video
          </h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {instagramVideo && (
              <a
                href={instagramVideo}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ripple"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                  color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '12px',
                  fontWeight: '600', fontSize: '0.9rem', textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(220, 39, 67, 0.3)', transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(220, 39, 67, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(220, 39, 67, 0.3)';
                }}
              >
                <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
                  <rect x="2" y="2" width="10" height="10" rx="3" stroke="currentColor" strokeWidth="1.2"/>
                  <circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
                  <circle cx="10.5" cy="3.5" r="0.5" fill="currentColor"/>
                </svg>
                Instagram Video
              </a>
            )}

            {youtubeVideo && (
              <a
                href={youtubeVideo}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ripple"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: '#FF0000', color: '#fff', border: 'none',
                  padding: '10px 20px', borderRadius: '12px',
                  fontWeight: '600', fontSize: '0.9rem', textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(255, 0, 0, 0.3)', transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 0, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(255, 0, 0, 0.3)';
                }}
              >
                <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
                  <path d="M13 4.5C13 3.5 12.2 2.7 11.2 2.7H2.8C1.8 2.7 1 3.5 1 4.5V9.5C1 10.5 1.8 11.3 2.8 11.3H11.2C12.2 11.3 13 10.5 13 9.5V4.5Z" fill="currentColor"/>
                  <path d="M6 5.5L9 7L6 8.5V5.5Z" fill="#FF0000"/>
                </svg>
                YouTube Video
              </a>
            )}
          </div>
        </div>
      )}

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        title={title}
        url={url}
      />
    </>
  );
}
