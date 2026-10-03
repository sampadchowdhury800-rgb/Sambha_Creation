'use client';

/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Navbar
   Pixel-perfect replica of the original navbar
   ══════════════════════════════════════════════════════════════ */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from '@/components/ui/ThemeToggle';
import SearchBar from '@/components/search/SearchBar';
import MobileNav from './MobileNav';
import type { NewsCardData } from '@/types';

interface NavbarProps {
  showSearch?: boolean;
  newsData?: NewsCardData[];
}

export default function Navbar({ showSearch = false, newsData = [] }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const toggleMobile = () => {
    const next = !mobileOpen;
    setMobileOpen(next);
    document.body.style.overflow = next ? 'hidden' : '';
  };

  const closeMobile = () => {
    setMobileOpen(false);
    document.body.style.overflow = '';
  };

  return (
    <>
      <header className={`navbar${scrolled ? ' scrolled' : ''}`} role="banner">
        <div className="nav-inner">
          {/* Logo */}
          <Link href="/" className="nav-logo" aria-label="Sambha Creation Home">
            <img src="/assets/logo.png" alt="Sambha Creation logo" width={44} height={44} />
            <span className="nav-logo-text">Sambha Creation</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="nav-links" role="navigation" aria-label="Main navigation">
            <Link href="/" className={`nav-link${isActive('/') && pathname === '/' ? ' active' : ''}`}>Home</Link>
            <Link href="/latest" className={`nav-link${isActive('/latest') ? ' active' : ''}`}>Latest News</Link>
            <Link href="/#categories" className="nav-link">Categories</Link>
            <Link href="/#videos" className="nav-link">Videos</Link>

            {/* Social Media Dropdown */}
            <div className="nav-social">
              <button className="nav-link" aria-haspopup="true" aria-expanded="false">
                Social Media
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              <div className="social-dropdown" role="menu" aria-label="Social media links">
                <div className="social-group">
                  <div className="social-group-title">INSTAGRAM</div>
                  <a href="https://www.instagram.com/_sambha_creation" target="_blank" rel="noopener noreferrer" className="social-dropdown-item" role="menuitem">
                    <svg className="social-icon-outline insta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    _sambha_creation
                  </a>
                </div>
                <div className="social-group">
                  <div className="social-group-title">FACEBOOK</div>
                  <a href="https://www.facebook.com/SambhaCreation" target="_blank" rel="noopener noreferrer" className="social-dropdown-item" role="menuitem">
                    <svg className="social-icon-outline fb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    Sambha Creation
                  </a>
                </div>
                <div className="social-group">
                  <div className="social-group-title">YOUTUBE</div>
                  <a href="https://www.youtube.com/@sambhaanimation" target="_blank" rel="noopener noreferrer" className="social-dropdown-item" role="menuitem">
                    <svg className="social-icon-outline yt-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                    Sambha Creation
                  </a>
                </div>
              </div>
            </div>

            <Link href="/about" className={`nav-link${isActive('/about') ? ' active' : ''}`}>About Us</Link>
            <Link href="/contact" className={`nav-link${isActive('/contact') ? ' active' : ''}`}>Contact Us</Link>
          </nav>

          {/* Nav Actions */}
          <div className="nav-actions">
            {showSearch && <SearchBar newsData={newsData} />}
            <ThemeToggle />
            {/* Hamburger (Mobile) */}
            <button
              id="hamburger"
              className={`hamburger${mobileOpen ? ' open' : ''}`}
              aria-label={mobileOpen ? 'Close mobile menu' : 'Open mobile menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              onClick={toggleMobile}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={closeMobile} />
    </>
  );
}
