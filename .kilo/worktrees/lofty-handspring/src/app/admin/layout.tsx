/* ══════════════════════════════════════════════════════════════
   SAMBHA CREATION — Admin Layout (Protected)
   All /admin/* routes are protected by middleware
   ══════════════════════════════════════════════════════════════ */

import Link from 'next/link';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminLogout from './AdminLogout';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/secure-admin-login');
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--ocean-deep)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        background: 'var(--glass)',
        borderRight: '1px solid var(--glass-border)',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
      }}>
        <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', textDecoration: 'none' }}>
          <img src="/assets/logo.png" alt="" width={36} height={36} style={{ borderRadius: '8px' }} />
          <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '800', fontSize: '1rem', color: 'var(--wheat)' }}>Admin Panel</span>
        </Link>

        <nav style={{ flex: 1 }}>
          <div style={{ marginBottom: '8px', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 12px' }}>Content</div>
          <Link href="/admin" className="mobile-nav-link" style={{ marginBottom: '2px' }}>📊 Dashboard</Link>
          <Link href="/admin/articles" className="mobile-nav-link" style={{ marginBottom: '2px' }}>📰 Articles</Link>
          <Link href="/admin/articles/new" className="mobile-nav-link" style={{ marginBottom: '2px' }}>✍️ New Article</Link>

          <div style={{ margin: '16px 0 8px', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 12px' }}>Manage</div>
          <Link href="/admin/categories" className="mobile-nav-link" style={{ marginBottom: '2px' }}>🏷️ Categories</Link>
          <Link href="/admin/tags" className="mobile-nav-link" style={{ marginBottom: '2px' }}>🔖 Tags</Link>

          <div style={{ margin: '16px 0 8px', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 12px' }}>View</div>
          <a href="/" target="_blank" className="mobile-nav-link" style={{ marginBottom: '2px' }}>🌐 View Website</a>
        </nav>

        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '16px', marginTop: '16px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px', padding: '0 12px' }}>
            {session.user.email}
          </div>
          <AdminLogout />
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
