/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Contact Us Page
   FormSubmit integration preserved exactly
   ══════════════════════════════════════════════════════════════ */

import type { Metadata } from 'next';
import AmbientCanvas from '@/components/layout/AmbientCanvas';
import Navbar from '@/components/layout/Navbar';
import FooterMinimal from '@/components/layout/FooterMinimal';
import BackToTop from '@/components/layout/BackToTop';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Sambha Creation — reach out for collaborations, feedback, or story tips.',
};

export default function ContactPage() {
  return (
    <>
      <AmbientCanvas />
      <Navbar />

      <main>
        <section className="page-hero">
          <div className="container">
            <div className="hero-badge" style={{ marginBottom: '24px' }}>
              <span className="hero-badge-dot"></span> Connect
            </div>
            <h1 className="page-hero-title">Contact Us</h1>
            <p className="page-hero-sub">We&apos;d love to hear from you. Reach out for collaborations, feedback, or story tips.</p>
          </div>
        </section>

        <div className="container">
          <div className="contact-layout reveal revealed">
            {/* Contact Info */}
            <div className="contact-info">
              <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '20px', color: 'var(--wheat)' }}>Get In Touch</h2>
              <div className="contact-info-items">
                <div className="contact-info-item">
                  <span className="contact-info-icon">✉️</span>
                  <div>
                    <div className="contact-info-label">Email</div>
                    <a href="mailto:sambha.creation.work@gmail.com" className="contact-info-value" style={{ color: 'var(--link)' }}>
                      sambha.creation.work@gmail.com
                    </a>
                  </div>
                </div>
                <div className="contact-info-item">
                  <span className="contact-info-icon">📷</span>
                  <div>
                    <div className="contact-info-label">Instagram</div>
                    <a href="https://www.instagram.com/_sambha_creation" target="_blank" rel="noopener" className="contact-info-value" style={{ color: 'var(--link)' }}>
                      @_sambha_creation
                    </a>
                  </div>
                </div>
                <div className="contact-info-item">
                  <span className="contact-info-icon">📘</span>
                  <div>
                    <div className="contact-info-label">Facebook</div>
                    <a href="https://www.facebook.com/share/18pN5KsRwf/" target="_blank" rel="noopener" className="contact-info-value" style={{ color: 'var(--link)' }}>
                      Sambha Creation
                    </a>
                  </div>
                </div>
                <div className="contact-info-item">
                  <span className="contact-info-icon">▶️</span>
                  <div>
                    <div className="contact-info-label">YouTube</div>
                    <a href="https://youtube.com/@sambhaanimation" target="_blank" rel="noopener" className="contact-info-value" style={{ color: 'var(--link)' }}>
                      Sambha Creation
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <ContactForm />
          </div>
        </div>
      </main>

      <FooterMinimal />
      <BackToTop />
    </>
  );
}
