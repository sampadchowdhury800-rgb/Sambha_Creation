/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — About Us Page
   Pixel-perfect replica of original about.html
   ══════════════════════════════════════════════════════════════ */

import type { Metadata } from 'next';
import AmbientCanvas from '@/components/layout/AmbientCanvas';
import FooterMinimal from '@/components/layout/FooterMinimal';
import BackToTop from '@/components/layout/BackToTop';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Discover the story behind Sambha Creation — our mission, values, and the people who craft every story.',
};

export default function AboutPage() {
  return (
    <>
      <AmbientCanvas />

      <main>
        <section className="page-hero">
          <div className="container">
            <div className="hero-badge" style={{ marginBottom: '24px' }}>
              <span className="hero-badge-dot"></span> Our Story
            </div>
            <h1 className="page-hero-title">About Sambha Creation</h1>
            <p className="page-hero-sub">Crafting premium journalism with elegance and integrity since Day One.</p>
          </div>
        </section>

        <div className="container">
          {/* Mission & Vision Grid */}
          <div className="about-grid reveal revealed">
            <div className="about-card">
              <div className="about-card-icon">🎯</div>
              <h3 className="about-card-title">Our Mission</h3>
              <p className="about-card-text">
                To deliver accurate, meaningful, and well-crafted stories that inform, inspire, and engage readers — all wrapped in an experience that respects your time and intelligence.
              </p>
            </div>
            <div className="about-card">
              <div className="about-card-icon">🔮</div>
              <h3 className="about-card-title">Our Vision</h3>
              <p className="about-card-text">
                To become one of India&apos;s most trusted and beautifully designed independent news platforms, where quality storytelling meets cutting-edge technology.
              </p>
            </div>
            <div className="about-card">
              <div className="about-card-icon">💎</div>
              <h3 className="about-card-title">Our Values</h3>
              <p className="about-card-text">
                Accuracy first. Integrity always. We believe in presenting facts without sensationalism, crafting every article with care and responsibility.
              </p>
            </div>
            <div className="about-card">
              <div className="about-card-icon">🌱</div>
              <h3 className="about-card-title">Our Story</h3>
              <p className="about-card-text">
                Sambha Creation began as a passion project — the belief that news can be both informative and beautiful. Today, we&apos;re growing into a platform that readers genuinely trust.
              </p>
            </div>
          </div>

          {/* Team Section */}
          <div className="about-team reveal revealed" style={{ marginTop: '64px', marginBottom: '64px' }}>
            <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '32px' }}>Meet the Creator</h2>
            <div className="about-team-grid" style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="about-team-card" style={{ textAlign: 'center', maxWidth: '400px' }}>
                <div className="author-avatar" style={{ width: '72px', height: '72px', fontSize: '28px', margin: '0 auto 16px' }}>S</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--wheat)', marginBottom: '8px' }}>Sambha Creation</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  Founder &amp; Creator. Passionate about building premium digital experiences that make quality journalism accessible to everyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FooterMinimal />
      <BackToTop />
    </>
  );
}
