import Link from 'next/link';
import { getSessionUser, toPublicUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusChip } from '@/components/ui/StatusChip';
import { Icon } from '@/components/ui/Icon';
import { ExpenseItem } from '@/components/receipt/ExpenseItem';
import { FAB } from '@/components/shell/FAB';
import { BodyClass } from '@/components/shell/BodyClass';
import { CATEGORY_LABELS, formatCurrency } from '@/lib/format';
import type { Category, Expense } from '@/types';

export const dynamic = 'force-dynamic';

function monthKey(iso: string) {
  return iso.slice(0, 7);
}

export default async function DashboardPage() {
  const session = await getSessionUser();
  const user = toPublicUser(session!);
  const all = await db.expenses.listForUser(user.id);

  const now = new Date();
  const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  // Use createdAt (scan date) so newly scanned expenses always appear in the current month,
  // regardless of the date printed on the receipt.
  const dateOf = (e: Expense) => e.createdAt.slice(0, 10);

  const current = all.filter((e) => monthKey(dateOf(e)) === currentKey);
  const currentTotal = current.reduce((sum, e) => sum + e.amount, 0);

  const byCategoryMap = new Map<Category, number>();
  for (const e of current) {
    byCategoryMap.set(e.category, (byCategoryMap.get(e.category) ?? 0) + e.amount);
  }
  const byCategory = Array.from(byCategoryMap.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);

  const topCategory = byCategory[0]?.category ?? null;
  const topShare = topCategory && currentTotal > 0 ? Math.round((byCategoryMap.get(topCategory)! / currentTotal) * 100) : 0;
  const donutValue = Math.max(8, Math.min(100, topShare || 65));
  const taxForecast = Math.round(currentTotal * 0.06 * 100) / 100;
  const taxPercent = Math.min(100, Math.round((currentTotal / 8000) * 100));
  const recent = all.slice(0, 4);

  return (
    <div className="space-y-6 animate-fade-in">
      <BodyClass className="bg-home" />
      <section>
        <h1 className="font-sora text-headline-md md:text-headline-lg">
          Olá, <span className="text-primary">{user.name.split(' ')[0]}</span>
        </h1>
        <p className="text-on-surface-variant mt-1">
          Sua saúde financeira está em fluxo constante.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* HERO */}
        <GlassCard radius="4xl" className="md:col-span-8 p-6 md:p-8 relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-60 h-60 rounded-full bg-primary-container/40 blur-3xl" />
          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-48 h-48 shrink-0">
              <div
                className="absolute inset-0 donut-conic animate-pulse-slow opacity-90"
                style={{ ['--donut' as any]: donutValue } as React.CSSProperties}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <p className="font-grotesk text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">
                  Total mês
                </p>
                <p className="font-sora text-3xl md:text-4xl font-semibold text-primary tabular-nums leading-tight mt-1">
                  {formatCurrency(currentTotal)}
                </p>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="font-sora text-2xl md:text-headline-md">Gastos mensais</h2>
              <p className="text-on-surface-variant mt-2 text-balance">
                {topCategory ? (
                  <>
                    Sua maior categoria é{' '}
                    <span className="font-semibold text-on-surface">
                      {CATEGORY_LABELS[topCategory]}
                    </span>{' '}
                    com {topShare}% do mês.
                  </>
                ) : (
                  'Comece escaneando seu primeiro recibo para ver insights aqui.'
                )}
              </p>
              <div className="flex gap-2 mt-4 justify-center md:justify-start">
                <StatusChip tone="processed" dot>
                  Saudável
                </StatusChip>
                <StatusChip tone="neutral">{user.profileType}</StatusChip>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* INSIGHT */}
        <GlassCard
          radius="4xl"
          className="md:col-span-4 p-6 bg-gradient-to-br from-primary-container/30 to-white/40 relative overflow-hidden"
        >
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary mb-4 shadow-glass">
            <Icon name="auto_awesome" filled />
          </div>
          <p className="font-grotesk text-[10px] uppercase tracking-[0.14em] text-primary">
            Insight inteligente
          </p>
          <p className="font-sora text-xl mt-2 text-balance leading-tight">
            {all.length === 0
              ? 'Bata sua primeira foto e a IA começa a aprender seus padrões.'
              : `Você já registrou ${all.length} gasto${all.length > 1 ? 's' : ''} — vamos cruzar dados para encontrar economias.`}
          </p>
          <Link
            href="/insights"
            className="mt-4 inline-flex items-center gap-1 font-grotesk text-[11px] uppercase tracking-wider text-primary hover:gap-2 transition-all"
          >
            Ver detalhes <Icon name="arrow_forward" size={16} />
          </Link>
        </GlassCard>

        {/* SCANS RECENTES */}
        <GlassCard radius="4xl" className="md:col-span-7 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-sora text-xl">Scans recentes</h3>
            <Link
              href="/history"
              className="font-grotesk text-[11px] uppercase tracking-wider text-primary hover:underline"
            >
              Ver tudo
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-outline-variant/60 p-8 text-center">
              <Icon name="receipt_long" size={32} className="text-outline mb-2 inline-block" />
              <p className="text-on-surface-variant">
                Nenhum recibo ainda. Toque no botão de câmera para começar.
              </p>
              <Link
                href="/scan"
                className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-full bg-primary text-primary-on font-semibold hover:bg-primary/90 transition"
              >
                <Icon name="camera_enhance" filled size={18} /> Escanear agora
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recent.map((e) => (
                <ExpenseItem key={e.id} expense={e} href={`/history/${e.id}`} />
              ))}
            </div>
          )}
        </GlassCard>

        {/* TAX FORECAST */}
        <GlassCard
          radius="4xl"
          className="md:col-span-5 p-6 bg-gradient-to-br from-white to-primary-fixed/40 relative overflow-hidden"
        >
          <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-primary-container/30 blur-3xl" />
          <div className="relative">
            <p className="font-grotesk text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">
              Previsão de imposto (DAS)
            </p>
            <p className="font-sora text-3xl font-semibold text-primary tabular-nums mt-1">
              {formatCurrency(taxForecast)}
            </p>
            <div className="mt-5 h-2 rounded-full bg-surface-container-high overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${taxPercent}%` }}
              />
            </div>
            <p className="text-sm text-on-surface-variant mt-3 text-balance">
              Você atingiu <span className="font-semibold text-on-surface">{taxPercent}%</span> do teto
              estimado para sua categoria.
            </p>
          </div>
        </GlassCard>
      </div>
      <FAB />
    </div>
  );
}
