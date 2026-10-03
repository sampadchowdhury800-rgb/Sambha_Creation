'use client';

/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Skeleton Card
   Loading placeholder for news cards
   ══════════════════════════════════════════════════════════════ */

export default function SkeletonCard() {
  return (
    <div className="news-card skeleton-card" aria-hidden="true">
      <div className="card-media" style={{ background: 'var(--glass)' }}>
        <div
          className="skeleton-shimmer"
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
            backgroundSize: '200% 100%',
            animation: 'skeleton-shimmer 1.8s ease-in-out infinite',
          }}
        />
      </div>
      <div className="card-body">
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <div style={{ width: '80px', height: '20px', borderRadius: '12px', background: 'var(--glass)' }} />
        </div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--glass)' }} />
          <div style={{ width: '100px', height: '12px', borderRadius: '8px', background: 'var(--glass)' }} />
          <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'var(--glass)' }} />
          <div style={{ width: '80px', height: '12px', borderRadius: '8px', background: 'var(--glass)' }} />
        </div>
        <div style={{ width: '100%', height: '18px', borderRadius: '8px', background: 'var(--glass)', marginBottom: '8px' }} />
        <div style={{ width: '70%', height: '18px', borderRadius: '8px', background: 'var(--glass)', marginBottom: '16px' }} />
        <div style={{ width: '100%', height: '14px', borderRadius: '8px', background: 'var(--glass)', marginBottom: '6px' }} />
        <div style={{ width: '85%', height: '14px', borderRadius: '8px', background: 'var(--glass)', marginBottom: '20px' }} />
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ width: '100px', height: '34px', borderRadius: '20px', background: 'var(--glass)' }} />
          <div style={{ width: '110px', height: '34px', borderRadius: '20px', background: 'var(--glass)' }} />
        </div>
      </div>
    </div>
  );
}
