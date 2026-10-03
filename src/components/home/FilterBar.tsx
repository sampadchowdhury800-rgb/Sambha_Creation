'use client';

/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Filter Bar
   Category filter buttons — identical to original
   ══════════════════════════════════════════════════════════════ */

interface FilterBarProps {
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
}

export default function FilterBar({ categories, activeCategory, onSelect }: FilterBarProps) {
  return (
    <div className="filter-bar reveal revealed" aria-label="Filter by category">
      <button
        className={`filter-btn${activeCategory === 'all' ? ' active' : ''}`}
        onClick={() => onSelect('all')}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          className={`filter-btn${activeCategory === cat ? ' active' : ''}`}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
