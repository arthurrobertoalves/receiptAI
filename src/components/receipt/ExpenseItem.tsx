'use client';

import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusChip } from '@/components/ui/StatusChip';
import { Icon } from '@/components/ui/Icon';
import {
  CATEGORY_ICONS,
  CATEGORY_LABELS,
  CATEGORY_TONE,
  formatCurrency,
  formatDateTime,
  formatShortDate,
} from '@/lib/format';
import type { Expense } from '@/types';

export function ExpenseItem({ expense, href }: { expense: Expense; href?: string }) {
  const tone = CATEGORY_TONE[expense.category];
  const content = (
    <GlassCard
      radius="4xl"
      className="p-5 flex items-center gap-4 hover:-translate-y-0.5 transition-transform"
    >
      <div
        className={`w-14 h-14 rounded-2xl ${tone.bg} ${tone.text} flex items-center justify-center shrink-0`}
      >
        <Icon name={CATEGORY_ICONS[expense.category]} size={26} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-3 justify-between">
          <p className="font-sora font-semibold text-on-surface truncate">{expense.merchant}</p>
          <p className="font-sora font-bold text-on-surface tabular-nums shrink-0">
            {formatCurrency(expense.amount, expense.currency)}
          </p>
        </div>
        <div className="flex items-center gap-3 mt-1.5 text-on-surface-variant">
          <span className="text-sm">{CATEGORY_LABELS[expense.category]}</span>
          <span className="w-1 h-1 rounded-full bg-outline-variant" />
          <span className="text-sm">
            {expense.expenseDate ? formatShortDate(expense.expenseDate) : formatDateTime(expense.createdAt)}
          </span>
          <span className="ml-auto">
            <StatusChip tone={expense.confirmed ? 'processed' : 'pending'}>
              {expense.confirmed ? 'Confirmado' : 'Pendente'}
            </StatusChip>
          </span>
        </div>
      </div>
    </GlassCard>
  );
  return href ? (
    <Link href={href} className="block">
      {content}
    </Link>
  ) : (
    content
  );
}
