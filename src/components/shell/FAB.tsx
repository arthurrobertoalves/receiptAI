'use client';

import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

export function FAB() {
  return (
    <Link
      href="/scan"
      className="md:hidden fixed bottom-28 right-6 z-40 w-16 h-16 rounded-3xl bg-primary text-primary-on flex items-center justify-center shadow-liquid-strong hover:scale-110 active:scale-90 transition-transform"
      aria-label="Escanear recibo"
    >
      <Icon name="camera_enhance" filled size={28} />
    </Link>
  );
}
