'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Icon } from '@/components/ui/Icon';

type NavItem = { href: string; icon: string; label: string; central?: boolean };

const ITEMS: NavItem[] = [
  { href: '/dashboard', icon: 'dashboard', label: 'Início' },
  { href: '/history', icon: 'receipt_long', label: 'Histórico' },
  { href: '/scan', icon: 'camera_enhance', label: 'Scan', central: true },
  { href: '/insights', icon: 'analytics', label: 'Insights' },
  { href: '/settings', icon: 'settings', label: 'Ajustes' },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md h-20 glass-strong rounded-full px-3 flex items-center justify-between shadow-liquid">
      {ITEMS.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + '/');
        if (item.central) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="-mt-8 w-14 h-14 rounded-full bg-primary text-primary-on flex items-center justify-center shadow-liquid-strong border-4 border-white/70 hover:scale-105 active:scale-95 transition-transform"
              aria-label={item.label}
            >
              <Icon name={item.icon} filled />
            </Link>
          );
        }
        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'flex flex-col items-center justify-center gap-0.5 rounded-full px-3 py-2 transition-all',
              active
                ? 'bg-primary-container text-primary-on-container scale-105'
                : 'text-on-surface-variant hover:text-primary',
            )}
            aria-current={active ? 'page' : undefined}
          >
            <Icon name={item.icon} filled={active} size={22} />
            <span className="font-grotesk text-[10px] uppercase tracking-wider">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
