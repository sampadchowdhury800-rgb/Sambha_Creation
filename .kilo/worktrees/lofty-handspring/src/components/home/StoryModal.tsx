'use client';

/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Story Submission Modal
   Pixel-perfect replica of original story-modal
   ══════════════════════════════════════════════════════════════ */

import { useState, useRef } from 'react';
import { showToast } from '@/components/ui/Toast';

interface StoryModalProps {
  open: boolean;
  onClose: () => void;
}

export default function StoryModal({ open, onClose }: StoryModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const name = (formRef.current.querySelector('#story-name') as HTMLInputElement)?.value.trim();
    const email = (formRef.current.querySelector('#story-email') as HTMLInputElement)?.value.trim();

    if (!name || !email) {
      showToast('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData(formRef.current);
      await fetch('https://formsubmit.co/sambha.creation.work@gmail.com', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setTimeout(() => {
          formRef.current?.reset();
          setSubmitted(false);
          setSubmitting(false);
        }, 400);
      }, 3000);
    } catch {
      setSubmitting(false);
      showToast('Something went wrong. Please try again.');
    }
  };

  if (!open) return null;

  return (
    <div id="story-modal" className="story-modal active">
      <div className="story-modal-backdrop" onClick={onClose}></div>
      <div className="story-modal-panel" role="dialog" aria-modal="true">
        <div className="story-modal-header">
          <h2 className="story-modal-title">Share Your Story</h2>
          <button className="story-modal-close" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {!submitted ? (
          <form
            ref={formRef}
            id="story-form"
            className="story-form"
            onSubmit={handleSubmit}
            style={submitting ? { opacity: 0.6, pointerEvents: 'none' } : undefined}
          >
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_subject" value="New Story Submission — Sambha Creation" />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="_autoresponse" value="Thank you for sharing your story with us. We have received your submission." />
            <input type="text" name="_honey" style={{ display: 'none' }} />

            <div className="form-group">
              <label htmlFor="story-name">Name</label>
              <input type="text" id="story-name" name="name" required placeholder="Your Name" />
            </div>
            <div className="form-group">
              <label htmlFor="story-insta">Insta Handle</label>
              <input type="text" id="story-insta" name="instagram_handle" placeholder="@yourhandle" />
            </div>
            <div className="form-group">
              <label htmlFor="story-email">Email Address</label>
              <input type="email" id="story-email" name="email" required placeholder="you@example.com" />
            </div>
            <div className="form-group">
              <label htmlFor="story-text">Story</label>
              <textarea id="story-text" name="story" required placeholder="Write your story or attach links here..." rows={4}></textarea>
            </div>
            <button
              type="submit"
              id="story-submit-btn"
              className="btn btn-primary btn-ripple"
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={submitting}
            >
              {submitting ? 'Sending…' : 'Send Story'}
            </button>
          </form>
        ) : (
          <div id="story-success" style={{ textAlign: 'center', padding: '32px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
            <h3 style={{ color: 'var(--wheat)', marginBottom: '12px' }}>Story Submitted!</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Thank you for sharing. We&apos;ll review your story and get back to you soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
