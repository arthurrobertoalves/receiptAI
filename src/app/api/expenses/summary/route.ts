import { NextResponse } from 'next/server';
import { HttpError, requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import type { Category, Expense } from '@/types';

function monthKey(iso: string) {
  return iso.slice(0, 7);
}

export async function GET() {
  try {
    const user = await requireUser();
    const all = await db.expenses.listForUser(user.id);

    const now = new Date();
    const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevKey = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`;

    const dateOf = (e: Expense) => e.createdAt.slice(0, 10);

    const current = all.filter((e) => monthKey(dateOf(e)) === currentKey);
    const previous = all.filter((e) => monthKey(dateOf(e)) === prevKey);

    const currentTotal = current.reduce((sum, e) => sum + e.amount, 0);
    const previousTotal = previous.reduce((sum, e) => sum + e.amount, 0);

    let deltaPercent = 0;
    let deltaDirection: 'up' | 'down' | 'flat' = 'flat';
    if (previousTotal > 0) {
      deltaPercent = Math.round(((currentTotal - previousTotal) / previousTotal) * 100);
      deltaDirection = deltaPercent > 0 ? 'up' : deltaPercent < 0 ? 'down' : 'flat';
    } else if (currentTotal > 0) {
      deltaPercent = 100;
      deltaDirection = 'up';
    }

    const byCategoryMap = new Map<Category, number>();
    for (const e of current) {
      byCategoryMap.set(e.category, (byCategoryMap.get(e.category) ?? 0) + e.amount);
    }
    const byCategory = Array.from(byCategoryMap.entries())
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total);

    const monthlyHistory: { key: string; total: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const total = all
        .filter((e) => monthKey(dateOf(e)) === key)
        .reduce((sum, e) => sum + e.amount, 0);
      monthlyHistory.push({ key, total });
    }

    const taxBase = currentTotal * 0.06;
    const taxForecast = {
      amount: Math.round(taxBase * 100) / 100,
      percentOfLimit: Math.min(100, Math.round((currentTotal / 8000) * 100)),
    };

    return NextResponse.json({
      currentMonth: { total: currentTotal, deltaPercent, deltaDirection },
      previousMonth: { total: previousTotal },
      byCategory,
      monthlyHistory,
      taxForecast,
      recentExpenses: all.slice(0, 5),
      totalCount: all.length,
    });
  } catch (err) {
    if (err instanceof HttpError)
      return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: 'Erro inesperado' }, { status: 500 });
  }
}
