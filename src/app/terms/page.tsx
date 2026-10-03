/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Terms & Conditions Page
   ══════════════════════════════════════════════════════════════ */

import type { Metadata } from 'next';
import Link from 'next/link';
import AmbientCanvas from '@/components/layout/AmbientCanvas';
import Navbar from '@/components/layout/Navbar';
import FooterMinimal from '@/components/layout/FooterMinimal';
import BackToTop from '@/components/layout/BackToTop';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and Conditions for using Sambha Creation — read our user agreement, intellectual property, and usage guidelines.',
};

export default function TermsPage() {
  return (
    <>
      <AmbientCanvas />
      <Navbar />
      <main>
        <section className="page-hero">
          <div className="container">
            <div className="hero-badge" style={{ marginBottom: '24px' }}><span className="hero-badge-dot"></span> Legal</div>
            <h1 className="page-hero-title">Terms &amp; Conditions</h1>
            <p className="page-hero-sub">Last updated: July 2026. Please read these terms carefully before using our website.</p>
          </div>
        </section>
        <div className="container">
          <div className="static-page-content reveal revealed">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using Sambha Creation, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our website.</p>
            <h2>2. Intellectual Property</h2>
            <p>All content published on Sambha Creation — including text, images, graphics, logos, and design elements — is the property of Sambha Creation unless otherwise stated. You may not reproduce, distribute, or republish any content without prior written permission.</p>
            <h2>3. User Conduct</h2>
            <p>When interacting with our platform, you agree to:</p>
            <ul>
              <li>Not submit false, misleading, or defamatory content</li>
              <li>Not engage in any activity that disrupts the functioning of the website</li>
              <li>Comply with all applicable local, national, and international laws</li>
            </ul>
            <h2>4. User Submissions</h2>
            <p>If you submit a story or message through our forms, you grant Sambha Creation a non-exclusive, royalty-free right to use, edit, and publish the content with appropriate credit.</p>
            <h2>5. Disclaimer of Warranties</h2>
            <p>Our website and its content are provided &quot;as is&quot; without warranty of any kind. We do not guarantee the accuracy, completeness, or timeliness of any information published.</p>
            <h2>6. Limitation of Liability</h2>
            <p>Sambha Creation shall not be liable for any direct, indirect, or consequential damages arising from the use or inability to use our website.</p>
            <h2>7. Third-Party Links</h2>
            <p>Our website may contain links to external sites. We are not responsible for the content, privacy practices, or availability of those sites.</p>
            <h2>8. Modifications</h2>
            <p>We reserve the right to modify these Terms at any time. Changes take effect immediately upon posting. Continued use of the website constitutes acceptance of the revised terms.</p>
            <h2>9. Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of India.</p>
            <h2>10. Contact</h2>
            <p>For questions about these Terms, please visit our <Link href="/contact">Contact page</Link>.</p>
          </div>
        </div>
      </main>
      <FooterMinimal />
      <BackToTop />
    </>
  );
}
