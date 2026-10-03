'use client';

/* Copyright year - client component to avoid hydration mismatch */
export default function CopyrightYear() {
  return <span id="year">{new Date().getFullYear()}</span>;
}
