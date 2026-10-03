/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Privacy Policy Page
   ══════════════════════════════════════════════════════════════ */

import type { Metadata } from 'next';
import Link from 'next/link';
import AmbientCanvas from '@/components/layout/AmbientCanvas';
import Navbar from '@/components/layout/Navbar';
import FooterMinimal from '@/components/layout/FooterMinimal';
import BackToTop from '@/components/layout/BackToTop';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Sambha Creation — how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <>
      <AmbientCanvas />
      <Navbar />
      <main>
        <section className="page-hero">
          <div className="container">
            <div className="hero-badge" style={{ marginBottom: '24px' }}><span className="hero-badge-dot"></span> Legal</div>
            <h1 className="page-hero-title">Privacy Policy</h1>
            <p className="page-hero-sub">Last updated: July 2026. We take your privacy seriously — here&apos;s exactly how we handle your data.</p>
          </div>
        </section>
        <div className="container">
          <div className="static-page-content reveal revealed">
            <h2>1. Information We Collect</h2>
            <p>Sambha Creation is committed to protecting your privacy. We collect only the minimum information necessary to provide you with the best possible experience on our platform.</p>
            <p>We may collect the following types of information:</p>
            <ul>
              <li><strong>Usage Data:</strong> Pages visited, time spent, browser type, and general geographic region (country/city level only).</li>
              <li><strong>Contact Form Data:</strong> If you submit our contact form, we collect your name, email address, and message content.</li>
              <li><strong>Device Information:</strong> General device type (mobile/desktop) for responsive design optimization.</li>
              <li><strong>Preferences:</strong> Theme preference (dark/light mode), stored locally in your browser&apos;s localStorage — never sent to our servers.</li>
            </ul>
            <h2>2. How We Use Your Information</h2>
            <p>We use collected information solely for the following purposes:</p>
            <ul>
              <li>To respond to contact form inquiries</li>
              <li>To improve the quality and performance of our website</li>
              <li>To understand how readers engage with our content</li>
              <li>To ensure the website functions correctly on your device</li>
            </ul>
            <p>We <strong>do not</strong> sell, trade, or transfer your personal information to third parties.</p>
            <h2>3. Cookies &amp; Local Storage</h2>
            <p>Our website uses browser localStorage (not cookies) to store your theme preference. This data never leaves your device.</p>
            <h2>4. Third-Party Links</h2>
            <p>Our website contains links to third-party platforms including Instagram, Facebook, and YouTube. When you click these links, you leave our website and are subject to those platforms&apos; own privacy policies.</p>
            <h2>5. Data Retention</h2>
            <p>Contact form submissions are retained for a maximum of 12 months and are then permanently deleted.</p>
            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Request access to any personal data we hold about you</li>
              <li>Request correction or deletion of your data</li>
              <li>Withdraw consent to data processing at any time</li>
              <li>Lodge a complaint with your local data protection authority</li>
            </ul>
            <h2>7. Children&apos;s Privacy</h2>
            <p>Our website is not directed at children under the age of 13.</p>
            <h2>8. Security</h2>
            <p>We implement industry-standard security measures to protect any data we process. Our website is served over HTTPS.</p>
            <h2>9. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Any changes will be reflected on this page with an updated date.</p>
            <h2>10. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please reach out via our <Link href="/contact">Contact page</Link> or through our social media channels.</p>
          </div>
        </div>
      </main>
      <FooterMinimal />
      <BackToTop />
    </>
  );
}
