'use client';

import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { GlassCard } from '@/components/ui/GlassCard';
import { Icon } from '@/components/ui/Icon';
import { ExpenseItem } from '@/components/receipt/ExpenseItem';
import { FAB } from '@/components/shell/FAB';
import { BodyClass } from '@/components/shell/BodyClass';
import { formatCurrency } from '@/lib/format';
import type { Category, Expense } from '@/types';

type Filter = 'ALL' | 'WEEK' | 'MONTH' | 'PREV_MONTH' | Category;

const FILTER_OPTIONS: { value: Filter; label: string }[] = [
  { value: 'ALL', label: 'Tudo' },
  { value: 'WEEK', label: 'Esta semana' },
  { value: 'MONTH', label: 'Este mês' },
  { value: 'PREV_MONTH', label: 'Mês passado' },
  { value: 'FOOD', label: 'Alimentação' },
  { value: 'TRANSPORT', label: 'Transporte' },
  { value: 'SOFTWARE', label: 'Software' },
  { value: 'SUPPLIES', label: 'Suprimentos' },
  { value: 'UTILITIES', label: 'Contas' },
  { value: 'SERVICES', label: 'Serviços' },
];

export function HistoryClient({ initialExpenses }: { initialExpenses: Expense[] }) {
  const [filter, setFilter] = useState<Filter>('MONTH');

  const filtered = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPrev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPrev = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    return initialExpenses.filter((e) => {
      // Time-range filters use createdAt (scan date) so a receipt scanned today
      // always appears under "Este mês" regardless of the date printed on the receipt.
      const d = new Date(e.createdAt);
      switch (filter) {
        case 'ALL': return true;
        case 'WEEK': return d >= startOfWeek;
        case 'MONTH': return d >= startOfMonth;
        case 'PREV_MONTH': return d >= startOfPrev && d <= endOfPrev;
        default: return e.category === filter;
      }
    });
  }, [initialExpenses, filter]);

  const monthTotal = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    const current = initialExpenses
      .filter((e) => new Date(e.createdAt) >= startOfMonth)
      .reduce((s, e) => s + Number(e.amount), 0);
    const previous = initialExpenses
      .filter((e) => {
        const d = new Date(e.createdAt);
        return d >= prevStart && d <= prevEnd;
      })
      .reduce((s, e) => s + Number(e.amount), 0);
    const delta = previous > 0 ? Math.round(((current - previous) / previous) * 100) : 0;
    return { current, delta };
  }, [initialExpenses]);

  return (
    <div className="space-y-6 animate-fade-in">
      <BodyClass className="bg-history" />

      <section>
        <h1 className="font-sora text-headline-md md:text-headline-lg">Histórico</h1>
        <p className="text-on-surface-variant mt-1">Tudo que a IA registrou para você.</p>
      </section>

      <GlassCard radius="4xl" className="p-6 bg-gradient-to-br from-white/70 to-primary-container/20">
        <p className="font-grotesk text-[10px] uppercase tracking-[0.18em] text-primary">
          Total deste mês
        </p>
        <div className="flex items-end justify-between mt-2 flex-wrap gap-3">
          <p className="font-sora text-3xl md:text-headline-lg font-semibold text-primary tabular-nums">
            {formatCurrency(monthTotal.current)}
          </p>
          {monthTotal.delta !== 0 && (
            <span
              className={clsx(
                'inline-flex items-center gap-1 font-grotesk text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-full',
                monthTotal.delta > 0
                  ? 'bg-tertiary-container/60 text-tertiary-on-container'
                  : 'bg-primary-container text-primary-on-container',
              )}
            >
              <Icon name={monthTotal.delta > 0 ? 'trending_up' : 'trending_down'} size={14} />
              {monthTotal.delta > 0 ? '+' : ''}
              {monthTotal.delta}% vs mês anterior
            </span>
          )}
        </div>
      </GlassCard>

      <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-5 px-5 md:mx-0 md:px-0 md:flex-wrap">
        {FILTER_OPTIONS.map((opt) => {
          const active = filter === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={clsx(
                'shrink-0 px-4 py-2 rounded-full font-grotesk text-[11px] uppercase tracking-wider transition',
                active
                  ? 'bg-primary text-primary-on shadow-liquid'
                  : 'glass text-on-surface-variant hover:text-primary',
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <GlassCard radius="4xl" className="p-10 text-center">
          <Icon name="receipt_long" size={40} className="text-outline mb-3 inline-block" />
          <p className="font-sora text-lg">Nada por aqui ainda</p>
          <p className="text-on-surface-variant text-sm mt-1">
            {filter === 'ALL'
              ? 'Escaneie seu primeiro recibo para começar.'
              : 'Nenhum gasto bate com esse filtro.'}
          </p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {filtered.map((e) => (
            <ExpenseItem key={e.id} expense={e} href={`/history/${e.id}`} />
          ))}
        </div>
      )}

      <FAB />
    </div>
  );
}
