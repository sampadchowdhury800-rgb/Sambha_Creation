'use client';

/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Hidden Admin Login Page
   Route: /secure-admin-login (no visible links)
   ══════════════════════════════════════════════════════════════ */

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password.');
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'var(--ocean-deep)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: 'var(--glass)',
        backdropFilter: 'var(--blur)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--r-lg)',
        padding: '40px 32px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img src="/assets/logo.png" alt="" width={48} height={48} style={{ margin: '0 auto 16px', borderRadius: '8px' }} />
          <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--wheat)', fontFamily: 'Poppins, sans-serif' }}>
            Admin Login
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Sambha Creation Dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              padding: '12px 16px',
              borderRadius: '8px',
              background: 'rgba(196, 106, 74, 0.15)',
              border: '1px solid rgba(196, 106, 74, 0.3)',
              color: 'var(--danger)',
              fontSize: '0.85rem',
              marginBottom: '20px',
            }}>
              {error}
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label htmlFor="login-email" style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
              Email
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@sambhacreation.com"
              autoComplete="email"
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '12px',
                border: '1px solid var(--glass-border)', background: 'var(--glass)',
                color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none',
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label htmlFor="login-password" style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              autoComplete="current-password"
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '12px',
                border: '1px solid var(--glass-border)', background: 'var(--glass)',
                color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '14px 24px' }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
