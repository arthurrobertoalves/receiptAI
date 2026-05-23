import type { Category } from '@/types';

export function formatCurrency(value: number, currency = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatShortDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  const date = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export const CATEGORY_LABELS: Record<Category, string> = {
  FOOD: 'Alimentação',
  TRANSPORT: 'Transporte',
  SUPPLIES: 'Suprimentos',
  SOFTWARE: 'Software',
  UTILITIES: 'Contas & Utilidades',
  SERVICES: 'Serviços',
  OTHER: 'Outros',
};

export const CATEGORY_ICONS: Record<Category, string> = {
  FOOD: 'restaurant',
  TRANSPORT: 'local_gas_station',
  SUPPLIES: 'inventory_2',
  SOFTWARE: 'cloud',
  UTILITIES: 'bolt',
  SERVICES: 'handyman',
  OTHER: 'category',
};

export const CATEGORY_TONE: Record<Category, { bg: string; text: string }> = {
  FOOD: { bg: 'bg-primary-container/40', text: 'text-primary-on-container' },
  TRANSPORT: { bg: 'bg-secondary-container/60', text: 'text-secondary-on-container' },
  SUPPLIES: { bg: 'bg-primary-container/30', text: 'text-primary-on-container' },
  SOFTWARE: { bg: 'bg-primary-container/30', text: 'text-primary-on-container' },
  UTILITIES: { bg: 'bg-tertiary-container/40', text: 'text-tertiary-on-container' },
  SERVICES: { bg: 'bg-secondary-container/50', text: 'text-secondary-on-container' },
  OTHER: { bg: 'bg-surface-container-high', text: 'text-on-surface-variant' },
};
