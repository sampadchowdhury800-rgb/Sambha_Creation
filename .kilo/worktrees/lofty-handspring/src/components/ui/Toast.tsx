'use client';

/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Toast Notification
   Identical to original Toast behavior
   ══════════════════════════════════════════════════════════════ */

import { useCallback, useEffect, useRef, useState } from 'react';

let globalShowToast: ((message: string, duration?: number) => void) | null = null;

export function showToast(message: string, duration?: number) {
  globalShowToast?.(message, duration);
}

export default function Toast() {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const show = useCallback((msg: string, duration = 2800) => {
    setMessage(msg);
    setVisible(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setVisible(false), duration);
  }, []);

  useEffect(() => {
    globalShowToast = show;
    return () => {
      globalShowToast = null;
    };
  }, [show]);

  return (
    <div
      id="toast"
      className={`toast${visible ? ' show' : ''}`}
      role="status"
      aria-live="polite"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" stroke="#7A8C5E" strokeWidth="1.5" />
        <path
          d="M5 8l2.5 2.5L11 5.5"
          stroke="#7A8C5E"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {message}
    </div>
  );
}
