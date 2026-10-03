'use client';

/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Hero Section (Homepage)
   Pixel-perfect replica of original hero
   ══════════════════════════════════════════════════════════════ */

import { useState } from 'react';
import StoryModal from './StoryModal';

export default function Hero() {
  const [storyModalOpen, setStoryModalOpen] = useState(false);

  return (
    <>
      <section className="hero" aria-label="Welcome to Sambha Creation">
        <div className="hero-content">
          <h1 className="hero-headline">
            Want to join the<br />Sambha Creation Family?
          </h1>
          <p className="hero-sub">
            We will share your story with a proper credit.
          </p>
          <div className="hero-actions">
            <button
              onClick={() => setStoryModalOpen(true)}
              className="btn btn-primary btn-ripple"
            >
              Share Your Story
            </button>
          </div>
        </div>
      </section>

      <StoryModal open={storyModalOpen} onClose={() => setStoryModalOpen(false)} />
    </>
  );
}
