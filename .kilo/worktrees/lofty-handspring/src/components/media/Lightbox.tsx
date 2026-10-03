'use client';

/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Lightbox
   Full-screen media viewer — replica of original lightbox
   ══════════════════════════════════════════════════════════════ */

import { useState, useEffect, useCallback } from 'react';

interface LightboxProps {
  mediaItems: { type: 'image' | 'video'; src: string; alt?: string }[];
  initialIndex: number;
  onClose: () => void;
}

export default function Lightbox({ mediaItems, initialIndex, onClose }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const total = mediaItems.length;
  const item = mediaItems[index];

  const prev = useCallback(() => setIndex((i) => (i > 0 ? i - 1 : total - 1)), [total]);
  const next = useCallback(() => setIndex((i) => (i < total - 1 ? i + 1 : 0)), [total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose, prev, next]);

  return (
    <div className="lightbox active" role="dialog" aria-modal="true" aria-label="Media viewer">
      <div className="lightbox-backdrop" onClick={onClose}></div>
      <div className="lightbox-content" style={{ animation: 'zoom-in 0.3s var(--ease-out) both' }}>
        {item.type === 'image' ? (
          <img src={item.src} alt={item.alt || ''} className="lightbox-img" />
        ) : (
          <video src={item.src} controls autoPlay className="lightbox-video" style={{ maxWidth: '90vw', maxHeight: '85vh' }} />
        )}
      </div>

      {/* Close */}
      <button className="lightbox-close" onClick={onClose} aria-label="Close lightbox">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      </button>

      {/* Nav */}
      {total > 1 && (
        <>
          <button className="lightbox-btn lightbox-prev" onClick={prev} aria-label="Previous">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M13 4l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button className="lightbox-btn lightbox-next" onClick={next} aria-label="Next">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div className="lightbox-counter">{index + 1} / {total}</div>
        </>
      )}
    </div>
  );
}
