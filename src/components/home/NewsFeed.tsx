'use client';

/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — News Feed with Infinite Scroll
   Identical behavior to original NewsManager
   ══════════════════════════════════════════════════════════════ */

import { useState, useRef, useEffect, useCallback } from 'react';
import NewsCard from './NewsCard';
import FilterBar from './FilterBar';
import SkeletonCard from './SkeletonCard';
import type { NewsCardData } from '@/types';
import { PAGE_SIZE } from '@/lib/constants';

interface NewsFeedProps {
  articles: NewsCardData[];
  /** Extra class for layout context, e.g. "news-feed-section--first" on the homepage. */
  className?: string;
  /**
   * Heading level for "Latest Stories". The homepage renders the feed as its
   * primary section (h1); /latest renders it beneath its own h1 page hero,
   * so it stays an h2 there. Defaults to h2.
   */
  headingLevel?: 'h1' | 'h2';
}

export default function NewsFeed({ articles, className = '', headingLevel = 'h2' }: NewsFeedProps) {
  const Heading = headingLevel;
  const [activeCategory, setActiveCategory] = useState('all');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  // Filter articles by category
  const filtered = activeCategory === 'all'
    ? articles
    : articles.filter(
        (a) => a.category.toLowerCase() === activeCategory.toLowerCase()
      );

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // Extract unique categories
  const categories = Array.from(new Set(articles.map((a) => a.category)));

  // Infinite scroll observer
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    // Simulate slight delay for smooth UX
    setTimeout(() => {
      setVisibleCount((prev) => prev + PAGE_SIZE);
      setIsLoading(false);
    }, 300);
  }, [isLoading, hasMore]);

  useEffect(() => {
    const node = observerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore]);

  // Reset visible count when category changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisibleCount(PAGE_SIZE);
  }, [activeCategory]);

  return (
    <section className={`news-feed-section ${className}`.trim()} aria-label="Latest News">
      <div className="container">
        {/* Section Header */}
        <div className="section-header reveal revealed">
          <Heading className="section-title" id="latest-stories">Latest Stories</Heading>
          <div className="section-line" aria-hidden="true"></div>
        </div>

        {/* Filter Bar */}
        <FilterBar
          categories={categories}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />

        {/* News Grid */}
        <div id="news-container" className="news-grid" role="feed" aria-label="News articles">
          {visible.map((article, i) => (
            <NewsCard key={article.id} article={article} index={i} />
          ))}

          {/* Loading skeletons */}
          {isLoading && (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          )}
        </div>

        {/* Infinite scroll sentinel */}
        {hasMore && <div ref={observerRef} style={{ height: '1px' }} />}

        {/* No results */}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📰</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
              No articles found in this category yet.
            </p>
          </div>
        )}

        {/* All loaded indicator */}
        {!hasMore && visible.length > 0 && visible.length >= PAGE_SIZE && (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            ✓ You&apos;re all caught up
          </div>
        )}
      </div>
    </section>
  );
}
