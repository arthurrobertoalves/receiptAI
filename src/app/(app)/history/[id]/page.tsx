'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { GlassCard } from '@/components/ui/GlassCard';
import { Icon } from '@/components/ui/Icon';
import {
  CATEGORY_ICONS,
  CATEGORY_LABELS,
  formatCurrency,
  formatShortDate,
} from '@/lib/format';
import type { Category, Expense } from '@/types';

const CATEGORIES: Category[] = [
  'FOOD',
  'TRANSPORT',
  'SUPPLIES',
  'SOFTWARE',
  'UTILITIES',
  'SERVICES',
  'OTHER',
];

export default function ExpenseDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [receiptImageUrl, setReceiptImageUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<'amount' | 'merchant' | 'date' | 'category' | null>(null);
  const [form, setForm] = useState<Partial<Expense>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.id) return;
    fetch(`/api/expenses/${params.id}`)
      .then((r) => {
        if (!r.ok) throw new Error('Não encontrado');
        return r.json();
      })
      .then(async (d) => {
        setExpense(d.expense);
        setForm(d.expense);
        if (d.expense.receiptId) {
          const r = await fetch(`/api/receipts/${d.expense.receiptId}`).catch(() => null);
          if (r && r.ok) {
            const rd = await r.json();
            setReceiptImageUrl(rd.receipt?.imageUrl ?? null);
          }
        }
      })
      .catch((err) => setError(err.message));
  }, [params?.id]);

  async function saveAndConfirm() {
    if (!expense) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/expenses/${expense.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...form, confirmed: true }),
      });
      if (!res.ok) throw new Error('Falha ao salvar');
      router.push('/history');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro');
      setSaving(false);
    }
  }

  async function remove() {
    if (!expense) return;
    if (!confirm('Excluir esta despesa?')) return;
    await fetch(`/api/expenses/${expense.id}`, { method: 'DELETE' });
    router.push('/history');
    router.refresh();
  }

  if (error && !expense) {
    return (
      <GlassCard radius="4xl" className="p-10 text-center">
        <Icon name="error" size={40} className="text-error mb-2 inline-block" />
        <p>{error}</p>
      </GlassCard>
    );
  }
  if (!expense) {
    return (
      <div className="text-center text-on-surface-variant py-20">
        <Icon name="sync" className="animate-spin inline-block mr-2" /> Carregando recibo...
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in pb-24">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition"
      >
        <Icon name="arrow_back" size={20} /> Voltar
      </button>

      {/* Receipt image */}
      <GlassCard radius="4xl" className="p-2 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-32 specular-highlight pointer-events-none rounded-t-[32px]" />
        <div className="relative aspect-[4/3] md:aspect-[3/2] rounded-[28px] overflow-hidden bg-surface-container-low flex items-center justify-center">
          {receiptImageUrl ? (
            <img
              src={receiptImageUrl}
              alt="Recibo escaneado"
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(1.05) contrast(1.05)', mixBlendMode: 'multiply' }}
            />
          ) : (
            <Icon name="image" size={48} className="text-outline" />
          )}
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/90 text-primary-on font-grotesk text-[10px] uppercase tracking-wider liquid-glow backdrop-blur">
              <Icon name="auto_awesome" filled size={14} /> Dados extraídos pela IA
            </span>
          </div>
        </div>
      </GlassCard>

      {/* Fields bento */}
      <div className="grid grid-cols-2 gap-4">
        <EditableField
          className="col-span-2"
          label="Estabelecimento"
          value={form.merchant ?? ''}
          editing={editing === 'merchant'}
          onEdit={() => setEditing(editing === 'merchant' ? null : 'merchant')}
          input={
            <input
              autoFocus
              className="w-full bg-transparent outline-none font-sora text-2xl font-semibold text-primary"
              value={form.merchant ?? ''}
              onChange={(e) => setForm({ ...form, merchant: e.target.value })}
              onBlur={() => setEditing(null)}
            />
          }
          display={
            <p className="font-sora text-xl md:text-2xl font-semibold text-primary truncate">
              {form.merchant}
            </p>
          }
        />

        <EditableField
          label="Data"
          value={form.expenseDate ?? ''}
          editing={editing === 'date'}
          onEdit={() => setEditing(editing === 'date' ? null : 'date')}
          input={
            <input
              type="date"
              autoFocus
              className="w-full bg-transparent outline-none font-semibold text-on-surface"
              value={form.expenseDate ?? ''}
              onChange={(e) => setForm({ ...form, expenseDate: e.target.value })}
              onBlur={() => setEditing(null)}
            />
          }
          display={<p className="font-semibold text-on-surface">{formatShortDate(form.expenseDate ?? null)}</p>}
        />

        <EditableField
          label="Categoria"
          value={form.category ?? 'OTHER'}
          editing={editing === 'category'}
          onEdit={() => setEditing(editing === 'category' ? null : 'category')}
          input={
            <select
              autoFocus
              className="w-full bg-transparent outline-none font-semibold text-on-surface"
              value={form.category ?? 'OTHER'}
              onChange={(e) => {
                setForm({ ...form, category: e.target.value as Category });
                setEditing(null);
              }}
              onBlur={() => setEditing(null)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          }
          display={
            <p className="font-semibold text-on-surface flex items-center gap-2">
              <Icon name={CATEGORY_ICONS[form.category ?? 'OTHER']} className="text-primary" size={18} />
              {CATEGORY_LABELS[form.category ?? 'OTHER']}
            </p>
          }
        />

        <GlassCard radius="2xl" className="col-span-2 p-5 bg-primary/5">
          <div className="flex items-center justify-between">
            <p className="font-grotesk text-[10px] uppercase tracking-[0.14em] text-primary">
              Valor total
            </p>
            <span className="px-2.5 py-0.5 rounded-full bg-primary-container text-primary-on-container font-grotesk text-[10px] uppercase tracking-wider">
              {expense.currency}
            </span>
          </div>
          {editing === 'amount' ? (
            <input
              type="number"
              step="0.01"
              autoFocus
              className="w-full bg-transparent outline-none font-sora text-3xl md:text-headline-lg font-semibold text-primary tabular-nums mt-1"
              value={form.amount ?? 0}
              onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
              onBlur={() => setEditing(null)}
            />
          ) : (
            <button
              type="button"
              onClick={() => setEditing('amount')}
              className="block w-full text-left font-sora text-3xl md:text-headline-lg font-semibold text-primary tabular-nums mt-1 hover:underline decoration-primary/40 underline-offset-4"
            >
              {formatCurrency(form.amount ?? 0, expense.currency)}
            </button>
          )}
        </GlassCard>
      </div>

      <GlassCard
        radius="2xl"
        className="p-4 border-l-4 border-l-primary flex items-start gap-3"
      >
        <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center shrink-0">
          <Icon name="auto_awesome" filled size={20} />
        </div>
        <div>
          <p className="font-semibold text-primary">IA processou esse recibo</p>
          <p className="text-sm text-on-surface-variant">
            Confira os campos detectados e toque em <strong>Confirmar &amp; salvar</strong>. Você pode
            ajustar qualquer valor tocando nele.
          </p>
        </div>
      </GlassCard>

      {error && (
        <div className="rounded-2xl bg-error-container/70 text-error-on-container px-4 py-3 text-sm flex items-center gap-2">
          <Icon name="error" size={18} /> {error}
        </div>
      )}

      <div className="fixed bottom-28 md:bottom-8 right-5 md:right-10 z-40 flex gap-2">
        <button
          onClick={remove}
          className="w-12 h-12 rounded-full glass-strong text-error flex items-center justify-center hover:scale-105 transition"
          aria-label="Excluir"
        >
          <Icon name="delete" />
        </button>
        <button
          onClick={saveAndConfirm}
          disabled={saving}
          className={clsx(
            'inline-flex items-center gap-2 rounded-full bg-primary text-primary-on px-6 py-3 font-semibold shadow-liquid-strong hover:scale-105 active:scale-95 transition disabled:opacity-60',
          )}
        >
          {saving ? <Icon name="sync" className="animate-spin" size={20} /> : <Icon name="check_circle" filled size={20} />}
          {saving ? 'Salvando...' : 'Confirmar & salvar'}
        </button>
      </div>
    </div>
  );
}

function EditableField({
  label,
  className,
  display,
  input,
  editing,
  onEdit,
}: {
  label: string;
  value: string;
  className?: string;
  display: React.ReactNode;
  input: React.ReactNode;
  editing: boolean;
  onEdit: () => void;
}) {
  return (
    <GlassCard radius="2xl" className={clsx('p-5 relative group', className)}>
      <div className="flex items-start justify-between gap-2">
        <p className="font-grotesk text-[10px] uppercase tracking-[0.14em] text-on-surface-variant">
          {label}
        </p>
        <button
          onClick={onEdit}
          className="opacity-60 group-hover:opacity-100 text-outline hover:text-primary transition"
          aria-label="Editar"
        >
          <Icon name="edit" size={16} />
        </button>
      </div>
      <div className="mt-2">{editing ? input : display}</div>
    </GlassCard>
  );
}
