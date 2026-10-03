'use client';

/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Custom Category Dropdown
   Searchable, animated, keyboard-navigable dark select
   Supports inline creation of new categories
   ══════════════════════════════════════════════════════════════ */

import { useState, useRef, useEffect, useCallback } from 'react';
import type { Category } from '@prisma/client';

interface CategorySelectProps {
  categories: Category[];
  value: string;
  onChange: (id: string) => void;
  onCategoryCreated?: (category: Category) => void;
}

export default function CategorySelect({ categories, value, onChange, onCategoryCreated }: CategorySelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [creating, setCreating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selected = categories.find((c) => c.id === value);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase().trim())
  );

  // Whether the typed name is a new (non-duplicate) category
  const searchTrimmed = search.trim();
  const isDuplicate = searchTrimmed
    ? categories.some((c) => c.name.toLowerCase() === searchTrimmed.toLowerCase())
    : false;
  const showCreateOption = searchTrimmed.length > 0 && !isDuplicate;

  // Total navigable items = filtered categories + (optionally) create option
  const totalItems = filtered.length + (showCreateOption ? 1 : 0);
  const createIndex = filtered.length; // index of the "Create" item

  // Scroll highlighted item into view
  useEffect(() => {
    const el = listRef.current?.children[highlightIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [highlightIndex]);

  // Focus search when dropdown opens
  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 50);
      setHighlightIndex(filtered.findIndex((c) => c.id === value));
    } else {
      setSearch('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const select = useCallback(
    (id: string) => {
      onChange(id);
      setOpen(false);
    },
    [onChange]
  );

  const handleCreate = useCallback(async () => {
    const name = searchTrimmed;
    if (!name || creating) return;

    // Final guard against duplicates
    const dupCheck = categories.find((c) => c.name.toLowerCase() === name.toLowerCase());
    if (dupCheck) {
      select(dupCheck.id);
      return;
    }

    setCreating(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        const newCat: Category = await res.json();
        onCategoryCreated?.(newCat);
        onChange(newCat.id);
        setOpen(false);
      }
    } catch {
      // silently fail
    } finally {
      setCreating(false);
    }
  }, [searchTrimmed, creating, categories, select, onCategoryCreated, onChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (e.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, totalItems - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightIndex === createIndex && showCreateOption) {
        handleCreate();
      } else if (filtered[highlightIndex]) {
        select(filtered[highlightIndex].id);
      } else if (showCreateOption) {
        // If nothing is highlighted but there's a create option, trigger create
        handleCreate();
      }
    }
  };

  return (
    <div ref={containerRef} style={{ position: 'relative' }} onKeyDown={handleKeyDown}>
      {/* Trigger */}
      <button
        type="button"
        id="category-select-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          padding: '10px 14px',
          borderRadius: '12px',
          border: `1px solid ${open ? 'rgba(122,140,94,0.5)' : 'var(--glass-border)'}`,
          background: 'var(--glass)',
          color: selected ? 'var(--text-primary)' : 'var(--text-muted)',
          fontSize: '0.85rem',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          boxShadow: open ? '0 0 0 2px rgba(122,140,94,0.15)' : 'none',
          outline: 'none',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {selected ? (
            <>
              <span style={{ fontSize: '1.1rem' }}>{selected.emoji}</span>
              <span>{selected.name}</span>
            </>
          ) : (
            <span style={{ color: 'var(--text-muted)' }}>Select or create category…</span>
          )}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          style={{
            flexShrink: 0,
            color: 'var(--text-muted)',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s var(--ease-in-out)',
          }}
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dropdown Panel */}
      <div
        role="listbox"
        aria-label="Category"
        style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          right: 0,
          zIndex: 60,
          background: 'var(--ocean-mid)',
          border: '1px solid var(--glass-border)',
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
          transformOrigin: 'top',
          transform: open ? 'scaleY(1) translateY(0)' : 'scaleY(0.92) translateY(-6px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'all' : 'none',
          transition: 'transform 0.18s var(--ease-out), opacity 0.15s ease',
        }}
      >
        {/* Search bar */}
        <div style={{ padding: '10px 10px 6px', borderBottom: '1px solid var(--glass-border)' }}>
          <div style={{ position: 'relative' }}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}
            >
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M9.5 9.5l2.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setHighlightIndex(0); }}
              placeholder="Search or type to create…"
              style={{
                width: '100%',
                padding: '7px 10px 7px 32px',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                background: 'rgba(255,255,255,0.04)',
                color: 'var(--text-primary)',
                fontSize: '0.82rem',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Options list */}
        <div ref={listRef} style={{ maxHeight: '220px', overflowY: 'auto', padding: '6px' }}>

          {/* Existing categories */}
          {filtered.length === 0 && !showCreateOption && (
            <div style={{ padding: '12px 14px', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              No categories found
            </div>
          )}

          {filtered.length === 0 && showCreateOption && (
            <div style={{ padding: '8px 14px 4px', fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              No matching category
            </div>
          )}

          {filtered.map((cat, idx) => {
            const isSelected = cat.id === value;
            const isHighlighted = idx === highlightIndex;
            return (
              <button
                key={cat.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                onMouseDown={(e) => { e.preventDefault(); select(cat.id); }}
                onMouseEnter={() => setHighlightIndex(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isSelected
                    ? 'rgba(122,140,94,0.2)'
                    : isHighlighted
                    ? 'rgba(255,255,255,0.04)'
                    : 'transparent',
                  color: isSelected ? 'var(--prairie-light)' : 'var(--text-secondary)',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.1s',
                }}
              >
                <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{cat.emoji}</span>
                <span style={{ flex: 1 }}>{cat.name}</span>
                {isSelected && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, color: 'var(--prairie-light)' }}>
                    <path d="M2.5 7l3.5 3.5 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            );
          })}

          {/* ➕ Create new category option */}
          {showCreateOption && (
            <>
              {filtered.length > 0 && (
                <div style={{ height: '1px', background: 'var(--glass-border)', margin: '4px 6px' }} />
              )}
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); handleCreate(); }}
                onMouseEnter={() => setHighlightIndex(createIndex)}
                disabled={creating}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: highlightIndex === createIndex
                    ? 'rgba(122,140,94,0.15)'
                    : 'transparent',
                  color: 'var(--prairie-light)',
                  fontSize: '0.85rem',
                  cursor: creating ? 'wait' : 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.1s',
                  opacity: creating ? 0.7 : 1,
                }}
              >
                <span style={{ fontSize: '1rem' }}>➕</span>
                <span>
                  {creating ? 'Creating…' : (
                    <>Create <strong>&ldquo;{searchTrimmed}&rdquo;</strong></>
                  )}
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
