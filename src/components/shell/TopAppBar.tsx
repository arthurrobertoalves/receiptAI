'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import type { PublicUser } from '@/types';

interface TopAppBarProps {
  user: PublicUser;
  back?: { href: string; label?: string } | null;
}

export function TopAppBar({ user, back }: TopAppBarProps) {
  const router = useRouter();
  const initial = (user.name?.[0] ?? 'U').toUpperCase();

  return (
    <header
      className="fixed top-0 inset-x-0 z-40 h-16 px-5 md:px-10 flex items-center justify-between glass-panel border-b border-white/20"
      style={{ backdropFilter: 'blur(24px)' }}
    >
      <div className="flex items-center gap-3">
        {back ? (
          <button
            type="button"
            onClick={() => router.push(back.href)}
            className="w-10 h-10 rounded-full glass flex items-center justify-center text-primary hover:scale-105 transition-transform"
            aria-label="Voltar"
          >
            <Icon name="arrow_back" />
          </button>
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary text-primary-on flex items-center justify-center font-sora font-semibold text-sm shadow-glass">
            {initial}
          </div>
        )}
        <Link href="/dashboard" className="font-sora font-bold text-lg text-primary tracking-tight">
          Receipt<span className="text-on-surface">AI</span>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="w-10 h-10 rounded-full glass flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
          aria-label="Notificações"
        >
          <Icon name="notifications" />
        </button>
      </div>
    </header>
  );
}
