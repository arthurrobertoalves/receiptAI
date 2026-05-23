'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onClick() {
    setLoading(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-error-container text-error-on-container font-semibold hover:scale-105 active:scale-95 transition disabled:opacity-60"
    >
      <Icon name="logout" size={18} />
      {loading ? 'Saindo...' : 'Sair'}
    </button>
  );
}
