'use client';

/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Gallery Slider
   Image/video slider for news cards — replica of original gallery.js
   ══════════════════════════════════════════════════════════════ */

import { useState, useRef, useCallback, useEffect } from 'react';

interface GallerySliderProps {
  mediaItems: { type: 'image' | 'video'; src: string; alt?: string }[];
  onExpand: (index: number) => void;
}

export default function GallerySlider({ mediaItems, onExpand }: GallerySliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const total = mediaItems.length;

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(total - 1, index));
      setCurrentIndex(clamped);
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(-${clamped * 100}%)`;
      }
    },
    [total]
  );

  const prev = () => goTo(currentIndex - 1);
  const next = () => goTo(currentIndex + 1);

  // Touch support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) next();
      else prev();
    }
  };

  // Auto-pause videos when not in view
  useEffect(() => {
    const videos = trackRef.current?.querySelectorAll('video');
    videos?.forEach((video, i) => {
      if (i === currentIndex) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [currentIndex]);

  if (total === 0) return null;

  // Single media item — no slider
  if (total === 1) {
    const item = mediaItems[0];
    return (
      <div className="card-media">
        {item.type === 'image' ? (
          <div className="card-media-single" onClick={() => onExpand(0)} style={{ cursor: 'pointer' }}>
            <img src={item.src} alt={item.alt || ''} loading="lazy" />
          </div>
        ) : (
          <div style={{ position: 'relative', height: '100%' }}>
            <video src={item.src} muted playsInline loop preload="metadata" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div className="video-play-overlay" onClick={() => {
              const v = trackRef.current?.parentElement?.querySelector('video');
              if (v) { v.paused ? v.play() : v.pause(); }
            }}>
              <div className="play-btn-circle">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><polygon points="6,3 18,10 6,17" /></svg>
              </div>
            </div>
          </div>
        )}
        <button className="media-expand-btn" onClick={() => onExpand(0)} aria-label="Expand media">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 5V1h4M9 1h4v4M13 9v4H9M5 13H1V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    );
  }

  return (
    <div className="card-media" ref={trackRef ? undefined : undefined}>
      <div className="gallery-slider">
        <div
          ref={trackRef}
          className="gallery-track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {mediaItems.map((item, i) => (
            <div key={i} className="gallery-slide">
              {item.type === 'image' ? (
                <img
                  src={item.src}
                  alt={item.alt || ''}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  onClick={() => onExpand(i)}
                  style={{ cursor: 'pointer' }}
                />
              ) : (
                <>
                  <video
                    src={item.src}
                    muted
                    playsInline
                    loop
                    preload="metadata"
                  />
                  <div className="video-play-overlay" onClick={() => {
                    const slides = trackRef.current?.querySelectorAll('.gallery-slide');
                    const video = slides?.[i]?.querySelector('video');
                    if (video) { video.paused ? video.play() : video.pause(); }
                  }}>
                    <div className="play-btn-circle">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><polygon points="6,3 18,10 6,17" /></svg>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Nav buttons */}
        {currentIndex > 0 && (
          <button className="gallery-btn gallery-btn-prev" onClick={prev} aria-label="Previous">
            <svg viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        )}
        {currentIndex < total - 1 && (
          <button className="gallery-btn gallery-btn-next" onClick={next} aria-label="Next">
            <svg viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        )}

        {/* Dots */}
        <div className="gallery-dots">
          {mediaItems.map((_, i) => (
            <button
              key={i}
              className={`gallery-dot${i === currentIndex ? ' active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Counter */}
        <span className="media-count">
          {currentIndex + 1} / {total}
        </span>
      </div>

      <button className="media-expand-btn" onClick={() => onExpand(currentIndex)} aria-label="Expand media">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 5V1h4M9 1h4v4M13 9v4H9M5 13H1V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
    </div>
  );
}
