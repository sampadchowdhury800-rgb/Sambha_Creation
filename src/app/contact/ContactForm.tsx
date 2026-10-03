'use client';

/* ══════════════════════════════════════════════════════════════
   Contact Form — FormSubmit.co integration preserved exactly
   ══════════════════════════════════════════════════════════════ */

import { useState, useRef } from 'react';
import { showToast } from '@/components/ui/Toast';
import Toast from '@/components/ui/Toast';

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    setSubmitting(true);

    try {
      const formData = new FormData(formRef.current);
      await fetch('https://formsubmit.co/sambha.creation.work@gmail.com', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });
      setSubmitted(true);
      formRef.current.reset();
    } catch {
      showToast('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="contact-form-wrapper">
        {!submitted ? (
          <form
            ref={formRef}
            className="contact-form"
            onSubmit={handleSubmit}
          >
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_subject" value="New Contact — Sambha Creation" />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="_autoresponse" value="Thank you for contacting Sambha Creation. We have received your message and will respond shortly." />
            <input type="text" name="_honey" style={{ display: 'none' }} />

            <div className="form-group">
              <label htmlFor="contact-name">Name</label>
              <input type="text" id="contact-name" name="name" required placeholder="Your Name" />
            </div>
            <div className="form-group">
              <label htmlFor="contact-email">Email</label>
              <input type="email" id="contact-email" name="email" required placeholder="you@example.com" />
            </div>
            <div className="form-group">
              <label htmlFor="contact-subject">Subject</label>
              <input type="text" id="contact-subject" name="subject" required placeholder="What's this about?" />
            </div>
            <div className="form-group">
              <label htmlFor="contact-message">Message</label>
              <textarea id="contact-message" name="message" required placeholder="Write your message here..." rows={5}></textarea>
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-ripple"
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={submitting}
            >
              {submitting ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
            <h3 style={{ color: 'var(--wheat)', marginBottom: '12px' }}>Message Sent!</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Thank you for reaching out. We&apos;ll get back to you soon.
            </p>
          </div>
        )}
      </div>
      <Toast />
    </>
  );
}
