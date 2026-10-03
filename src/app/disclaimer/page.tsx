/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Disclaimer Page
   ══════════════════════════════════════════════════════════════ */

import type { Metadata } from 'next';
import Link from 'next/link';
import AmbientCanvas from '@/components/layout/AmbientCanvas';
import Navbar from '@/components/layout/Navbar';
import FooterMinimal from '@/components/layout/FooterMinimal';
import BackToTop from '@/components/layout/BackToTop';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Disclaimer for Sambha Creation — important information about our content and editorial practices.',
};

export default function DisclaimerPage() {
  return (
    <>
      <AmbientCanvas />
      <Navbar />
      <main>
        <section className="page-hero">
          <div className="container">
            <div className="hero-badge" style={{ marginBottom: '24px' }}><span className="hero-badge-dot"></span> Legal</div>
            <h1 className="page-hero-title">Disclaimer</h1>
            <p className="page-hero-sub">Important information about our content and editorial practices.</p>
          </div>
        </section>
        <div className="container">
          <div className="static-page-content reveal revealed">
            <h2>1. General Information</h2>
            <p>The information provided by Sambha Creation is for general informational and educational purposes only. All content is published in good faith and for general awareness.</p>
            <h2>2. Not Professional Advice</h2>
            <p>Our content does not constitute legal, financial, medical, or any other form of professional advice. Always seek the guidance of qualified professionals for specific concerns.</p>
            <h2>3. Accuracy of Information</h2>
            <p>While we strive for accuracy, Sambha Creation makes no representation or warranty of any kind about the completeness, accuracy, reliability, or availability of the information on this website.</p>
            <h2>4. External Links</h2>
            <p>Our website may contain links to external websites not controlled by us. We have no control over the content, nature, or availability of those sites and inclusion does not imply endorsement.</p>
            <h2>5. Fair Use</h2>
            <p>Some content may include images, quotes, or references sourced from publicly available material. Such content is used under fair use principles for commentary, criticism, education, and reporting purposes.</p>
            <h2>6. User-Generated Content</h2>
            <p>Stories or messages submitted by users reflect the views and opinions of the individual submitters and not necessarily of Sambha Creation.</p>
            <h2>7. Changes</h2>
            <p>This Disclaimer may be updated from time to time. Continued use of the website constitutes acceptance of any changes.</p>
            <h2>8. Contact</h2>
            <p>If you have questions about this Disclaimer, please reach out through our <Link href="/contact">Contact page</Link>.</p>
          </div>
        </div>
      </main>
      <FooterMinimal />
      <BackToTop />
    </>
  );
}
