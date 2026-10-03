'use client';

/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Tag Input Component
   Autocomplete from existing tags + create new tags inline.
   Both features work simultaneously: suggestions shown alongside
   a ➕ Create option when the typed name is new.
   ══════════════════════════════════════════════════════════════ */

import { useState, useRef, useEffect, useCallback } from 'react';
import type { Tag } from '@prisma/client';

interface TagInputProps {
  allTags: Tag[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export default function TagInput({ allTags, selectedIds, onChange }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [localTags, setLocalTags] = useState<Tag[]>(allTags);
  const [creating, setCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedTags = localTags.filter((t) => selectedIds.includes(t.id));

  // Filtered suggestions: existing tags matching input, not yet selected
  const q = inputValue.trim().toLowerCase();
  const suggestions = q
    ? localTags.filter((t) => t.name.toLowerCase().includes(q) && !selectedIds.includes(t.id))
    : [];

  // Show "Create" option only when input is non-empty AND it's not an exact duplicate
  const inputTrimmed = inputValue.trim();
  const isExactDuplicate = inputTrimmed
    ? localTags.some((t) => t.name.toLowerCase() === inputTrimmed.toLowerCase())
    : false;
  const showCreateOption = inputTrimmed.length > 0 && !isExactDuplicate;

  // Total items in dropdown (for keyboard nav)
  const totalItems = suggestions.length + (showCreateOption ? 1 : 0);
  const createItemIndex = suggestions.length; // "Create" is always last

  // Show dropdown whenever there's text
  const dropdownVisible = showSuggestions && (suggestions.length > 0 || showCreateOption);

  // Update showSuggestions when input changes
  useEffect(() => {
    if (inputValue.trim()) {
      setShowSuggestions(true);
      setHighlightIndex(-1);
    } else {
      setShowSuggestions(false);
    }
  }, [inputValue]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const addTag = useCallback(
    (tag: Tag) => {
      if (selectedIds.includes(tag.id)) return;
      onChange([...selectedIds, tag.id]);
      setInputValue('');
      setShowSuggestions(false);
      inputRef.current?.focus();
    },
    [selectedIds, onChange]
  );

  const createTag = useCallback(async () => {
    const name = inputValue.trim();
    if (!name || creating) return;

    // Check if already exists in localTags (case-insensitive)
    const existing = localTags.find((t) => t.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      addTag(existing);
      return;
    }

    setCreating(true);
    try {
      const res = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        const newTag: Tag = await res.json();
        setLocalTags((prev) => [...prev, newTag].sort((a, b) => a.name.localeCompare(b.name)));
        onChange([...selectedIds, newTag.id]);
        setInputValue('');
        setShowSuggestions(false);
        inputRef.current?.focus();
      }
    } catch {
      // silently fail — tag won't be added
    } finally {
      setCreating(false);
    }
  }, [inputValue, creating, localTags, selectedIds, onChange, addTag]);

  const removeTag = useCallback(
    (id: string) => {
      onChange(selectedIds.filter((sid) => sid !== id));
    },
    [selectedIds, onChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, totalItems - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      if (e.key === 'Tab' && totalItems === 0 && !inputValue.trim()) return;
      e.preventDefault();
      if (highlightIndex >= 0 && highlightIndex < suggestions.length) {
        // Highlighted existing tag
        addTag(suggestions[highlightIndex]);
      } else if (highlightIndex === createItemIndex && showCreateOption) {
        // Highlighted "Create" option
        createTag();
      } else {
        // No explicit highlight: add existing if exact match, else create
        const exactMatch = localTags.find(
          (t) => t.name.toLowerCase() === inputValue.trim().toLowerCase() && !selectedIds.includes(t.id)
        );
        if (exactMatch) {
          addTag(exactMatch);
        } else {
          createTag();
        }
      }
    } else if (e.key === 'Backspace' && !inputValue && selectedIds.length > 0) {
      removeTag(selectedIds[selectedIds.length - 1]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {/* Tag pills + input container */}
      <div
        className="tag-input-container"
        onClick={() => inputRef.current?.focus()}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          alignItems: 'center',
          minHeight: '46px',
          padding: '8px 12px',
          borderRadius: '12px',
          border: '1px solid var(--glass-border)',
          background: 'var(--glass)',
          cursor: 'text',
          transition: 'border-color 0.2s',
        }}
      >
        {/* Selected tag pills */}
        {selectedTags.map((tag) => (
          <span
            key={tag.id}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '3px 10px 3px 12px',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: '500',
              background: 'rgba(122,140,94,0.25)',
              border: '1px solid rgba(122,140,94,0.45)',
              color: 'var(--prairie-light)',
              whiteSpace: 'nowrap',
            }}
          >
            #{tag.name}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(tag.id); }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: '0',
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.85rem',
                lineHeight: 1,
                transition: 'color 0.15s',
              }}
              title="Remove tag"
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              ✕
            </button>
          </span>
        ))}

