/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Minimal Footer (inner pages)
   Simplified footer with bottom bar only
   ══════════════════════════════════════════════════════════════ */

import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';
import CopyrightYear from './CopyrightYear';

export default function FooterMinimal() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-wave" aria-hidden="true">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path className="footer-wave-path" d="M0,40 C240,70 480,10 720,40 C960,70 1200,10 1440,40 L1440,0 L0,0 Z" fill="rgba(4,20,40,0.5)" />
        </svg>
      </div>
      <div className="footer-inner">
        <div className="footer-bottom">
          <p className="footer-copy">
            © <CopyrightYear /> Sambha Creation. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <Link href="/" className="footer-bottom-link">Home</Link>
            <Link href="/privacy" className="footer-bottom-link">Privacy</Link>
            <Link href="/terms" className="footer-bottom-link">Terms</Link>
            <Link href="/contact" className="footer-bottom-link">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
