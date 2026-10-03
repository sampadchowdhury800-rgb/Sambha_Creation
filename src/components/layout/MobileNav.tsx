'use client';

/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Mobile Navigation Drawer
   Pixel-perfect replica of the original mobile-nav
   ══════════════════════════════════════════════════════════════ */

import Link from 'next/link';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileNav({ open, onClose }: MobileNavProps) {
  return (
    <nav
      id="mobile-nav"
      className={`mobile-nav${open ? ' open' : ''}`}
      aria-label="Mobile navigation"
    >
      <div className="mobile-nav-links">
        <Link href="/" className="mobile-nav-link" onClick={onClose}>🏠 Home</Link>
        <Link href="/latest" className="mobile-nav-link" onClick={onClose}>📰 Latest News</Link>
        <Link href="/about" className="mobile-nav-link" onClick={onClose}>✨ About Us</Link>
        <Link href="/contact" className="mobile-nav-link" onClick={onClose}>✉️ Contact Us</Link>
        <Link href="/privacy" className="mobile-nav-link" onClick={onClose}>🔒 Privacy Policy</Link>
        <Link href="/terms" className="mobile-nav-link" onClick={onClose}>📋 Terms &amp; Conditions</Link>
        <Link href="/disclaimer" className="mobile-nav-link" onClick={onClose}>⚠️ Disclaimer</Link>
      </div>
      <div className="mobile-social-row">
        <a href="https://www.instagram.com/_sambha_creation?igsh=OTZiYXdtazNyeTM0" target="_blank" rel="noopener" className="footer-social-btn" aria-label="Instagram">📷</a>
        <a href="https://www.facebook.com/share/18pN5KsRwf/" target="_blank" rel="noopener" className="footer-social-btn" aria-label="Facebook">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
        </a>
        <a href="https://youtube.com/@sambhaanimation?si=QWlxu0nued5PLlgp" target="_blank" rel="noopener" className="footer-social-btn" aria-label="YouTube">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="red"/></svg>
        </a>
      </div>
    </nav>
  );
}
