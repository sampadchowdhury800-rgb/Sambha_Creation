/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — 404 Not Found Page
   ══════════════════════════════════════════════════════════════ */

import Link from 'next/link';
import AmbientCanvas from '@/components/layout/AmbientCanvas';
import Navbar from '@/components/layout/Navbar';
import BackToTop from '@/components/layout/BackToTop';

export default function NotFound() {
  return (
    <>
      <AmbientCanvas />
      <Navbar />
      <main>
        {/* This page renders `.hero` directly below the fixed navbar, and
            `.hero` is now a compact band with no navbar offset of its own —
            so clear the navbar explicitly to avoid content sliding under it. */}
        <section
          className="hero"
          style={{ minHeight: '80vh', paddingTop: 'calc(var(--nav-h) + var(--sp-24))' }}
        >
          <div className="hero-content" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '6rem', marginBottom: '16px', lineHeight: 1 }}>🌌</div>
            <h1 className="hero-headline" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
              Page Not Found
            </h1>
            <p className="hero-sub" style={{ maxWidth: '480px' }}>
              The page you&apos;re looking for has drifted into the void. Let&apos;s get you back.
            </p>
            <div className="hero-actions">
              <Link href="/" className="btn btn-primary btn-ripple">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8h12M8 2l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Back to Home
              </Link>
              <Link href="/latest" className="btn btn-ghost btn-ripple">
                Browse News
              </Link>
            </div>
          </div>
        </section>
      </main>
      <BackToTop />
    </>
  );
}
