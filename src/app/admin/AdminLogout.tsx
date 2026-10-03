'use client';

import { signOut } from 'next-auth/react';

export default function AdminLogout() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="btn btn-ghost"
      style={{ width: '100%', justifyContent: 'center', fontSize: '0.82rem' }}
    >
      🚪 Sign Out
    </button>
  );
}
