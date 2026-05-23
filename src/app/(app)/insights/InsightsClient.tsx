'use client';

import { useMemo } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Icon } from '@/components/ui/Icon';
import { BodyClass } from '@/components/shell/BodyClass';
import { CATEGORY_ICONS, CATEGORY_LABELS, formatCurrency } from '@/lib/format';
import type { Category, Expense } from '@/types';

interface Summary {
  currentMonth: { total: number; deltaPercent: number; deltaDirection: 'up' | 'down' | 'flat' };
  previousMonth: { total: number };
  byCategory: { category: Category; total: number }[];
  monthlyHistory: { key: string; total: number }[];
  taxForecast: { amount: number; percentOfLimit: number };
  totalCount: number;
}

const MONTH_LABELS_PT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function monthLabelFromKey(key: string) {
  const [, m] = key.split('-');
  return MONTH_LABELS_PT[parseInt(m, 10) - 1] ?? key;
}

function exportCSV(expenses: Expense[]) {
  const CATEGORY_PT: Record<string, string> = {
    FOOD: 'Alimentação', TRANSPORT: 'Transporte', SUPPLIES: 'Suprimentos',
    SOFTWARE: 'Software', UTILITIES: 'Contas', SERVICES: 'Serviços', OTHER: 'Outros',
  };
  const rows = [
    ['Data', 'Estabelecimento', 'Categoria', 'Valor', 'Moeda', 'Confirmado'],
    ...expenses.map((e) => [
      e.expenseDate ?? e.createdAt.slice(0, 10),
      e.merchant,
      CATEGORY_PT[e.category] ?? e.category,
      e.amount.toFixed(2).replace('.', ','),
      e.currency,
      e.confirmed ? 'Sim' : 'Não',
    ]),
  ];
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\r\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `receiptai-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function InsightsClient({ summary, expenses }: { summary: Summary; expenses: Expense[] }) {
  // Explicitly coerce totals to numbers in case server serialised as string (Supabase numeric → JSON string)
  const safeHistory = useMemo(
    () => summary.monthlyHistory.map((m) => ({ ...m, total: Number(m.total) || 0 })),
    [summary.monthlyHistory],
  );

  const maxMonth = useMemo(
    () => Math.max(...safeHistory.map((m) => m.total), 1),
    [safeHistory],
  );

  const hasData = summary.totalCount > 0;
  const headline =
    summary.previousMonth.total > 0
      ? `Seus gastos ${summary.currentMonth.deltaDirection === 'down' ? 'reduziram' : 'cresceram'} ${Math.abs(summary.currentMonth.deltaPercent)}% em relação ao mês anterior.`
      : 'Continue escaneando para destravar insights mensais.';

  return (
    <div className="space-y-6 animate-fade-in">
      <BodyClass className="bg-insights" />

      <section>
        <h1 className="font-sora text-headline-md md:text-headline-lg">Relatórios mensais</h1>
        <p className="text-on-surface-variant mt-1">
          Uma visão detalhada da sua saúde financeira.
        </p>
      </section>

      {/* HERO */}
      <GlassCard radius="4xl" className="p-6 md:p-8 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full bg-primary-container/40 blur-3xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container text-primary-on-container font-grotesk text-[10px] uppercase tracking-wider">
            <Icon name="auto_awesome" filled size={14} /> Insight do mês
          </span>
          <h2 className="font-sora text-2xl md:text-3xl mt-3 text-balance leading-tight">
            {headline}
          </h2>
          {hasData && (
            <p className="text-on-surface-variant mt-3">
              Mês atual:{' '}
              <strong className="text-primary">{formatCurrency(Number(summary.currentMonth.total))}</strong>{' '}
              · Mês anterior:{' '}
              <strong>{formatCurrency(Number(summary.previousMonth.total))}</strong>
            </p>
          )}
        </div>
      </GlassCard>

      {/* COMPARATIVO */}
      <GlassCard radius="4xl" className="p-6">
        <div className="flex items-baseline justify-between flex-wrap gap-2 mb-5">
          <h3 className="font-sora text-xl">Últimos 6 meses</h3>
          <div className="flex gap-3 text-xs text-on-surface-variant">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-primary inline-block" /> Atual
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-primary/40 inline-block" /> Anterior
            </span>
          </div>
        </div>
        {safeHistory.every((m) => m.total === 0) ? (
          <div className="h-48 flex flex-col items-center justify-center text-on-surface-variant gap-2">
            <Icon name="bar_chart" size={36} className="text-outline" />
            <p className="text-sm">Nenhum gasto registrado ainda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-6 gap-2 items-end h-48">
            {safeHistory.map((m, i) => {
              const isCurrent = i === safeHistory.length - 1;
              const h = Math.max(8, Math.round((m.total / maxMonth) * 100));
              return (
                <div key={m.key} className="flex flex-col items-center gap-1">
                  <span className={`font-grotesk text-[9px] tabular-nums ${isCurrent ? 'text-primary font-semibold' : 'text-on-surface-variant'}`}>
                    {m.total > 0 ? formatCurrency(m.total).replace('R$ ', '') : ''}
                  </span>
                  <div className="w-full flex-1 flex items-end relative rounded-xl bg-primary-container/30 overflow-hidden">
                    <div
                      className={`w-full rounded-t-xl transition-all duration-500 ${
                        isCurrent ? 'bg-primary shadow-liquid-glow' : 'bg-primary/40'
                      }`}
                      style={{ height: `${h}%` }}
                      title={formatCurrency(m.total)}
                    />
                  </div>
                  <span className={`font-grotesk text-[10px] uppercase tracking-wider ${isCurrent ? 'text-primary font-semibold' : 'text-on-surface-variant'}`}>
                    {monthLabelFromKey(m.key)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>

      {/* CATEGORIES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {summary.byCategory.length === 0 ? (
          <GlassCard radius="4xl" className="md:col-span-3 p-8 text-center">
            <Icon name="category" size={32} className="text-outline mb-2 inline-block" />
            <p className="text-on-surface-variant">
              Sem gastos categorizados este mês ainda.
            </p>
          </GlassCard>
        ) : (
          summary.byCategory.slice(0, 6).map((c) => (
            <GlassCard
              key={c.category}
              radius="4xl"
              className="p-5 flex items-center gap-4 hover:translate-x-1 transition-transform cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary-container/40 text-primary flex items-center justify-center shrink-0">
                <Icon name={CATEGORY_ICONS[c.category]} size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-grotesk text-[10px] uppercase tracking-wider text-on-surface-variant">
                  {CATEGORY_LABELS[c.category]}
                </p>
                <p className="font-sora font-semibold text-on-surface tabular-nums">
                  {formatCurrency(Number(c.total))}
                </p>
              </div>
              <Icon name="chevron_right" className="text-outline" />
            </GlassCard>
          ))
        )}
      </div>

      {/* FORECAST */}
      <GlassCard radius="4xl" className="p-8 text-center relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-32 specular-highlight pointer-events-none" />
        <p className="font-grotesk text-[10px] uppercase tracking-[0.16em] text-primary">
          Previsão próximo mês
        </p>
        <p className="font-sora text-2xl md:text-headline-md mt-2">
          Projeção baseada nos últimos 90 dias
        </p>
        <div className="grid grid-cols-3 gap-2 mt-6">
          <Metric label="Expectativa" value={formatCurrency(Number(summary.currentMonth.total) * 1.05)} />
          <Metric label="Imposto DAS" value={formatCurrency(Number(summary.taxForecast.amount))} />
          <Metric
            label="Status MEI"
            value={summary.taxForecast.percentOfLimit > 80 ? 'Atenção' : 'Dentro do teto'}
            tone={summary.taxForecast.percentOfLimit > 80 ? 'warn' : 'ok'}
          />
        </div>
        <button
          onClick={() => exportCSV(expenses)}
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-on font-semibold shadow-liquid-strong hover:scale-105 active:scale-95 transition"
        >
          <Icon name="download" size={20} /> Exportar CSV
        </button>
      </GlassCard>
    </div>
  );
}

function Metric({ label, value, tone = 'ok' }: { label: string; value: string; tone?: 'ok' | 'warn' }) {
  return (
    <div className="px-2">
      <p className="font-grotesk text-[10px] uppercase tracking-wider text-on-surface-variant">
        {label}
      </p>
      <p
        className={`font-sora font-semibold text-lg md:text-xl mt-1 ${
          tone === 'warn' ? 'text-tertiary' : 'text-primary'
        }`}
      >
        {value}
      </p>
    </div>
  );
}