        {/* Input */}
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue.trim() && setShowSuggestions(true)}
          placeholder={selectedIds.length === 0 ? 'Search or create tags…' : 'Add more…'}
          style={{
            border: 'none',
            background: 'transparent',
            outline: 'none',
            color: 'var(--text-primary)',
            fontSize: '0.85rem',
            minWidth: '160px',
            flex: 1,
            padding: '2px 0',
          }}
        />
      </div>

      {/* Autocomplete Dropdown */}
      {dropdownVisible && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            zIndex: 50,
            background: 'var(--ocean-mid)',
            border: '1px solid var(--glass-border)',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-md)',
            maxHeight: '240px',
            overflowY: 'auto',
          }}
        >
          {/* Existing tag suggestions */}
          {suggestions.length > 0 && (
            <div style={{ padding: '4px' }}>
              {suggestions.map((tag, idx) => (
                <button
                  key={tag.id}
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); addTag(tag); }}
                  onMouseEnter={() => setHighlightIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: idx === highlightIndex ? 'rgba(122,140,94,0.15)' : 'transparent',
                    color: idx === highlightIndex ? 'var(--prairie-light)' : 'var(--text-secondary)',
                    fontSize: '0.83rem',
                    cursor: 'pointer',
                    transition: 'background 0.12s',
                  }}
                >
                  <span style={{ opacity: 0.5, fontSize: '0.75rem' }}>#</span>
                  <span>{tag.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Divider between suggestions and create option */}
          {suggestions.length > 0 && showCreateOption && (
            <div style={{ height: '1px', background: 'var(--glass-border)', margin: '2px 8px' }} />
          )}

          {/* No suggestions hint */}
          {suggestions.length === 0 && showCreateOption && (
            <div style={{ padding: '8px 14px 4px', fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              No matching tag
            </div>
          )}

          {/* ➕ Create new tag option */}
          {showCreateOption && (
            <div style={{ padding: '4px' }}>
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); createTag(); }}
                onMouseEnter={() => setHighlightIndex(createItemIndex)}
                disabled={creating}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: highlightIndex === createItemIndex ? 'rgba(122,140,94,0.15)' : 'transparent',
                  color: 'var(--prairie-light)',
                  fontSize: '0.83rem',
                  cursor: creating ? 'wait' : 'pointer',
                  transition: 'background 0.12s',
                  opacity: creating ? 0.7 : 1,
                }}
              >
                <span>➕</span>
                <span>
                  {creating ? 'Creating…' : (
                    <>Create <strong>&ldquo;{inputTrimmed}&rdquo;</strong></>
                  )}
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Hint text */}
      <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '6px' }}>
        Press{' '}
        <kbd style={{ padding: '1px 5px', borderRadius: '4px', border: '1px solid var(--glass-border)', fontSize: '0.7rem' }}>Enter</kbd> or{' '}
        <kbd style={{ padding: '1px 5px', borderRadius: '4px', border: '1px solid var(--glass-border)', fontSize: '0.7rem' }}>Tab</kbd>{' '}
        to add · Click <strong>✕</strong> to remove
      </p>
    </div>
  );
}
