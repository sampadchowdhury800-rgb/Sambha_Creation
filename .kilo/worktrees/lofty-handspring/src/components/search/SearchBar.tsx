'use client';

/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Search Bar
   Identical to original SearchManager behavior
   ══════════════════════════════════════════════════════════════ */

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { NewsCardData } from '@/types';
import { getCategoryClass, getCategoryEmoji, formatDate } from '@/lib/utils';

interface SearchBarProps {
  newsData: NewsCardData[];
}

interface SearchResult {
  id: string;
  title: string;
  slug?: string;
  category: string;
  author: string;
  date: string;
  thumbnail: string | null;
}

export default function SearchBar({ newsData }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const performSearch = useCallback(
    (q: string) => {
      if (!q || q.length < 1) {
        setResults([]);
        setShowDropdown(false);
        return;
      }

      const lower = q.toLowerCase().trim();
      const filtered = newsData
        .filter(
          (item) =>
            item.title?.toLowerCase().includes(lower) ||
            item.description?.toLowerCase().includes(lower) ||
            item.headline?.toLowerCase().includes(lower) ||
            item.category?.toLowerCase().includes(lower) ||
            item.author?.toLowerCase().includes(lower) ||
            item.tags?.some((tag) => tag.toLowerCase().includes(lower))
        )
        .slice(0, 6)
        .map((item) => ({
          id: item.id,
          title: item.title,
          slug: item.slug,
          category: item.category,
          author: item.author,
          date: item.date,
          thumbnail: item.images?.[0] || null,
        }));

      setResults(filtered);
      setShowDropdown(true);
      setFocusedIndex(-1);
    },
    [newsData]
  );

  const handleInput = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => performSearch(value.trim()), 160);
  };

  const navigateToArticle = (result: SearchResult) => {
    setShowDropdown(false);
    setQuery('');
    if (result.slug) {
      router.push(`/news/${result.slug}`);
    } else {
      // Scroll to card on current page
      const card = document.querySelector(`[data-news-id="${result.id}"]`);
      if (card) {
        const top = card.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      if (focusedIndex >= 0 && results[focusedIndex]) {
        navigateToArticle(results[focusedIndex]);
      } else if (results[0]) {
        navigateToArticle(results[0]);
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      inputRef.current?.blur();
    }
  };

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const wrapper = (e.target as HTMLElement).closest('.search-wrapper');
      if (!wrapper) setShowDropdown(false);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  function highlight(text: string, q: string) {
    if (!q || !text) return text;
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === q.toLowerCase() ? (
        <mark key={i}>{part}</mark>
      ) : (
        part
      )
    );
  }

  return (
    <div className="search-wrapper" role="search">
      <label className="search-bar" id="search-bar" htmlFor="search-input">
        <svg className="search-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          id="search-input"
          className="search-input"
          placeholder="Search stories…"
          autoComplete="off"
          aria-label="Search news articles"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          spellCheck={false}
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => { if (query.trim().length >= 1) setShowDropdown(true); }}
          onKeyDown={handleKeyDown}
        />
      </label>
      <div
        ref={dropdownRef}
        id="search-suggestions"
        className={`search-suggestions${showDropdown ? ' active' : ''}`}
        role="listbox"
        aria-label="Search suggestions"
      >
        {results.length === 0 && query.trim().length >= 1 ? (
          <div className="suggestion-no-results">
            <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '8px' }}>🔍</span>
            No results for &quot;<strong>{query}</strong>&quot;
          </div>
        ) : (
          results.map((item, i) => {
            const catClass = getCategoryClass(item.category);
            const emoji = getCategoryEmoji(item.category);
            return (
              <div
                key={item.id}
                className={`suggestion-item${i === focusedIndex ? ' focused' : ''}`}
                role="option"
                aria-selected={i === focusedIndex}
                tabIndex={-1}
                onClick={() => navigateToArticle(item)}
              >
                {item.thumbnail ? (
                  <img className="suggestion-thumb" src={item.thumbnail} alt="" loading="lazy" />
                ) : (
                  <div className="suggestion-thumb-placeholder">{emoji}</div>
                )}
                <div className="suggestion-info">
                  <div className="suggestion-title">{highlight(item.title, query.trim())}</div>
                  <div className="suggestion-meta">
                    <span className={`category-badge ${catClass}`} style={{ fontSize: '9px', padding: '2px 8px' }}>
                      {item.category}
                    </span>
                    &nbsp;·&nbsp; {item.author} &nbsp;·&nbsp; {formatDate(item.date)}
                  </div>
                </div>
                <svg width="14" height="14" fill="none" viewBox="0 0 14 14" style={{ flexShrink: 0, opacity: 0.35 }}>
                  <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
