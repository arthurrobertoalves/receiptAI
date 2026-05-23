'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { Icon } from '@/components/ui/Icon';
import type { PublicUser } from '@/types';

const ITEMS = [
  { href: '/dashboard', icon: 'dashboard', label: 'Início' },
  { href: '/history', icon: 'receipt_long', label: 'Histórico' },
  { href: '/scan', icon: 'camera_enhance', label: 'Escanear' },
  { href: '/insights', icon: 'analytics', label: 'Insights' },
  { href: '/settings', icon: 'settings', label: 'Ajustes' },
] as const;

export function DesktopSidebar({ user }: { user: PublicUser }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-72 z-30 flex-col pt-24 pb-10 px-6">
      <div className="glass-strong rounded-4xl flex-1 flex flex-col p-5">
        <div className="px-2 mb-6">
          <p className="font-grotesk text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">
            Conta
          </p>
          <p className="font-sora font-semibold text-on-surface mt-1 truncate">{user.name}</p>
          <p className="text-sm text-on-surface-variant truncate">{user.email}</p>
        </div>
        <nav className="flex-1 flex flex-col gap-1.5">
          {ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-2xl transition-all',
                  active
                    ? 'bg-primary text-primary-on shadow-liquid'
                    : 'text-on-surface-variant hover:bg-white/40 hover:text-primary',
                )}
              >
                <Icon name={item.icon} filled={active} size={20} />
                <span
                  className={clsx(
                    'font-manrope font-medium',
                    active ? 'text-primary-on' : 'text-on-surface',
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
        <button
          onClick={logout}
          className="mt-6 flex items-center gap-3 px-4 py-3 rounded-2xl text-on-surface-variant hover:bg-white/40 hover:text-error transition-all"
        >
          <Icon name="logout" size={20} />
          <span className="font-manrope font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
}
