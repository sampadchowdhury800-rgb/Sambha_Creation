'use client';

/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Share Modal
   Identical to original ShareManager behavior
   ══════════════════════════════════════════════════════════════ */

import { useEffect, useCallback } from 'react';
import { showToast } from '@/components/ui/Toast';

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  url: string;
}

const shareOptions = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: '💬',
    color: '#25D366',
    border: '#1DA851',
    getUrl: (t: string, u: string) => `https://wa.me/?text=${encodeURIComponent(t + '\n' + u)}`,
  },
  {
    id: 'facebook',
    label: 'Facebook',
    icon: '📘',
    color: '#1877F2',
    border: '#1565C0',
    getUrl: (_t: string, u: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`,
  },
  {
    id: 'twitter',
    label: 'X (Twitter)',
    icon: '🐦',
    color: '#1DA1F2',
    border: '#1A91DA',
    getUrl: (t: string, u: string) => `https://x.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(u)}`,
  },
  {
    id: 'telegram',
    label: 'Telegram',
    icon: '✈️',
    color: '#0088cc',
    border: '#006999',
    getUrl: (t: string, u: string) => `https://t.me/share/url?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}`,
  },
  {
    id: 'copy',
    label: 'Copy Link',
    icon: '🔗',
    color: '#6B7280',
    border: '#4B5563',
    action: 'copy' as const,
  },
];

export default function ShareModal({ open, onClose, title, url }: ShareModalProps) {
  const handleShare = useCallback(
    async (option: (typeof shareOptions)[0]) => {
      if (option.action === 'copy') {
        try {
          await navigator.clipboard.writeText(url);
          showToast('Link copied to clipboard!');
        } catch {
          showToast('Failed to copy link');
        }
        onClose();
        return;
      }
      if (option.getUrl) {
        window.open(option.getUrl(title, url), '_blank', 'noopener,noreferrer');
      }
      onClose();
    },
    [title, url, onClose]
  );

  // Web Share API (mobile)
  const handleNativeShare = useCallback(async () => {
    try {
      await navigator.share({ title, url });
      onClose();
    } catch {
      /* cancelled */
    }
  }, [title, url, onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="share-modal active" role="dialog" aria-modal="true" aria-label="Share this article">
      <div className="share-backdrop" onClick={onClose}></div>
      <div className="share-panel" style={{ animation: 'scale-in 0.35s var(--ease-out) both' }}>
        <div className="share-header">
          <h3 className="share-title">Share This Story</h3>
          <button className="share-close" onClick={onClose} aria-label="Close share dialog">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="share-grid">
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button className="share-option" onClick={handleNativeShare} style={{ '--share-color': '#7A8C5E', '--share-border': '#5C7349' } as React.CSSProperties}>
              <span className="share-option-icon">📲</span>
              <span className="share-option-label">Share</span>
            </button>
          )}
          {shareOptions.map((opt) => (
            <button
              key={opt.id}
              className="share-option"
              onClick={() => handleShare(opt)}
              style={{ '--share-color': opt.color, '--share-border': opt.border } as React.CSSProperties}
            >
              <span className="share-option-icon">{opt.icon}</span>
              <span className="share-option-label">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
