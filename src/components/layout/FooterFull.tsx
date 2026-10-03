/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Full Footer (Homepage)
   Pixel-perfect replica with all 4 columns
   ══════════════════════════════════════════════════════════════ */

import Link from 'next/link';
import { SITE_NAME, SOCIAL_LINKS } from '@/lib/constants';
import CopyrightYear from './CopyrightYear';

export default function FooterFull() {
  return (
    <footer className="footer" role="contentinfo">
      {/* Wave Separator */}
      <div className="footer-wave" aria-hidden="true">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path
            className="footer-wave-path"
            d="M0,40 C240,70 480,10 720,40 C960,70 1200,10 1440,40 L1440,0 L0,0 Z"
            fill="rgba(4,20,40,0.5)"
          />
          <path
            d="M0,55 C360,30 720,70 1080,45 C1260,32 1380,52 1440,55 L1440,0 L0,0 Z"
            fill="rgba(2,9,18,0.4)"
          />
        </svg>
      </div>

      <div className="footer-inner">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-brand-logo">
              <img src="/assets/logo.png" alt="Sambha Creation" width={44} height={44} />
              <span className="footer-brand-name">Sambha Creation</span>
            </div>
            <p className="footer-brand-desc">
              Premium journalism delivered with elegance. Stories from India and the world — curated for those who care about quality.
            </p>
            <div className="footer-socials">
              <a href="https://www.instagram.com/_sambha_creation?igsh=OTZiYXdtazNyeTM0" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="Follow on Instagram">📷</a>
              <a href="https://www.facebook.com/share/18pN5KsRwf/" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="Follow on Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://youtube.com/@sambhaanimation?si=QWlxu0nued5PLlgp" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="Subscribe on YouTube">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#FF0000"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="footer-col-title">Quick Links</h3>
            <nav className="footer-links" aria-label="Quick links">
              <Link href="/" className="footer-link">Home</Link>
              <Link href="/latest" className="footer-link">Latest News</Link>
              <Link href="/about" className="footer-link">About Us</Link>
              <Link href="/contact" className="footer-link">Contact Us</Link>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h3 className="footer-col-title">Legal</h3>
            <nav className="footer-links" aria-label="Legal pages">
              <Link href="/privacy" className="footer-link">Privacy Policy</Link>
              <Link href="/terms" className="footer-link">Terms &amp; Conditions</Link>
              <Link href="/disclaimer" className="footer-link">Disclaimer</Link>
            </nav>
          </div>

          {/* Follow */}
          <div>
            <h3 className="footer-col-title">Follow Us</h3>
            <div className="footer-links">
              <a href="https://www.instagram.com/_sambha_creation?igsh=OTZiYXdtazNyeTM0" target="_blank" rel="noopener" className="footer-link">📷 Instagram</a>
              <a href="https://www.facebook.com/share/18pN5KsRwf/" target="_blank" rel="noopener" className="footer-link">Facebook</a>
              <a href="https://youtube.com/@sambhaanimation?si=QWlxu0nued5PLlgp" target="_blank" rel="noopener" className="footer-link">▶ YouTube</a>
            </div>
          </div>
        </div>

        <div className="footer-divider" aria-hidden="true"></div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © <CopyrightYear /> Sambha Creation. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <Link href="/privacy" className="footer-bottom-link">Privacy</Link>
            <Link href="/terms" className="footer-bottom-link">Terms</Link>
            <Link href="/disclaimer" className="footer-bottom-link">Disclaimer</Link>
            <Link href="/contact" className="footer-bottom-link">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
