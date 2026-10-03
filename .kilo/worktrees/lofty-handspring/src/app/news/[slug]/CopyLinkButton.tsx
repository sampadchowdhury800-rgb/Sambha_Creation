'use client';

import { useState } from 'react';

export default function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy} 
      className="copy-link-btn"
      aria-label="Copy link to article"
      style={{
        background: 'none',
        border: 'none',
        color: 'var(--wheat)',
        cursor: 'pointer',
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}
    >
      <span>🔗</span>
      {copied ? 'Copied!' : 'Copy Link'}
    </button>
  );
}
